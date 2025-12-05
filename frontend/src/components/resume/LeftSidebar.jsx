import React from 'react';

const LeftSidebar = ({ resumes, selectedResumeId, onSelectResume, onNewResume }) => {
  return (
    <aside className="left-sidebar">
      <div className="left-sidebar-header">
        <button className="new-resume-btn" onClick={onNewResume}>
          + New Resume
        </button>
      </div>
      <div className="resume-list-container">
        <div className="resume-list-title">Your Resumes</div>
        <div className="resume-list">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className={`resume-item ${selectedResumeId === resume.id ? 'active' : ''}`}
              onClick={() => onSelectResume(resume.id)}
            >
              <div className="resume-item-name">{resume.name}</div>
              <div className="resume-item-date">{resume.date}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;