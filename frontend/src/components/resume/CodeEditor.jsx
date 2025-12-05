import React from 'react';

const CodeEditor = ({ latexCode, setLatexCode }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(latexCode);
    alert('Code copied to clipboard!');
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the code?')) {
      setLatexCode('');
    }
  };

  return (
    <div className="code-editor">
      <div className="code-editor-header">
        <span className="code-editor-title">LaTeX Code</span>
        <div className="code-editor-actions">
          <button className="icon-btn" onClick={handleCopy} title="Copy code">
            📋
          </button>
          <button className="icon-btn" onClick={handleClear} title="Clear code">
            🗑️
          </button>
        </div>
      </div>
      <div className="code-editor-content">
        <textarea
          value={latexCode}
          onChange={(e) => setLatexCode(e.target.value)}
          placeholder="LaTeX code will appear here..."
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default CodeEditor;