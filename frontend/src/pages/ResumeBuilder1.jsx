import React, { useState, useEffect } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import CodeEditor from "../components/resume/CodeEditor";
import PreviewPanel from "../components/resume/PreviewPanel";
import { useAuth } from "../contexts/AuthContext";
import { Sparkles, Save, Download, ChevronDown, ChevronUp, FileText, Plus } from "lucide-react";
import "./ResumeBuilder.css";
import "./ResumeBuilder1.css";

// Two templates only
const RESUME_TEMPLATES = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean and ATS-friendly",
    code: `\\documentclass[letterpaper,11pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}

\\begin{document}

\\begin{center}
    \\textbf{\\Huge John Doe} \\\\ \\vspace{2pt}
    \\small 123-456-7890 $|$ \\href{mailto:john@email.com}{john@email.com} $|$ 
    \\href{https://linkedin.com/in/johndoe}{linkedin.com/in/johndoe} $|$
    \\href{https://github.com/johndoe}{github.com/johndoe}
\\end{center}

\\section*{Experience}
\\textbf{Senior Software Engineer} \\hfill Jan 2022 -- Present \\\\
\\textit{Tech Corp, San Francisco, CA}
\\begin{itemize}[leftmargin=0.15in]
    \\item Led development of microservices architecture serving 10M+ users
    \\item Reduced API response time by 40\\% through optimization
    \\item Mentored team of 5 junior developers
\\end{itemize}

\\textbf{Software Engineer} \\hfill Jun 2019 -- Dec 2021 \\\\
\\textit{StartUp Inc, Austin, TX}
\\begin{itemize}[leftmargin=0.15in]
    \\item Built RESTful APIs using Node.js and Express
    \\item Implemented CI/CD pipeline reducing deployment time by 60\\%
\\end{itemize}

\\section*{Education}
\\textbf{Bachelor of Science in Computer Science} \\hfill 2015 -- 2019 \\\\
University of California, Berkeley

\\section*{Skills}
\\textbf{Languages:} JavaScript, Python, Java, C++ \\\\
\\textbf{Technologies:} React, Node.js, AWS, Docker, Kubernetes

\\end{document}`,
  },
  {
    id: "minimal",
    name: "Minimal Elegant",
    description: "Simple and clean design",
    code: `\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\pagestyle{empty}

\\begin{document}

\\begin{center}
    {\\LARGE \\textbf{Jane Smith}} \\\\[8pt]
    jane.smith@email.com | +1-234-567-8900 | San Francisco, CA \\\\
    linkedin.com/in/janesmith | github.com/janesmith
\\end{center}

\\vspace{10pt}

\\noindent\\textbf{PROFESSIONAL SUMMARY}\\\\[4pt]
Full-stack developer with 5+ years of experience building scalable web applications. 
Expertise in modern JavaScript frameworks and cloud technologies.

\\vspace{8pt}

\\noindent\\textbf{WORK EXPERIENCE}\\\\[4pt]
\\textbf{Lead Developer} | CloudTech Solutions \\hfill 2021--Present
\\begin{itemize}[noitemsep,leftmargin=*]
    \\item Architected cloud-native applications using AWS and Terraform
    \\item Improved system reliability to 99.9\\% uptime
    \\item Led team of 8 engineers in agile environment
\\end{itemize}

\\vspace{4pt}
\\textbf{Full Stack Developer} | Digital Agency \\hfill 2018--2021
\\begin{itemize}[noitemsep,leftmargin=*]
    \\item Developed responsive web applications using React and Node.js
    \\item Increased client satisfaction scores by 35\\%
\\end{itemize}

\\vspace{8pt}

\\noindent\\textbf{EDUCATION}\\\\[4pt]
\\textbf{M.S. in Computer Science} | Stanford University \\hfill 2018 \\\\
\\textbf{B.S. in Software Engineering} | UC Berkeley \\hfill 2016

\\vspace{8pt}

\\noindent\\textbf{TECHNICAL SKILLS}\\\\[4pt]
React, Vue.js, Node.js, Python, Django, PostgreSQL, MongoDB, AWS, Docker, Git

\\end{document}`,
  },
];

