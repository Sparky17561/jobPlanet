import React from 'react';

const RightSidebar = ({ templates, selectedTemplate, onTemplateSelect, isOpen, onClose }) => {
  const parseLatexForPreview = (latex) => {
    let html = latex;
    
    html = html.replace(/\\documentclass\[.*?\]{.*?}/g, '');
    html = html.replace(/\\usepackage(\[.*?\])?{.*?}/g, '');
    html = html.replace(/\\begin{document}/g, '');
    html = html.replace(/\\end{document}/g, '');
    html = html.replace(/%.*$/gm, '');
    html = html.replace(/\\definecolor{.*?}{.*?}{.*?}/g, '');
    html = html.replace(/\\pagestyle{.*?}/g, '');
    
    html = html.replace(/\\begin{center}/g, '<div style="text-align: center; margin: 4px 0;">');
    html = html.replace(/\\end{center}/g, '</div>');
    html = html.replace(/\\textbf{\\Huge\s+([^}]+)}/g, '<div style="font-size: 14px; font-weight: bold; margin: 2px 0;">$1</div>');
    html = html.replace(/\\textbf{\\LARGE\s+([^}]+)}/g, '<div style="font-size: 12px; font-weight: bold;">$1</div>');
    html = html.replace(/\\textbf{\\large\s+([^}]+)}/g, '<div style="font-size: 10px; font-weight: bold;">$1</div>');
    html = html.replace(/\\textbf{([^}]+)}/g, '<strong>$1</strong>');
    html = html.replace(/\\textit{([^}]+)}/g, '<em style="font-size: 8px;">$1</em>');
    html = html.replace(/\\textcolor{[^}]+}{([^}]+)}/g, '$1');
    html = html.replace(/\\section\*?{([^}]+)}/g, '<div style="font-size: 9px; font-weight: bold; margin: 6px 0 3px; border-bottom: 1px solid #ccc; padding-bottom: 2px;">$1</div>');
    html = html.replace(/\\noindent/g, '');
    html = html.replace(/\\rule{.*?}{.*?}/g, '<hr style="margin: 3px 0; border: none; border-top: 1px solid #000;">');
    
    html = html.replace(/\\begin{itemize}(\[.*?\])?/g, '');
    html = html.replace(/\\end{itemize}/g, '');
    html = html.replace(/\\item\s+/g, '• ');
    
    html = html.replace(/\\vspace{.*?}/g, '');
    html = html.replace(/\\\\\[?\d*\.?\d*p?t?\]?/g, '<br>');
    html = html.replace(/\\\\/g, '<br>');
    html = html.replace(/\\hfill/g, '');
    html = html.replace(/\\small/g, '');
    html = html.replace(/\\large/g, '');
    html = html.replace(/\$\|?\$/g, ' | ');
    html = html.replace(/--/g, '–');
    
    html = html.replace(/\\href{[^}]+}{([^}]+)}/g, '$1');
    
    html = html.replace(/\n{2,}/g, '<br>');
    
    html = html.split('\n').map(line => {
      line = line.trim();
      if (line && !line.startsWith('<')) {
        return '<div style="font-size: 7px; line-height: 1.2; margin: 1px 0;">' + line + '</div>';
      }
      return line;
    }).join('');
    
    return html;
  };

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />
      <aside className={`right-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="right-sidebar-header">
          <h3>Resume Templates</h3>
          <button className="close-sidebar-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="template-list">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`template-item ${selectedTemplate === template.id ? 'active' : ''}`}
              onClick={() => onTemplateSelect(template.id)}
            >
              <div className="template-preview">
                <div 
                  className="template-preview-render"
                  dangerouslySetInnerHTML={{ __html: parseLatexForPreview(template.code) }}
                />
              </div>
              <div className="template-info">
                <div className="template-name">{template.name}</div>
                <div className="template-desc">{template.description}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default RightSidebar;