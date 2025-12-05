import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Edit,
} from "lucide-react";
import "./Profile.css";

const Profile = () => {
  const { user, profileData, fetchProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch if we don't have profile data yet
    if (!profileData) {
      fetchProfile();
    }
  }, []); // Empty dependency array - only run once on mount

  const personal = profileData?.personal || {};
  const summary = profileData?.summary || "";
  const education = profileData?.education || [];
  const experience = profileData?.experience || [];
  const projects = profileData?.projects || [];
  const skills = profileData?.skills || {};
  const certifications = profileData?.certifications || [];

  return (
    <div className="dashboard-app">
      <DashboardHeader />
      <div className="dashboard-main-container">
        <DashboardSidebar />
        <div className="dashboard-content-area">
          <div className="profile-content">
            {/* Header with Update Button */}
            <div className="profile-header-section">
              <div className="profile-header-content">
                <div className="profile-avatar">
                  <User className="w-12 h-12" />
                </div>
                <div className="profile-header-info">
                  <h1 className="profile-name">
                    {personal.first_name && personal.last_name
                      ? `${personal.first_name} ${personal.last_name}`
                      : user?.username || "User"}
                  </h1>
                  <p className="profile-email">{user?.email || personal.email}</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/profile/update")}
                className="update-profile-btn"
              >
                <Edit className="w-4 h-4" />
                <span>Update Profile</span>
              </button>
            </div>

            {/* Personal Information */}
            <section className="profile-section">
              <h2 className="section-title">
                <User className="section-icon" />
                Personal Information
              </h2>
              <div className="profile-grid">
                {personal.first_name && (
                  <div className="profile-field">
                    <span className="field-label">First Name</span>
                    <span className="field-value">{personal.first_name}</span>
                  </div>
                )}
                {personal.last_name && (
                  <div className="profile-field">
                    <span className="field-label">Last Name</span>
                    <span className="field-value">{personal.last_name}</span>
                  </div>
                )}
                {personal.phone && (
                  <div className="profile-field">
                    <span className="field-label">
                      <Phone className="field-icon" />
                      Phone
                    </span>
                    <span className="field-value">{personal.phone}</span>
                  </div>
                )}
                {personal.city && (
                  <div className="profile-field">
                    <span className="field-label">
                      <MapPin className="field-icon" />
                      Location
                    </span>
                    <span className="field-value">
                      {personal.city}
                      {personal.country && `, ${personal.country}`}
                    </span>
                  </div>
                )}
                {personal.github && (
                  <div className="profile-field">
                    <span className="field-label">
                      <Github className="field-icon" />
                      GitHub
                    </span>
                    <a
                      href={personal.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="field-link"
                    >
                      {personal.github}
                    </a>
                  </div>
                )}
                {personal.linkedin && (
                  <div className="profile-field">
                    <span className="field-label">
                      <Linkedin className="field-icon" />
                      LinkedIn
                    </span>
                    <a
                      href={personal.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="field-link"
                    >
                      {personal.linkedin}
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* Professional Summary */}
            {summary && (
              <section className="profile-section">
                <h2 className="section-title">
                  <FileText className="section-icon" />
                  Professional Summary
                </h2>
                <div className="summary-content">{summary}</div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section className="profile-section">
                <h2 className="section-title">
                  <GraduationCap className="section-icon" />
                  Education
                </h2>
                <div className="education-list">
                  {education.map((edu, index) => (
                    <div key={index} className="education-item">
                      <div className="education-header">
                        <div>
                          <h3 className="education-degree">{edu.degree}</h3>
                          <p className="education-institution">{edu.institution}</p>
                        </div>
                        {edu.period && (
                          <span className="education-period">{edu.period}</span>
                        )}
                      </div>
                      <div className="education-details">
                        {edu.city && (
                          <span className="education-detail">
                            <MapPin className="w-3 h-3" />
                            {edu.city}
                          </span>
                        )}
                        {edu.grade && (
                          <span className="education-detail">Grade: {edu.grade}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <section className="profile-section">
                <h2 className="section-title">
                  <Briefcase className="section-icon" />
                  Experience
                </h2>
                <div className="experience-list">
                  {experience.map((exp, index) => (
                    <div key={index} className="experience-item">
                      <div className="experience-header">
                        <div>
                          <h3 className="experience-role">{exp.role}</h3>
                          <p className="experience-company">{exp.company}</p>
                        </div>
                        {exp.period && (
                          <span className="experience-period">{exp.period}</span>
                        )}
                      </div>
                      {exp.city && (
                        <p className="experience-location">
                          <MapPin className="w-3 h-3" />
                          {exp.city}
                        </p>
                      )}
                      {exp.description && (
                        <p className="experience-description">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <section className="profile-section">
                <h2 className="section-title">
                  <Code className="section-icon" />
                  Projects
                </h2>
                <div className="projects-grid">
                  {projects.map((project, index) => (
                    <div key={index} className="project-card">
                      <div className="project-header">
                        <h3 className="project-title">{project.title}</h3>
                        {project.subTitle && (
                          <p className="project-subtitle">{project.subTitle}</p>
                        )}
                      </div>
                      {project.tech && (
                        <p className="project-tech">
                          <Code className="w-3 h-3" />
                          {project.tech}
                        </p>
                      )}
                      {project.stats && (
                        <span className="project-stats">{project.stats}</span>
                      )}
                      {project.description && (
                        <p className="project-description">{project.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {(skills.languages?.length > 0 ||
              skills.frameworks?.length > 0 ||
              skills.tools?.length > 0 ||
              skills.databases?.length > 0) && (
              <section className="profile-section">
                <h2 className="section-title">
                  <Code className="section-icon" />
                  Skills
                </h2>
                <div className="skills-container">
                  {skills.languages?.length > 0 && (
                    <div className="skill-category">
                      <h3 className="skill-category-title">Languages</h3>
                      <div className="skill-tags">
                        {skills.languages.map((skill, index) => (
                          <span key={index} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {skills.frameworks?.length > 0 && (
                    <div className="skill-category">
                      <h3 className="skill-category-title">Frameworks</h3>
                      <div className="skill-tags">
                        {skills.frameworks.map((skill, index) => (
                          <span key={index} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {skills.tools?.length > 0 && (
                    <div className="skill-category">
                      <h3 className="skill-category-title">Tools</h3>
                      <div className="skill-tags">
                        {skills.tools.map((skill, index) => (
                          <span key={index} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {skills.databases?.length > 0 && (
                    <div className="skill-category">
                      <h3 className="skill-category-title">Databases</h3>
                      <div className="skill-tags">
                        {skills.databases.map((skill, index) => (
                          <span key={index} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <section className="profile-section">
                <h2 className="section-title">
                  <Award className="section-icon" />
                  Certifications
                </h2>
                <div className="certifications-list">
                  {certifications.map((cert, index) => (
                    <div key={index} className="certification-item">
                      <h3 className="certification-category">{cert.category}</h3>
                      <p className="certification-details">{cert.details}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {!personal.first_name &&
              !summary &&
              education.length === 0 &&
              experience.length === 0 &&
              projects.length === 0 &&
              certifications.length === 0 && (
                <div className="profile-empty-state">
                  <User className="w-16 h-16 text-white/30" />
                  <h3 className="empty-state-title">No Profile Data</h3>
                  <p className="empty-state-text">
                    Complete your profile to showcase your skills and experience.
                  </p>
                  <button
                    onClick={() => navigate("/profile/update")}
                    className="empty-state-btn"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Complete Your Profile</span>
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

