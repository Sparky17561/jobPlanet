import React from 'react';

const Sidebar = ({ templates, selectedTemplate, onTemplateSelect }) => {
  // Function to get a preview snippet from LaTeX code
  const getPreviewText = (code) => {
    // Extract first few meaningful lines for preview
    const lines = code.split('\n').filter(line => 
      !line.trim().startsWith('%') && 
      !line.trim().startsWith('\\document') &&
      !line.trim().startsWith('\\usepackage') &&
      line.trim().length > 0
    );
    return lines.slice(0, 8).join('\n');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Resume Templates</h3>
      </div>
      <div className="template-list">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`template-item ${selectedTemplate === template.id ? 'active' : ''}`}
            onClick={() => onTemplateSelect(template.id)}
          >
            <div className="template-preview">
              <div className="template-preview-content">
                {getPreviewText(template.code)}
              </div>
            </div>
            <div className="template-info">
              <div className="template-name">{template.name}</div>
              <div className="template-desc">{template.description}</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;