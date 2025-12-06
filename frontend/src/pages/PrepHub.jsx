import React, { useState, useEffect } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import { useAuth } from "../contexts/AuthContext";
import { Search, Loader2, Code, Calendar, List, Database, CheckCircle } from "lucide-react";
import "./Dashboard.css";

const PrepHub = () => {
  const { geminiKey } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("interview-questions");
  const [prepData, setPrepData] = useState(null);
  const [error, setError] = useState("");
  const [solvedProblems, setSolvedProblems] = useState(new Set());

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError("Please enter a company name");
      return;
    }

    if (!geminiKey) {
      setError("Please add your Gemini API key in Settings first.");
      return;
    }

    setIsLoading(true);
    setError("");
    setPrepData(null);

    try {
      const response = await fetch("http://localhost:8000/resume/prep-hub/search/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ company_name: searchQuery }),
      });

      const data = await response.json();

      if (data.success) {
        setCompanyName(data.company_name);
        setPrepData(data.data);
        setActiveTab("interview-questions");
        
        // Load solved problems from localStorage for this company
        const savedSolved = localStorage.getItem(`prep-hub-solved-${data.company_name.toLowerCase()}`);
        if (savedSolved) {
          try {
            const solvedIds = JSON.parse(savedSolved);
            setSolvedProblems(new Set(solvedIds));
          } catch (e) {
            console.error("Error loading solved problems:", e);
          }
        }
      } else {
        setError(data.error || "Failed to fetch preparation data");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProblemToggle = (problemId) => {
    const newSolved = new Set(solvedProblems);
    if (newSolved.has(problemId)) {
      newSolved.delete(problemId);
    } else {
      newSolved.add(problemId);
    }
    setSolvedProblems(newSolved);
    
    // Save to localStorage
    if (companyName) {
      localStorage.setItem(
        `prep-hub-solved-${companyName.toLowerCase()}`,
        JSON.stringify(Array.from(newSolved))
      );
    }
  };

  return (
    <div className="dashboard-app">
      <DashboardHeader />
      <div className="dashboard-main-container">
        <DashboardSidebar />
        <div className="dashboard-content-area">
          <div className="cold-reply-content">
            <div className="prep-hub-header">
              <h1 className="prep-hub-title">Prep Hub</h1>
              <p className="prep-hub-subtitle">
                Search for a company to get comprehensive interview preparation resources
              </p>
            </div>

            {/* Search Section */}
            <div className="prep-hub-search-section">
              <form onSubmit={handleSearch} className="prep-hub-search-form">
                <div className="search-input-wrapper">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter company name (e.g., Google, Microsoft, Amazon)"
                    className="prep-hub-search-input"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !geminiKey}
                  className="prep-hub-search-btn"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Search</span>
                    </>
                  )}
                </button>
              </form>

              {!geminiKey && (
                <div className="form-hint" style={{ 
                  color: "#fca5a5", 
                  padding: "12px", 
                  background: "rgba(239, 68, 68, 0.1)", 
                  borderRadius: "8px", 
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  marginTop: "16px"
                }}>
                  ⚠️ Please add your Gemini API key in Settings to use this feature.
                </div>
              )}

              {error && (
                <div className="error-message" style={{ 
                  color: "#fca5a5", 
                  padding: "12px", 
                  background: "rgba(239, 68, 68, 0.1)", 
                  borderRadius: "8px", 
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  marginTop: "16px"
                }}>
                  {error}
                </div>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="loading-container" style={{ marginTop: "32px" }}>
                <Loader2 className="w-8 h-8 animate-spin text-white/60" />
                <p className="loading-text">Generating preparation data...</p>
              </div>
            )}

            {/* Results Section */}
            {prepData && companyName && !isLoading && (
              <div className="prep-hub-results">
                <div className="company-header">
                  <h2 className="company-name">{companyName}</h2>
                </div>

                {/* Tabs */}
                <div className="prep-hub-tabs">
                  <button
                    onClick={() => setActiveTab("interview-questions")}
                    className={`prep-hub-tab ${activeTab === "interview-questions" ? "active" : ""}`}
                  >
                    <List className="w-5 h-5" />
                    <span>Interview Questions</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("roadmap")}
                    className={`prep-hub-tab ${activeTab === "roadmap" ? "active" : ""}`}
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Preparation Roadmap</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("leetcode")}
                    className={`prep-hub-tab ${activeTab === "leetcode" ? "active" : ""}`}
                  >
                    <Code className="w-5 h-5" />
                    <span>LeetCode Problems</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("tech-stack")}
                    className={`prep-hub-tab ${activeTab === "tech-stack" ? "active" : ""}`}
                  >
                    <Database className="w-5 h-5" />
                    <span>Tech Stack</span>
                  </button>
                </div>

                {/* Tab Content */}
                <div className="prep-hub-content">
                  {/* Interview Questions Tab */}
                  {activeTab === "interview-questions" && (
                    <div className="prep-hub-tab-content">
                      <h3 className="tab-content-title">Past Interview Questions</h3>
                      
                      {/* Technical Round 1 */}
                      {prepData.interview_questions?.technical_round_1 && (
                        <div className="question-section">
                          <h4 className="round-title">Technical Round 1</h4>
                          <div className="questions-list">
                            {prepData.interview_questions.technical_round_1.map((item, idx) => (
                              <div key={idx} className="question-item">
                                <div className="question-text">
                                  <strong>Q{idx + 1}:</strong> {item.question}
                                </div>
                                {item.answer && (
                                  <div className="question-answer">
                                    <strong>Approach:</strong> {item.answer}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Technical Round 2 */}
                      {prepData.interview_questions?.technical_round_2 && (
                        <div className="question-section">
                          <h4 className="round-title">Technical Round 2</h4>
                          <div className="questions-list">
                            {prepData.interview_questions.technical_round_2.map((item, idx) => (
                              <div key={idx} className="question-item">
                                <div className="question-text">
                                  <strong>Q{idx + 1}:</strong> {item.question}
                                </div>
                                {item.answer && (
                                  <div className="question-answer">
                                    <strong>Approach:</strong> {item.answer}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* HR Round */}
                      {prepData.interview_questions?.hr_round && (
                        <div className="question-section">
                          <h4 className="round-title">HR Round</h4>
                          <div className="questions-list">
                            {prepData.interview_questions.hr_round.map((item, idx) => (
                              <div key={idx} className="question-item">
                                <div className="question-text">
                                  <strong>Q{idx + 1}:</strong> {item.question}
                                </div>
                                {item.answer && (
                                  <div className="question-answer">
                                    <strong>Answer:</strong> {item.answer}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Preparation Roadmap Tab */}
                  {activeTab === "roadmap" && (
                    <div className="prep-hub-tab-content">
                      <h3 className="tab-content-title">Preparation Roadmap</h3>
                      {prepData.preparation_roadmap?.weeks && (
                        <div className="roadmap-container">
                          {prepData.preparation_roadmap.weeks.map((week, idx) => (
                            <div key={idx} className="roadmap-week">
                              <div className="week-header">
                                <h4 className="week-title">Week {week.week_number}</h4>
                                <div className="time-commitment">
                                  <span className="time-label">Time Commitment:</span>
                                  <span className="time-value">{week.time_commitment_per_day}</span>
                                </div>
                              </div>
                              <div className="week-foundations">
                                <strong>Foundations:</strong> {week.foundations}
                              </div>
                              <div className="week-topics">
                                <strong>Topics to Cover:</strong>
                                <ul className="topics-list">
                                  {week.topics?.map((topic, topicIdx) => (
                                    <li key={topicIdx}>
                                      <CheckCircle className="w-4 h-4 inline mr-2" />
                                      {topic}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* LeetCode Problems Tab */}
                  {activeTab === "leetcode" && (
                    <div className="prep-hub-tab-content">
                      <h3 className="tab-content-title">LeetCode Problems</h3>
                      {prepData.leetcode_problems && (
                        <div className="leetcode-table-container">
                          <table className="leetcode-table">
                            <thead>
                              <tr>
                                <th style={{ width: "50px" }}></th>
                                <th>ID</th>
                                <th>Problem Name</th>
                                <th>Difficulty</th>
                                <th>Frequency</th>
                              </tr>
                            </thead>
                            <tbody>
                              {prepData.leetcode_problems.map((problem, idx) => {
                                const isSolved = solvedProblems.has(problem.id);
                                return (
                                  <tr key={idx} className={isSolved ? "solved-row" : ""}>
                                    <td className="checkbox-cell">
                                      <input
                                        type="checkbox"
                                        checked={isSolved}
                                        onChange={() => handleProblemToggle(problem.id)}
                                        className="problem-checkbox"
                                      />
                                    </td>
                                    <td className="problem-id">{problem.id}</td>
                                    <td className="problem-name">
                                      {problem.url ? (
                                        <a
                                          href={problem.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`problem-link ${isSolved ? "solved-link" : ""}`}
                                        >
                                          {problem.problem_name}
                                        </a>
                                      ) : (
                                        <span className={isSolved ? "solved-text" : ""}>
                                          {problem.problem_name}
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      <span className={`difficulty-badge ${problem.difficulty?.toLowerCase()}`}>
                                        {problem.difficulty}
                                      </span>
                                    </td>
                                    <td>
                                      <span className={`frequency-badge ${problem.frequency?.toLowerCase()}`}>
                                        {problem.frequency}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tech Stack Tab */}
                  {activeTab === "tech-stack" && (
                    <div className="prep-hub-tab-content">
                      <h3 className="tab-content-title">Tech Stack</h3>
                      {prepData.tech_stack && (
                        <div className="tech-stack-container">
                          <div className="tech-stack-section">
                            <h4 className="tech-stack-title">Required Skills</h4>
                            <div className="tech-stack-items">
                              {prepData.tech_stack.required_skills?.map((skill, idx) => (
                                <span key={idx} className="tech-stack-item required">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="tech-stack-section">
                            <h4 className="tech-stack-title">Preferred Skills</h4>
                            <div className="tech-stack-items">
                              {prepData.tech_stack.preferred_skills?.map((skill, idx) => (
                                <span key={idx} className="tech-stack-item preferred">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="tech-stack-section">
                            <h4 className="tech-stack-title">Frameworks</h4>
                            <div className="tech-stack-items">
                              {prepData.tech_stack.frameworks?.map((framework, idx) => (
                                <span key={idx} className="tech-stack-item framework">
                                  {framework}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="tech-stack-section">
                            <h4 className="tech-stack-title">Databases</h4>
                            <div className="tech-stack-items">
                              {prepData.tech_stack.databases?.map((db, idx) => (
                                <span key={idx} className="tech-stack-item database">
                                  {db}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrepHub;

