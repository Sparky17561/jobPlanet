import React, { useState } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import { Mail, FileText, Loader2, Copy, Check } from "lucide-react";
import "./Dashboard.css";

const ColdReplyGenerator = () => {
  const [activeTab, setActiveTab] = useState("email"); // "email" or "reply"
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Email Generation State
  const [emailForm, setEmailForm] = useState({
    job_description: "",
    company_name: "",
    tone: "professional",
    gemini_api_key: "",
    resume_file: null,
  });

  // Reply Generation State
  const [replyForm, setReplyForm] = useState({
    job_description: "",
    company_name: "",
    gemini_api_key: "",
    resume_file: null,
  });

  // Output State
  const [emailOutput, setEmailOutput] = useState({
    subject: "",
    body: "",
    sources: [],
  });

  const [replyOutput, setReplyOutput] = useState({
    cover_letter: "",
    sources: [],
  });

  const handleEmailInputChange = (e) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReplyInputChange = (e) => {
    const { name, value } = e.target;
    setReplyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "email") {
        setEmailForm((prev) => ({ ...prev, resume_file: file }));
      } else {
        setReplyForm((prev) => ({ ...prev, resume_file: file }));
      }
    }
  };

  const handleEmailGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailOutput({ subject: "", body: "", sources: [] });

    const formData = new FormData();
    formData.append("job_description", emailForm.job_description);
    formData.append("company_name", emailForm.company_name);
    formData.append("tone", emailForm.tone);
    formData.append("gemini_api_key", emailForm.gemini_api_key);
    formData.append("resume_file", emailForm.resume_file);

    try {
      const response = await fetch("http://localhost:8000/coldconnect/cold-mail/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setEmailOutput({
          subject: data.subject || "",
          body: data.body || "",
          sources: data.sources || [],
        });
      } else {
        alert(data.error || "Failed to generate email");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplyGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setReplyOutput({ cover_letter: "", sources: [] });

    const formData = new FormData();
    formData.append("job_description", replyForm.job_description);
    formData.append("company_name", replyForm.company_name);
    formData.append("gemini_api_key", replyForm.gemini_api_key);
    formData.append("resume_file", replyForm.resume_file);

    try {
      const response = await fetch("http://localhost:8000/coldconnect/cover-letter/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setReplyOutput({
          cover_letter: data.cover_letter || "",
          sources: data.sources || [],
        });
      } else {
        alert(data.error || "Failed to generate reply");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dashboard-app">
      <DashboardHeader />
      <div className="dashboard-main-container">
        <DashboardSidebar />
        <div className="dashboard-content-area">
          <div className="cold-reply-content">
            {/* Tabs */}
            <div className="cold-reply-tabs">
              <button
                onClick={() => setActiveTab("email")}
                className={`cold-reply-tab ${activeTab === "email" ? "active" : ""}`}
              >
                <Mail className="w-5 h-5" />
                <span>Email Generation</span>
              </button>
              <button
                onClick={() => setActiveTab("reply")}
                className={`cold-reply-tab ${activeTab === "reply" ? "active" : ""}`}
              >
                <FileText className="w-5 h-5" />
                <span>Reply Generation</span>
              </button>
            </div>

            {/* Email Generation Tab */}
            {activeTab === "email" && (
              <div className="cold-reply-form-container">
                <form onSubmit={handleEmailGenerate} className="cold-reply-form">
                  <div className="form-section">
                    <h2 className="form-section-title">Generate Cold Email</h2>
                    
                    <div className="form-group">
                      <label htmlFor="email-job-description" className="form-label">
                        Job Description *
                      </label>
                      <textarea
                        id="email-job-description"
                        name="job_description"
                        value={emailForm.job_description}
                        onChange={handleEmailInputChange}
                        placeholder="e.g., Software Engineer, Product Manager..."
                        className="form-textarea"
                        required
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email-company-name" className="form-label">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        id="email-company-name"
                        name="company_name"
                        value={emailForm.company_name}
                        onChange={handleEmailInputChange}
                        placeholder="e.g., Google, Microsoft..."
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email-tone" className="form-label">
                        Tone *
                      </label>
                      <select
                        id="email-tone"
                        name="tone"
                        value={emailForm.tone}
                        onChange={handleEmailInputChange}
                        className="form-select"
                        required
                      >
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="enthusiastic">Enthusiastic</option>
                        <option value="formal">Formal</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email-resume" className="form-label">
                        Resume (PDF) *
                      </label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          id="email-resume"
                          accept=".pdf"
                          onChange={(e) => handleFileChange(e, "email")}
                          className="file-input"
                          required
                        />
                        <label htmlFor="email-resume" className="file-upload-label">
                          {emailForm.resume_file
                            ? emailForm.resume_file.name
                            : "Choose PDF file"}
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email-api-key" className="form-label">
                        Gemini API Key *
                      </label>
                      <input
                        type="password"
                        id="email-api-key"
                        name="gemini_api_key"
                        value={emailForm.gemini_api_key}
                        onChange={handleEmailInputChange}
                        placeholder="Enter your Gemini API key"
                        className="form-input"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="form-submit-btn"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5" />
                          <span>Generate Email</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Output Section */}
                {(emailOutput.subject || emailOutput.body || isLoading) && (
                  <div className="output-section">
                    <div className="output-header">
                      <h3 className="output-title">Generated Email</h3>
                      {(emailOutput.subject || emailOutput.body) && (
                        <button
                          onClick={() =>
                            copyToClipboard(
                              `Subject: ${emailOutput.subject}\n\n${emailOutput.body}`
                            )
                          }
                          className="copy-btn"
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      )}
                    </div>

                    {isLoading ? (
                      <div className="loading-container">
                        <Loader2 className="w-8 h-8 animate-spin text-white/60" />
                        <p className="loading-text">Generating your email...</p>
                      </div>
                    ) : (
                      <div className="output-content">
                        {emailOutput.subject && (
                          <div className="output-field">
                            <label className="output-label">Subject:</label>
                            <div className="output-value">{emailOutput.subject}</div>
                          </div>
                        )}
                        {emailOutput.body && (
                          <div className="output-field">
                            <label className="output-label">Body:</label>
                            <div className="output-value email-body">
                              {emailOutput.body.split("\n").map((line, idx) => (
                                <React.Fragment key={idx}>
                                  {line}
                                  {idx < emailOutput.body.split("\n").length - 1 && (
                                    <br />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}
                        {emailOutput.sources && emailOutput.sources.length > 0 && (
                          <div className="output-sources">
                            <label className="output-label">Sources:</label>
                            <ul className="sources-list">
                              {emailOutput.sources.map((source, idx) => (
                                <li key={idx} className="source-item">
                                  {source}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Reply Generation Tab */}
            {activeTab === "reply" && (
              <div className="cold-reply-form-container">
                <form onSubmit={handleReplyGenerate} className="cold-reply-form">
                  <div className="form-section">
                    <h2 className="form-section-title">Generate Cover Letter Reply</h2>
                    
                    <div className="form-group">
                      <label htmlFor="reply-job-description" className="form-label">
                        Job Description *
                      </label>
                      <textarea
                        id="reply-job-description"
                        name="job_description"
                        value={replyForm.job_description}
                        onChange={handleReplyInputChange}
                        placeholder="e.g., Software Engineer, Product Manager..."
                        className="form-textarea"
                        required
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="reply-company-name" className="form-label">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        id="reply-company-name"
                        name="company_name"
                        value={replyForm.company_name}
                        onChange={handleReplyInputChange}
                        placeholder="e.g., Google, Microsoft..."
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="reply-resume" className="form-label">
                        Resume (PDF) *
                      </label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          id="reply-resume"
                          accept=".pdf"
                          onChange={(e) => handleFileChange(e, "reply")}
                          className="file-input"
                          required
                        />
                        <label htmlFor="reply-resume" className="file-upload-label">
                          {replyForm.resume_file
                            ? replyForm.resume_file.name
                            : "Choose PDF file"}
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="reply-api-key" className="form-label">
                        Gemini API Key *
                      </label>
                      <input
                        type="password"
                        id="reply-api-key"
                        name="gemini_api_key"
                        value={replyForm.gemini_api_key}
                        onChange={handleReplyInputChange}
                        placeholder="Enter your Gemini API key"
                        className="form-input"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="form-submit-btn"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-5 h-5" />
                          <span>Generate Cover Letter</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Output Section */}
                {(replyOutput.cover_letter || isLoading) && (
                  <div className="output-section">
                    <div className="output-header">
                      <h3 className="output-title">Generated Cover Letter</h3>
                      {replyOutput.cover_letter && (
                        <button
                          onClick={() => copyToClipboard(replyOutput.cover_letter)}
                          className="copy-btn"
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      )}
                    </div>

                    {isLoading ? (
                      <div className="loading-container">
                        <Loader2 className="w-8 h-8 animate-spin text-white/60" />
                        <p className="loading-text">Generating your cover letter...</p>
                      </div>
                    ) : (
                      <div className="output-content">
                        {replyOutput.cover_letter && (
                          <div className="output-field">
                            <div className="output-value cover-letter-body">
                              {replyOutput.cover_letter.split("\n").map((line, idx) => (
                                <React.Fragment key={idx}>
                                  {line}
                                  {idx < replyOutput.cover_letter.split("\n").length - 1 && (
                                    <br />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}
                        {replyOutput.sources && replyOutput.sources.length > 0 && (
                          <div className="output-sources">
                            <label className="output-label">Sources:</label>
                            <ul className="sources-list">
                              {replyOutput.sources.map((source, idx) => (
                                <li key={idx} className="source-item">
                                  {source}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColdReplyGenerator;

