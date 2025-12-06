import React, { useState } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import { useAuth } from "../contexts/AuthContext";
import { Mail, FileText, Loader2, Copy, Check, MessageSquare } from "lucide-react";
import "./Dashboard.css";

const ColdReplyGenerator = () => {
  const { geminiKey } = useAuth();
  const [activeTab, setActiveTab] = useState("email"); // "email", "cover-letter", or "cold-dm"
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Email Generation State
  const [emailForm, setEmailForm] = useState({
    job_description: "",
    company_name: "",
    tone: "professional",
    resume_file: null,
  });

  // Cover Letter Generation State
  const [coverLetterForm, setCoverLetterForm] = useState({
    job_description: "",
    company_name: "",
    resume_file: null,
  });

  // Cold DM Generation State
  const [coldDmForm, setColdDmForm] = useState({
    job_description: "",
    company_name: "",
    platform: "linkedin",
    character_limit: "300",
    resume_file: null,
  });

  // Output State
  const [emailOutput, setEmailOutput] = useState({
    subject: "",
    body: "",
    sources: [],
  });

  const [coverLetterOutput, setCoverLetterOutput] = useState({
    cover_letter: "",
    sources: [],
  });

  const [coldDmOutput, setColdDmOutput] = useState({
    message: "",
    sources: [],
  });

  const handleEmailInputChange = (e) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverLetterInputChange = (e) => {
    const { name, value } = e.target;
    setCoverLetterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleColdDmInputChange = (e) => {
    const { name, value } = e.target;
    setColdDmForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "email") {
        setEmailForm((prev) => ({ ...prev, resume_file: file }));
      } else if (type === "cover-letter") {
        setCoverLetterForm((prev) => ({ ...prev, resume_file: file }));
      } else if (type === "cold-dm") {
        setColdDmForm((prev) => ({ ...prev, resume_file: file }));
      }
    }
  };

  const handleEmailGenerate = async (e) => {
    e.preventDefault();
    
    if (!geminiKey) {
      alert("Please add your Gemini API key in Settings first.");
      return;
    }

    setIsLoading(true);
    setEmailOutput({ subject: "", body: "", sources: [] });

    const formData = new FormData();
    formData.append("job_description", emailForm.job_description);
    formData.append("company_name", emailForm.company_name);
    formData.append("tone", emailForm.tone);
    formData.append("resume_file", emailForm.resume_file);

    try {
      const response = await fetch("http://localhost:8000/coldconnect/cold-mail/", {
        method: "POST",
        credentials: "include",
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
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoverLetterGenerate = async (e) => {
    e.preventDefault();
    
    if (!geminiKey) {
      alert("Please add your Gemini API key in Settings first.");
      return;
    }

    setIsLoading(true);
    setCoverLetterOutput({ cover_letter: "", sources: [] });

    const formData = new FormData();
    formData.append("job_description", coverLetterForm.job_description);
    formData.append("company_name", coverLetterForm.company_name);
    formData.append("resume_file", coverLetterForm.resume_file);

    try {
      const response = await fetch("http://localhost:8000/coldconnect/cover-letter/", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setCoverLetterOutput({
          cover_letter: data.cover_letter || "",
          sources: data.sources || [],
        });
      } else {
        alert(data.error || "Failed to generate cover letter");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleColdDmGenerate = async (e) => {
    e.preventDefault();
    
    if (!geminiKey) {
      alert("Please add your Gemini API key in Settings first.");
      return;
    }

    setIsLoading(true);
    setColdDmOutput({ message: "", sources: [] });

    const formData = new FormData();
    formData.append("job_description", coldDmForm.job_description);
    formData.append("company_name", coldDmForm.company_name);
    formData.append("platform", coldDmForm.platform);
    formData.append("character_limit", coldDmForm.character_limit);
    formData.append("resume_file", coldDmForm.resume_file);

    try {
      const response = await fetch("http://localhost:8000/coldconnect/cold-dm/", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setColdDmOutput({
          message: data.message || "",
          sources: data.sources || [],
        });
      } else {
        alert(data.error || "Failed to generate cold DM");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
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
                onClick={() => setActiveTab("cover-letter")}
                className={`cold-reply-tab ${activeTab === "cover-letter" ? "active" : ""}`}
              >
                <FileText className="w-5 h-5" />
                <span>Cover Letter Generator</span>
              </button>
              <button
                onClick={() => setActiveTab("cold-dm")}
                className={`cold-reply-tab ${activeTab === "cold-dm" ? "active" : ""}`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Cold DM Generator</span>
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

                    {!geminiKey && (
                      <div className="form-group">
                        <div className="form-hint" style={{ color: "#fca5a5", padding: "12px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                          ⚠️ Please add your Gemini API key in Settings to use this feature.
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || !geminiKey}
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

            {/* Cover Letter Generation Tab */}
            {activeTab === "cover-letter" && (
              <div className="cold-reply-form-container">
                <form onSubmit={handleCoverLetterGenerate} className="cold-reply-form">
                  <div className="form-section">
                    <h2 className="form-section-title">Generate Cover Letter</h2>
                    
                    <div className="form-group">
                      <label htmlFor="cover-letter-job-description" className="form-label">
                        Job Description *
                      </label>
                      <textarea
                        id="cover-letter-job-description"
                        name="job_description"
                        value={coverLetterForm.job_description}
                        onChange={handleCoverLetterInputChange}
                        placeholder="e.g., Software Engineer, Product Manager..."
                        className="form-textarea"
                        required
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="cover-letter-company-name" className="form-label">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        id="cover-letter-company-name"
                        name="company_name"
                        value={coverLetterForm.company_name}
                        onChange={handleCoverLetterInputChange}
                        placeholder="e.g., Google, Microsoft..."
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="cover-letter-resume" className="form-label">
                        Resume (PDF) *
                      </label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          id="cover-letter-resume"
                          accept=".pdf"
                          onChange={(e) => handleFileChange(e, "cover-letter")}
                          className="file-input"
                          required
                        />
                        <label htmlFor="cover-letter-resume" className="file-upload-label">
                          {coverLetterForm.resume_file
                            ? coverLetterForm.resume_file.name
                            : "Choose PDF file"}
                        </label>
                      </div>
                    </div>

                    {!geminiKey && (
                      <div className="form-group">
                        <div className="form-hint" style={{ color: "#fca5a5", padding: "12px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                          ⚠️ Please add your Gemini API key in Settings to use this feature.
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || !geminiKey}
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
                {(coverLetterOutput.cover_letter || isLoading) && (
                  <div className="output-section">
                    <div className="output-header">
                      <h3 className="output-title">Generated Cover Letter</h3>
                      {coverLetterOutput.cover_letter && (
                        <button
                          onClick={() => copyToClipboard(coverLetterOutput.cover_letter)}
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
                        {coverLetterOutput.cover_letter && (
                          <div className="output-field">
                            <div className="output-value cover-letter-body">
                              {coverLetterOutput.cover_letter.split("\n").map((line, idx) => (
                                <React.Fragment key={idx}>
                                  {line}
                                  {idx < coverLetterOutput.cover_letter.split("\n").length - 1 && (
                                    <br />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}
                        {coverLetterOutput.sources && coverLetterOutput.sources.length > 0 && (
                          <div className="output-sources">
                            <label className="output-label">Sources:</label>
                            <ul className="sources-list">
                              {coverLetterOutput.sources.map((source, idx) => (
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

            {/* Cold DM Generation Tab */}
            {activeTab === "cold-dm" && (
              <div className="cold-reply-form-container">
                <form onSubmit={handleColdDmGenerate} className="cold-reply-form">
                  <div className="form-section">
                    <h2 className="form-section-title">Generate Cold DM</h2>
                    
                    <div className="form-group">
                      <label htmlFor="cold-dm-job-description" className="form-label">
                        Job Description *
                      </label>
                      <textarea
                        id="cold-dm-job-description"
                        name="job_description"
                        value={coldDmForm.job_description}
                        onChange={handleColdDmInputChange}
                        placeholder="e.g., Software Engineer, Product Manager..."
                        className="form-textarea"
                        required
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="cold-dm-company-name" className="form-label">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        id="cold-dm-company-name"
                        name="company_name"
                        value={coldDmForm.company_name}
                        onChange={handleColdDmInputChange}
                        placeholder="e.g., Google, Microsoft..."
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="cold-dm-platform" className="form-label">
                        Platform *
                      </label>
                      <select
                        id="cold-dm-platform"
                        name="platform"
                        value={coldDmForm.platform}
                        onChange={handleColdDmInputChange}
                        className="form-input"
                        required
                      >
                        <option value="linkedin">LinkedIn</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="twitter">Twitter/X</option>
                        <option value="instagram">Instagram</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="cold-dm-character-limit" className="form-label">
                        Character Limit *
                      </label>
                      <input
                        type="number"
                        id="cold-dm-character-limit"
                        name="character_limit"
                        value={coldDmForm.character_limit}
                        onChange={handleColdDmInputChange}
                        placeholder="e.g., 300"
                        className="form-input"
                        required
                        min="50"
                        max="2000"
                      />
                      <div className="form-hint">Recommended: 300 for LinkedIn, 500 for WhatsApp</div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="cold-dm-resume" className="form-label">
                        Resume (PDF) *
                      </label>
                      <div className="file-upload-wrapper">
                        <input
                          type="file"
                          id="cold-dm-resume"
                          accept=".pdf"
                          onChange={(e) => handleFileChange(e, "cold-dm")}
                          className="file-input"
                          required
                        />
                        <label htmlFor="cold-dm-resume" className="file-upload-label">
                          {coldDmForm.resume_file
                            ? coldDmForm.resume_file.name
                            : "Choose PDF file"}
                        </label>
                      </div>
                    </div>

                    {!geminiKey && (
                      <div className="form-group">
                        <div className="form-hint" style={{ color: "#fca5a5", padding: "12px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                          ⚠️ Please add your Gemini API key in Settings to use this feature.
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || !geminiKey}
                      className="form-submit-btn"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-5 h-5" />
                          <span>Generate Cold DM</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Output Section */}
                {(coldDmOutput.message || isLoading) && (
                  <div className="output-section">
                    <div className="output-header">
                      <h3 className="output-title">Generated Cold DM</h3>
                      {coldDmOutput.message && (
                        <button
                          onClick={() => copyToClipboard(coldDmOutput.message)}
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
                        <p className="loading-text">Generating your cold DM...</p>
                      </div>
                    ) : (
                      <div className="output-content">
                        {coldDmOutput.message && (
                          <div className="output-field">
                            <div className="output-value cover-letter-body">
                              {coldDmOutput.message.split("\n").map((line, idx) => (
                                <React.Fragment key={idx}>
                                  {line}
                                  {idx < coldDmOutput.message.split("\n").length - 1 && (
                                    <br />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}
                        {coldDmOutput.sources && coldDmOutput.sources.length > 0 && (
                          <div className="output-sources">
                            <label className="output-label">Sources:</label>
                            <ul className="sources-list">
                              {coldDmOutput.sources.map((source, idx) => (
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

