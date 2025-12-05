import React from 'react';

const InputPanel = ({ 
  jobDescription, 
  setJobDescription, 
  resumeFile,
  setResumeFile,
  onGenerate, 
  isGenerating,
  onToggleTemplates
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log('File loaded:', file.name);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="input-panel">
      <div className="input-grid">
        <div className="input-group">
          <label htmlFor="job-description">Job Description *</label>
          <textarea
            id="job-description"
            placeholder="Paste the job description here... Include required skills, qualifications, and responsibilities."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="resume-upload">Upload Resume (Optional)</label>
          <div className="file-upload-area">
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
            />
            {!resumeFile ? (
              <>
                <div className="file-upload-icon">📄</div>
                <div className="file-upload-text">
                  <strong>Click to upload</strong> or drag and drop<br/>
                  PDF, DOC, DOCX, or TXT
                </div>
              </>
            ) : (
              <>
                <div className="file-upload-icon">✅</div>
                <div className="file-name">{resumeFile.name}</div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="generate-btn-container">
        <button 
          className="templates-toggle-btn"
          onClick={onToggleTemplates}
        >
          📋 Templates
        </button>
        <button 
          className="generate-btn" 
          onClick={onGenerate}
          disabled={isGenerating || !jobDescription.trim()}
        >
          {isGenerating ? '⚡ Generating...' : '✨ Generate Resume'}
        </button>
      </div>
    </div>
  );
};

export default InputPanel;