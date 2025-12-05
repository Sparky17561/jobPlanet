import React, { useState, useEffect } from "react";
import Header from "../components/resume/Header";
import LeftSidebar from "../components/resume/LeftSidebar";
import RightSidebar from "../components/resume/RightSidebar";
import InputPanel from "../components/resume/InputPanel";
import CodeEditor from "../components/resume/CodeEditor";
import PreviewPanel from "../components/resume/PreviewPanel";
import "./ResumeBuilder.css";

// Template data with actual LaTeX code
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
  {
    id: "creative",
    name: "Creative Bold",
    description: "Stand out design",
    code: `\\documentclass[10pt]{article}
\\usepackage[left=0.5in,right=0.5in,top=0.5in,bottom=0.5in]{geometry}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{xcolor}

\\definecolor{primary}{RGB}{0,102,204}

\\begin{document}

\\begin{center}
    {\\Huge \\textcolor{primary}{\\textbf{ALEX JOHNSON}}} \\\\[6pt]
    {\\large Creative Developer \\& Designer}
\\end{center}

\\vspace{6pt}
\\noindent\\rule{\\textwidth}{1pt}
\\vspace{4pt}

\\begin{center}
    alex@portfolio.com | 555-123-4567 | portfolio.com | @alexjohnson
\\end{center}

\\vspace{4pt}
\\noindent\\rule{\\textwidth}{1pt}

\\vspace{10pt}

\\section*{\\textcolor{primary}{EXPERIENCE}}

\\textbf{\\large Creative Director} \\\\
\\textit{Design Studio Inc.} \\hfill \\textit{2020 -- Present}
\\begin{itemize}[noitemsep]
    \\item Directed creative vision for 50+ client projects
    \\item Increased client retention by 45\\% through innovative solutions
    \\item Managed cross-functional team of designers and developers
\\end{itemize}

\\vspace{6pt}

\\textbf{\\large Senior UI/UX Designer} \\\\
\\textit{Tech Startup} \\hfill \\textit{2018 -- 2020}
\\begin{itemize}[noitemsep]
    \\item Redesigned mobile app increasing user engagement by 200\\%
    \\item Created design system used across 15+ products
\\end{itemize}

\\section*{\\textcolor{primary}{EDUCATION}}

\\textbf{Bachelor of Fine Arts in Digital Design} \\\\
Rhode Island School of Design \\hfill 2014 -- 2018

\\section*{\\textcolor{primary}{SKILLS}}

\\textbf{Design:} Figma, Adobe XD, Sketch, Photoshop, Illustrator \\\\
\\textbf{Development:} HTML, CSS, JavaScript, React, Animation \\\\
\\textbf{Other:} Brand Identity, Motion Graphics, Prototyping

\\end{document}`,
  },
];

const ResumeBuilder = () => {
  const [latexCode, setLatexCode] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [currentResumeName, setCurrentResumeName] = useState(
    "Software Engineer Resume"
  );
  const [resumes, setResumes] = useState([
    {
      id: 1,
      name: "Software Engineer Resume",
      date: "2024-01-15",
      code: RESUME_TEMPLATES[0].code,
    },
    { id: 2, name: "Product Manager CV", date: "2024-01-10", code: "" },
  ]);
  const [selectedResumeId, setSelectedResumeId] = useState(1);
  const [isTemplatesPanelOpen, setIsTemplatesPanelOpen] = useState(false);

  // Initialize with first resume selected
  useEffect(() => {
    const firstResume = resumes.find((r) => r.id === 1);
    if (firstResume) {
      setLatexCode(firstResume.code);
      setCurrentResumeName(firstResume.name);
    }
  }, []);

  // Update resume name in sidebar when changed
  useEffect(() => {
    if (selectedResumeId) {
      setResumes((prevResumes) =>
        prevResumes.map((r) =>
          r.id === selectedResumeId ? { ...r, name: currentResumeName } : r
        )
      );
    }
  }, [currentResumeName]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    const template = RESUME_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setLatexCode(template.code);
    }
    setIsTemplatesPanelOpen(false);
  };

  const handleNewResume = () => {
    const newId = Math.max(...resumes.map((r) => r.id)) + 1;
    const newResume = {
      id: newId,
      name: "Untitled Resume",
      date: new Date().toISOString().split("T")[0],
      code: "",
    };

    setResumes([newResume, ...resumes]);
    setSelectedResumeId(newId);
    setCurrentResumeName("Untitled Resume");
    setLatexCode("");
    setJobDescription("");
    setResumeFile(null);
  };

  const handleSelectResume = (resumeId) => {
    const resume = resumes.find((r) => r.id === resumeId);
    if (resume) {
      setSelectedResumeId(resumeId);
      setCurrentResumeName(resume.name);
      setLatexCode(resume.code || "");
    }
  };

  const handleSaveResume = () => {
    if (selectedResumeId) {
      setResumes((prevResumes) =>
        prevResumes.map((r) =>
          r.id === selectedResumeId
            ? {
                ...r,
                name: currentResumeName,
                code: latexCode,
                date: new Date().toISOString().split("T")[0],
              }
            : r
        )
      );
      alert("Resume saved: " + currentResumeName);
    }
  };

  return (
    <div className="app">
      <Header
        resumeName={currentResumeName}
        setResumeName={setCurrentResumeName}
        onSave={handleSaveResume}
      />

      <div className="main-container">
        <LeftSidebar
          resumes={resumes}
          selectedResumeId={selectedResumeId}
          onSelectResume={handleSelectResume}
          onNewResume={handleNewResume}
        />

        <div className="content-area">
          <InputPanel
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            resumeFile={resumeFile}
            setResumeFile={setResumeFile}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            onToggleTemplates={() =>
              setIsTemplatesPanelOpen(!isTemplatesPanelOpen)
            }
          />

          <div className="editor-preview-container">
            <CodeEditor latexCode={latexCode} setLatexCode={setLatexCode} />

            <PreviewPanel latexCode={latexCode} />
          </div>
        </div>

        <RightSidebar
          templates={RESUME_TEMPLATES}
          selectedTemplate={selectedTemplate}
          onTemplateSelect={handleTemplateSelect}
          isOpen={isTemplatesPanelOpen}
          onClose={() => setIsTemplatesPanelOpen(false)}
        />
      </div>
    </div>
  );
}

export default ResumeBuilder