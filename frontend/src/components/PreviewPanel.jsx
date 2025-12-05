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
    
    // Remove preamble
    html = html.replace(/\\documentclass\[.*?\]{.*?}/g, '');
    html = html.replace(/\\usepackage(\[.*?\])?{.*?}/g, '');
    html = html.replace(/\\usepackage{[^}]+}/g, '');
    html = html.replace(/\\pagestyle{[^}]+}/g, '');
    html = html.replace(/\\setlength{[^}]+}{[^}]+}/g, '');
    html = html.replace(/\\addtolength{[^}]+}{[^}]+}/g, '');
    html = html.replace(/\\linespread{[^}]+}/g, '');
    html = html.replace(/\\setlist\[.*?\]{.*?}/g, '');
    html = html.replace(/\\newcommand{[^}]+}(\[.*?\])?{[^}]+}/g, '');
    html = html.replace(/\\raggedright/g, '');
    html = html.replace(/\\begin{document}/g, '');
    html = html.replace(/\\end{document}/g, '');
    html = html.replace(/%.*$/gm, '');
    
    // Parse custom section command
    html = html.replace(/\\ressection{([^}]+)}/g, '<div class="resume-section"><h2>$1</h2><hr class="section-line"></div>');
    
    // Parse name/title (Huge + textbf)
    html = html.replace(/{\\Huge\s+\\textbf{([^}]+)}}/g, '<h1 class="resume-name">$1</h1>');
    
    // Parse contact line
    html = html.replace(/\\small\\ContactLine\\normalsize/g, '<div class="contact-line-wrapper"></div>');
    html = html.replace(/\\ContactLine/g, '<div class="contact-line"></div>');
    
    // Parse text formatting
    html = html.replace(/\\textbf{([^}]+)}/g, '<strong>$1</strong>');
    html = html.replace(/\\textit{([^}]+)}/g, '<em>$1</em>');
    html = html.replace(/\\textsc{\\large\s+([^}]+)}/g, '<span style="font-variant: small-caps; font-size: 1.1em;">$1</span>');
    html = html.replace(/\\small/g, '<span class="small-text">');
    html = html.replace(/\\normalsize/g, '</span>');
    
    // Parse links
    html = html.replace(/\\href{mailto:([^}]+)}{([^}]+)}/g, '<a href="mailto:$1">$2</a>');
    html = html.replace(/\\href{([^}]+)}{([^}]+)}/g, '<a href="$1">$2</a>');
    
    // Parse hfill for date alignment
    html = html.replace(/\\hfill\s*/g, '<span class="date-right">');
    
    // Parse line breaks
    html = html.replace(/\\\\\[?\d*\.?\d*p?t?\]?/g, '<br>');
    html = html.replace(/\\\\(?!\w)/g, '<br>');
    
    // Parse spacing
    html = html.replace(/\\medskip/g, '<div class="medskip"></div>');
    html = html.replace(/\\vspace{[^}]+}/g, '<div class="vspace"></div>');
    
    // Parse special characters
    html = html.replace(/\\\;/g, ' ');
    html = html.replace(/\$\|\$/g, ' | ');
    html = html.replace(/--/g, '–');
    html = html.replace(/\\%/g, '%');
    html = html.replace(/\\\(/g, '(');
    html = html.replace(/\\\)/g, ')');
    
    // Parse horizontal rules
    html = html.replace(/\\noindent\\hrulefill\\par/g, '<hr class="section-line">');
    html = html.replace(/\\hrulefill/g, '<hr class="section-line">');
    
    // Clean up commands
    html = html.replace(/\\noindent/g, '');
    html = html.replace(/\\par/g, '<br>');
    
    // Split into lines and wrap appropriately
    const lines = html.split('\n').map(line => line.trim()).filter(line => line);
    const processed = [];
    
    for (let line of lines) {
      if (line.includes('<h1') || line.includes('<h2') || line.includes('<hr') || 
          line.includes('<div class="resume-section"') || line.includes('</div>') ||
          line.includes('<div class="medskip"') || line.includes('<div class="vspace"') ||
          line.includes('<div class="contact-line')) {
        processed.push(line);
      } else if (line.includes('<br>')) {
        processed.push(line);
      } else if (line.length > 0) {
        processed.push('<p class="resume-text">' + line + '</p>');
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