const ResumeBuilder1 = () => {
  const { user, profileData, fetchProfile } = useAuth();
  const [latexCode, setLatexCode] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [enhanceContext, setEnhanceContext] = useState("");
  const [currentResumeName, setCurrentResumeName] = useState("Untitled Resume");
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [isResumesExpanded, setIsResumesExpanded] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch user's resumes from profile data
  useEffect(() => {
    if (profileData && profileData.generated_resumes) {
      const formattedResumes = profileData.generated_resumes.map((resume, index) => ({
        id: resume.id || `resume-${index}`,
        name: resume.job_description_snippet 
          ? `Resume ${index + 1} - ${resume.job_description_snippet.substring(0, 30)}...`
          : `Resume ${index + 1}`,
        date: resume.generated_at 
          ? new Date(resume.generated_at).toLocaleDateString()
          : new Date().toLocaleDateString(),
        code: resume.latex || "",
        jobDescription: resume.job_description_snippet || "",
      }));
      setResumes(formattedResumes);
    }
  }, [profileData]);

  // Load selected resume
  useEffect(() => {
    if (selectedResumeId && resumes.length > 0) {
      const resume = resumes.find((r) => r.id === selectedResumeId);
      if (resume && resume.code) {
        setLatexCode(resume.code);
        setCurrentResumeName(resume.name);
        setCurrentResumeId(resume.id);
        setJobDescription(resume.jobDescription || "");
        setError("");
        setSuccess("Resume loaded successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    }
  }, [selectedResumeId, resumes]);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description");
      return;
    }

    setIsGenerating(true);
    setError("");
    setSuccess("");

    const template = RESUME_TEMPLATES.find((t) => t.id === selectedTemplate);
    if (!template) {
      setError("Template not found");
      setIsGenerating(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/resume/generate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          template: template.code,
          job_description: jobDescription,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLatexCode(data.latex);
        setCurrentResumeId(data.id);
        setSelectedResumeId(data.id);
        setSuccess("Resume generated successfully!");
        setTimeout(() => setSuccess(""), 3000);
        
        // Refresh profile to get updated resumes
        await fetchProfile();
      } else {
        setError(data.error || "Failed to generate resume");
      }
    } catch (error) {
      console.error("Generate error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhance = async () => {
    if (!latexCode.trim()) {
      setError("Please generate or load a resume first");
      return;
    }

    if (!enhanceContext.trim()) {
      setError("Please provide enhancement context");
      return;
    }

    setIsEnhancing(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:8000/resume/enhance/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          latex: latexCode,
          context: enhanceContext,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLatexCode(data.latex);
        setCurrentResumeId(data.id);
        setSelectedResumeId(data.id);
        setSuccess("Resume enhanced successfully!");
        setTimeout(() => setSuccess(""), 3000);
        
        // Refresh profile to get updated resumes
        await fetchProfile();
      } else {
        setError(data.error || "Failed to enhance resume");
      }
    } catch (error) {
      console.error("Enhance error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSaveResume = async () => {
    if (!latexCode.trim()) {
      setError("No resume to save");
      return;
    }

    setError("");
    setSuccess("");

    try {
      // If we have a current resume ID, update it
      // Otherwise, the resume will be saved when generated/enhanced
      if (currentResumeId) {
        // Update the resume in the database
        // The backend already saves resumes when generated/enhanced
        // We just need to refresh the profile to get updated data
        await fetchProfile();
        setSuccess("Resume saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        // If no resume ID, this means it's a new/unsaved resume
        // User needs to generate or enhance first
        setError("Please generate or enhance a resume first to save it.");
      }
    } catch (error) {
      console.error("Save error:", error);
      setError("Failed to save resume");
    }
  };

  const handleDownloadPDF = async () => {
    if (!currentResumeId) {
      setError("No resume to download. Please generate a resume first.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/resume/pdf/${currentResumeId}/`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${currentResumeName || "resume"}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setSuccess("PDF downloaded successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to download PDF");
      }
    } catch (error) {
      console.error("Download error:", error);
      setError("Network error. Please try again.");
    }
  };

  const handleSelectResume = (resumeId) => {
    setSelectedResumeId(resumeId);
    setIsResumesExpanded(false);
  };

  const handleNewResume = () => {
    setLatexCode("");
    setCurrentResumeName("Untitled Resume");
    setCurrentResumeId(null);
    setSelectedResumeId(null);
    setJobDescription("");
    setEnhanceContext("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="dashboard-app">
      <DashboardHeader />
      <div className="dashboard-main-container">
        <div className="resume-builder-sidebar-wrapper">
          <DashboardSidebar />
          <div className="resume-list-section">
            <div
              className="resume-list-header"
              onClick={() => setIsResumesExpanded(!isResumesExpanded)}
            >
              <FileText className="w-4 h-4" />
              <span>Your Resumes</span>
              {isResumesExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
            {isResumesExpanded && (
              <div className="resume-list-content">
                <button className="new-resume-btn-sidebar" onClick={handleNewResume}>
                  <Plus className="w-4 h-4" />
                  <span>New Resume</span>
                </button>
                <div className="resume-list-items">
                  {resumes.length === 0 ? (
                    <div className="no-resumes">No resumes yet. Generate one to get started!</div>
                  ) : (
                    resumes.map((resume) => (
                      <div
                        key={resume.id}
                        className={`resume-item-sidebar ${
                          selectedResumeId === resume.id ? "active" : ""
                        }`}
                        onClick={() => handleSelectResume(resume.id)}
                      >
                        <div className="resume-item-name-sidebar">{resume.name}</div>
                        <div className="resume-item-date-sidebar">{resume.date}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-content-area resume-builder-content">
          {/* Header with name change */}
          <div className="resume-builder-header">
            <div className="resume-builder-header-left">
              <FileText className="w-5 h-5" />
              <h1 className="resume-builder-title">Resume Builder</h1>
            </div>
            <div className="resume-builder-header-center">
              <input
                type="text"
                className="resume-name-input-new"
                value={currentResumeName}
                onChange={(e) => setCurrentResumeName(e.target.value)}
                placeholder="Resume Name"
              />
            </div>
            <div className="resume-builder-header-right">
              <button
                className="header-btn-new btn-secondary-new"
                onClick={handleSaveResume}
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                className="header-btn-new btn-primary-new"
                onClick={handleDownloadPDF}
                disabled={!currentResumeId}
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="resume-builder-alert resume-builder-alert-error">
              {error}
            </div>
          )}
          {success && (
            <div className="resume-builder-alert resume-builder-alert-success">
              {success}
            </div>
          )}

          {/* Input Panel */}
          <div className="input-panel-new">
            <div className="input-grid-new">
              <div className="input-group-new">
                <label htmlFor="job-description">Job Description *</label>
                <textarea
                  id="job-description"
                  placeholder="Paste the job description here... Include required skills, qualifications, and responsibilities."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
              <div className="input-group-new">
                <label htmlFor="enhance-context">Enhancement Context (for Enhance)</label>
                <textarea
                  id="enhance-context"
                  placeholder="Enter context for enhancing the resume (e.g., new achievements, skills, or job requirements)..."
                  value={enhanceContext}
                  onChange={(e) => setEnhanceContext(e.target.value)}
                />
              </div>
            </div>
            <div className="generate-btn-container-new">
              <select
                className="template-select"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                {RESUME_TEMPLATES.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              <button
                className="enhance-btn"
                onClick={handleEnhance}
                disabled={isEnhancing || !latexCode.trim() || !enhanceContext.trim()}
              >
                {isEnhancing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Enhancing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Enhance Resume</span>
                  </>
                )}
              </button>
              <button
                className="generate-btn-new"
                onClick={handleGenerate}
                disabled={isGenerating || !jobDescription.trim()}
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Editor and Preview Side by Side */}
          <div className="editor-preview-container-new">
            <CodeEditor latexCode={latexCode} setLatexCode={setLatexCode} />
            <PreviewPanel latexCode={latexCode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder1;

