import React, { useState, useRef } from 'react';

const PreviewPanel = ({ latexCode }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const contentRef = useRef(null);

  // Enhanced LaTeX to HTML conversion
  const parseLatexToHTML = (latex) => {
    if (!latex) return '<p style="color: #666; text-align: center; margin-top: 40px;">No content to preview</p>';
    
    let html = latex;
    
    // Remove preamble and document structure
    html = html.replace(/\\documentclass\[.*?\]{.*?}/g, '');
    html = html.replace(/\\usepackage(\[.*?\])?{.*?}/g, '');
    html = html.replace(/\\pagestyle{[^}]+}/g, '');
    html = html.replace(/\\setlength{[^}]+}{[^}]+}/g, '');
    html = html.replace(/\\addtolength{[^}]+}{[^}]+}/g, '');
    html = html.replace(/\\linespread{[^}]+}/g, '');
    html = html.replace(/\\setlist\[.*?\]{.*?}/g, '');
    html = html.replace(/\\newcommand{[^}]+}(\[.*?\])?{[^}]+}/g, '');
    html = html.replace(/\\raggedright/g, '');
    html = html.replace(/\\begin{document}/g, '');
    html = html.replace(/\\end{document}/g, '');
    html = html.replace(/%.*$/gm, ''); // Remove comments
    
    // Helper function to find matching closing brace
    const findMatchingBrace = (text, startPos) => {
      let depth = 1;
      let i = startPos + 1;
      while (i < text.length && depth > 0) {
        if (text[i] === '{') depth++;
        if (text[i] === '}') depth--;
        i++;
      }
      return depth === 0 ? i - 1 : -1;
    };

    // Helper function to process text content (formatting, links, etc.)
    const processText = (text) => {
      if (!text) return '';
      
      let processed = text;
      
      // Parse nested commands first - handle \textbf{\Huge ...} and similar
      processed = processed.replace(/\\textbf{\\Huge\s+([^}]+)}/g, '<strong style="font-size: 28pt;">$1</strong>');
      processed = processed.replace(/\\textbf{\\LARGE\s+([^}]+)}/g, '<strong style="font-size: 24pt;">$1</strong>');
      processed = processed.replace(/\\textbf{\\large\s+([^}]+)}/g, '<strong style="font-size: 14pt;">$1</strong>');
      
      // Parse links (before other formatting to avoid conflicts)
      processed = processed.replace(/\\href{mailto:([^}]+)}{([^}]+)}/g, '<a href="mailto:$1" style="color: #0066cc; text-decoration: none;">$2</a>');
      processed = processed.replace(/\\href{([^}]+)}{([^}]+)}/g, '<a href="$1" style="color: #0066cc; text-decoration: none;">$2</a>');
      
      // Parse text formatting - process from right to left to handle nested braces
      // Process \textit first (usually nested inside \textbf)
      let changed = true;
      let iterations = 0;
      while (changed && iterations < 20) {
        const before = processed;
        // Find and replace innermost \textit{...}
        processed = processed.replace(/\\textit{([^{}]+)}/g, '<em>$1</em>');
        if (before === processed) break;
        iterations++;
      }
      
      // Then process \textbf{...} - this will handle cases like \textbf{text} and \textbf{text with <em>nested</em>}
      iterations = 0;
      changed = true;
      while (changed && iterations < 20) {
        const before = processed;
        // Simple case: \textbf{text without braces}
        processed = processed.replace(/\\textbf{([^{}]+)}/g, '<strong>$1</strong>');
        // Case with already processed HTML inside
        processed = processed.replace(/\\textbf{([^}]*<[^>]+>[^}]*)}/g, '<strong>$1</strong>');
        if (before === processed) break;
        iterations++;
      }
      
      // Parse special characters
      processed = processed.replace(/\$\|\$/g, ' | ');
      processed = processed.replace(/--/g, '–');
      processed = processed.replace(/\\%/g, '%');
      
      return processed;
    };
    
    // Handle itemize environment with proper nesting (do this before other replacements)
    html = html.replace(/\\begin{itemize}(\[[^\]]*\])?([\s\S]*?)\\end{itemize}/g, (match, options, content) => {
      // Split by \item, but preserve the content
      const items = [];
      let currentItem = '';
      let depth = 0;
      let inBraces = 0;
      
      for (let i = 0; i < content.length; i++) {
        const char = content[i];
        const nextChars = content.substring(i, i + 5);
        
        if (nextChars === '\\item' && inBraces === 0 && depth === 0) {
          if (currentItem.trim()) {
            items.push(currentItem.trim());
          }
          currentItem = '';
          i += 4; // Skip '\\item'
          // Skip whitespace after \item
          while (i + 1 < content.length && /\s/.test(content[i + 1])) {
            i++;
          }
          continue;
        }
        
        if (char === '{') inBraces++;
        if (char === '}') inBraces--;
        if (char === '\\' && content.substring(i, i + 6) === '\\begin') depth++;
        if (char === '\\' && content.substring(i, i + 4) === '\\end') depth--;
        
        currentItem += char;
      }
      
      if (currentItem.trim()) {
        items.push(currentItem.trim());
      }
      
      const itemList = items.map(item => {
        let processedItem = item.trim();
        
        // Process nested itemize if any
        processedItem = processedItem.replace(/\\begin{itemize}(\[[^\]]*\])?([\s\S]*?)\\end{itemize}/g, (m, opt, cont) => {
          const nestedItems = cont.split(/\\item\s+/).filter(i => i.trim());
          return `<ul style="margin-left: 20px; margin-top: 4px; margin-bottom: 4px;">${nestedItems.map(ni => `<li style="margin-bottom: 2px;">${processText(ni.trim())}</li>`).join('')}</ul>`;
        });
        
        // Process text formatting - handle \textbf and \textit with nested braces
        // This needs to handle cases like \item \textbf{Backend/Frameworks:} ...
        processedItem = processText(processedItem);
        
        // Handle line breaks
        processedItem = processedItem.replace(/\\\\\[?\d*\.?\d*p?t?\]?/g, '<br>');
        
        // Handle hfill for right alignment
        processedItem = processedItem.replace(/\\hfill\s*/g, '<span style="float: right;">');
        
        // Close hfill spans properly
        processedItem = processedItem.replace(/(<span style="float: right;">[^<]*?)(<br>|$|<\/li>|<\/strong>|<\/em>)/g, (m, content, end) => {
          if (!content.includes('</span>')) {
            return content + '</span>' + end;
          }
          return m;
        });
        
        // Clean up any remaining LaTeX commands
        processedItem = processedItem.replace(/\\vspace{[^}]+}/g, '');
        processedItem = processedItem.replace(/\\noindent\s+/g, '');
        
        return `<li style="margin-bottom: 4px; list-style-type: disc;">${processedItem}</li>`;
      }).join('');
      
      return `<ul style="margin-left: 15px; margin-bottom: 10px; padding-left: 0;">${itemList}</ul>`;
    });
    
    // Handle center environment
    html = html.replace(/\\begin{center}([\s\S]*?)\\end{center}/g, (match, content) => {
      let processed = content.trim();
      
      // Handle \textbf{\Huge ...} pattern first - this is the name
      processed = processed.replace(/\\textbf{\\Huge\s+([^}]+)}/g, '<h1 style="font-size: 28pt; font-weight: bold; margin-bottom: 4px; text-align: center; line-height: 1.2;">$1</h1>');
      
      // Process the rest of the content
      processed = processText(processed);
      
      // Handle small text spans
      processed = processed.replace(/\\small\s+/g, '<span style="font-size: 0.9em;">');
      processed = processed.replace(/\\normalsize\s+/g, '</span>');
      
      // Handle line breaks
      processed = processed.replace(/\\\\\[?\d*\.?\d*p?t?\]?/g, '<br>');
      
      // Handle vspace
      processed = processed.replace(/\\vspace{(-?\d+(?:\.\d+)?)pt}/g, (match, value) => {
        const spacing = parseFloat(value);
        if (spacing < 0) {
          return `<div style="margin-top: ${spacing}pt; height: 0;"></div>`;
        }
        return `<div style="height: ${spacing}pt; margin: 0; padding: 0;"></div>`;
      });
      
      return `<div style="text-align: center; margin-bottom: 10px;">${processed}</div>`;
    });
    
    // Handle justify environment
    html = html.replace(/\\begin{justify}([\s\S]*?)\\end{justify}/g, (match, content) => {
      let processed = processText(content.trim());
      processed = processed.replace(/\\\\\[?\d*\.?\d*p?t?\]?/g, '<br>');
      return `<div style="text-align: justify; text-justify: inter-word; margin-bottom: 10px;">${processed}</div>`;
    });
    
    // Parse section* commands
    html = html.replace(/\\section\*{([^}]+)}/g, '<h2 class="resume-section-title">$1</h2>');
    
    // Parse vspace with proper spacing (including negative values)
    html = html.replace(/\\vspace{(-?\d+(?:\.\d+)?)pt}/g, (match, value) => {
      const spacing = parseFloat(value);
      if (spacing < 0) {
        return `<div style="margin-top: ${spacing}pt; height: 0;"></div>`;
      }
      return `<div style="height: ${spacing}pt; margin: 0; padding: 0;"></div>`;
    });
    
    // Parse hfill for right alignment in regular text (not in lists)
    html = html.replace(/([^<>\n]*?)\\hfill\s*([^<>\n]*?)(\\\\)/g, (match, left, right, br) => {
      return `<div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>${processText(left.trim())}</span><span>${processText(right.trim())}</span></div>`;
    });
    html = html.replace(/([^<>\n]*?)\\hfill\s*([^<>\n]*?)(\n|$)/g, (match, left, right, end) => {
      if (left.trim() || right.trim()) {
        return `<div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>${processText(left.trim())}</span><span>${processText(right.trim())}</span></div>${end}`;
      }
      return match;
    });
    
    // Parse line breaks
    html = html.replace(/\\\\\[?\d*\.?\d*p?t?\]?/g, '<br>');
    html = html.replace(/\\\\(?!\w)/g, '<br>');
    
    // Clean up commands
    html = html.replace(/\\noindent\s+/g, '');
    html = html.replace(/\\par\s*/g, '<br>');
    
    // Process remaining text that hasn't been wrapped
    const lines = html.split('\n').map(line => line.trim()).filter(line => line && !line.match(/^[\\{}]*$/));
    const processed = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip if already wrapped in HTML tags
      if (line.startsWith('<') || line.match(/^<[^>]+>.*<\/[^>]+>$/)) {
        processed.push(line);
        continue;
      }
      
      // Process and wrap plain text lines
      if (line.length > 0) {
        let processedLine = processText(line);
        // Handle remaining formatting
        processedLine = processedLine.replace(/\\textbf{([^}]+)}/g, '<strong>$1</strong>');
        processedLine = processedLine.replace(/\\textit{([^}]+)}/g, '<em>$1</em>');
        processedLine = processedLine.replace(/\\hfill\s*/g, '');
        processedLine = processedLine.replace(/\\\\\[?\d*\.?\d*p?t?\]?/g, '<br>');
        
        if (processedLine.trim() && !processedLine.match(/^[\\{}]*$/)) {
          processed.push(`<p class="resume-text" style="margin-bottom: 8px;">${processedLine}</p>`);
        }
      }
    }
    
    return processed.join('\n');
  };

  const handleDownload = () => {
    alert('PDF download will be implemented with LaTeX compiler backend');
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.3));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handleFitWidth = () => {
    if (contentRef.current) {
      const containerWidth = contentRef.current.offsetWidth - 60;
      const paperWidth = 794;
      const newZoom = containerWidth / paperWidth;
      setZoomLevel(Math.max(0.3, Math.min(3, newZoom)));
    }
  };

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setZoomLevel(prev => Math.max(0.3, Math.min(3, prev + delta)));
    }
  };

  // Pan/drag functionality
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setStartX(e.pageX - contentRef.current.offsetLeft);
    setStartY(e.pageY - contentRef.current.offsetTop);
    setScrollLeft(contentRef.current.scrollLeft);
    setScrollTop(contentRef.current.scrollTop);
    contentRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - contentRef.current.offsetLeft;
    const y = e.pageY - contentRef.current.offsetTop;
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    contentRef.current.scrollLeft = scrollLeft - walkX;
    contentRef.current.scrollTop = scrollTop - walkY;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (contentRef.current) {
      contentRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (contentRef.current) {
      contentRef.current.style.cursor = 'grab';
    }
  };

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <span className="preview-title">Preview</span>
        <div className="preview-actions">
          <button className="preview-btn" onClick={handleZoomOut} title="Zoom Out (Ctrl + Scroll)">−</button>
          <span className="zoom-level" onClick={handleResetZoom} title="Click to reset zoom" style={{cursor: 'pointer'}}>
            {Math.round(zoomLevel * 100)}%
          </span>
          <button className="preview-btn" onClick={handleZoomIn} title="Zoom In (Ctrl + Scroll)">+</button>
          <button className="preview-btn" onClick={handleFitWidth} title="Fit to Width">⬌</button>
          <button className="preview-btn" onClick={handleDownload}>📥 PDF</button>
        </div>
      </div>
      <div 
        className="preview-content" 
        ref={contentRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="preview-wrapper" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}>
          <div className="preview-paper">
            <div dangerouslySetInnerHTML={{ __html: parseLatexToHTML(latexCode) }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;