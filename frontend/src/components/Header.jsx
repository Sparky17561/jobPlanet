import React from 'react';

const Header = ({ resumeName, setResumeName, onSave }) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">📄</div>
        <h1 className="header-title">LaTeX Resume Builder</h1>
      </div>
      <div className="header-center">
        <input
          type="text"
          className="resume-name-input"
          value={resumeName}
          onChange={(e) => setResumeName(e.target.value)}
          placeholder="Resume Name"
        />
      </div>
      <div className="header-right">
        <button className="header-btn btn-secondary" onClick={onSave}>
          Save
        </button>
        <button className="header-btn btn-secondary">
          Download PDF
        </button>
        <button className="header-btn btn-primary">
          Export
        </button>
      </div>
    </header>
  );
};

export default Header;