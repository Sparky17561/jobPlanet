import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User, Plus, X, Loader2, Save, AlertCircle, Key } from "lucide-react";
import "./ProfileUpdate.css";

const ProfileUpdate = () => {
  const { updateProfile, fetchProfile, user, updateGeminiKey, geminiKey } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");

  const [formData, setFormData] = useState({
    personal: {
      first_name: "",
      last_name: "",
      city: "",
      country: "IN",
      phone: "",
      email: user?.email || "",
      github: "",
      linkedin: "",
    },
    summary: "",
    education: [],
    experience: [],
    projects: [],
    skills: {
      languages: [],
      frameworks: [],
      tools: [],
      databases: [],
    },
    certifications: [],
  });

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (geminiKey) {
      setGeminiApiKey(geminiKey);
    }
  }, [geminiKey]);

  const loadProfile = async () => {
    setIsFetching(true);
    const profile = await fetchProfile();
    // Gemini API key will be loaded via useEffect when geminiKey from context updates
    if (profile && Object.keys(profile).length > 0) {
      setFormData({
        personal: {
          first_name: profile.personal?.first_name || "",
          last_name: profile.personal?.last_name || "",
          city: profile.personal?.city || "",
          country: profile.personal?.country || "IN",
          phone: profile.personal?.phone || "",
          email: profile.personal?.email || user?.email || "",
          github: profile.personal?.github || "",
          linkedin: profile.personal?.linkedin || "",
        },
        summary: profile.summary || "",
        education: profile.education || [],
        experience: profile.experience || [],
        projects: profile.projects || [],
        skills: {
          languages: profile.skills?.languages || [],
          frameworks: profile.skills?.frameworks || [],
          tools: profile.skills?.tools || [],
          databases: profile.skills?.databases || [],
        },
        certifications: profile.certifications || [],
      });
    }
    setIsFetching(false);
  };

  const handlePersonalChange = (e) => {
    setFormData({
      ...formData,
      personal: {
        ...formData.personal,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSummaryChange = (e) => {
    setFormData({
      ...formData,
      summary: e.target.value,
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { period: "", degree: "", institution: "", city: "", grade: "" },
      ],
    });
  };

  const removeEducation = (index) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...formData.education];
    updated[index][field] = value;
    setFormData({ ...formData, education: updated });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { period: "", role: "", company: "", city: "", description: "" },
      ],
    });
  };

  const removeExperience = (index) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index),
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...formData.experience];
    updated[index][field] = value;
    setFormData({ ...formData, experience: updated });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        { title: "", subTitle: "", tech: "", stats: "", description: "" },
      ],
    });
  };

  const removeProject = (index) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index),
    });
  };

  const updateProject = (index, field, value) => {
    const updated = [...formData.projects];
    updated[index][field] = value;
    setFormData({ ...formData, projects: updated });
  };

  const addSkill = (category, value) => {
    if (!value.trim()) return;
    setFormData({
      ...formData,
      skills: {
        ...formData.skills,
        [category]: [...formData.skills[category], value.trim()],
      },
    });
  };

  const removeSkill = (category, index) => {
    setFormData({
      ...formData,
      skills: {
        ...formData.skills,
        [category]: formData.skills[category].filter((_, i) => i !== index),
      },
    });
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [
        ...formData.certifications,
        { category: "", details: "" },
      ],
    });
  };

  const removeCertification = (index) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index),
    });
  };

  const updateCertification = (index, field, value) => {
    const updated = [...formData.certifications];
    updated[index][field] = value;
    setFormData({ ...formData, certifications: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Validation
    if (!formData.personal.first_name || !formData.personal.last_name) {
      setError("Please fill in your first and last name");
      setIsLoading(false);
      return;
    }

    // Update profile data
    const result = await updateProfile(formData);

    if (result.success) {
      // Update Gemini API key if provided
      if (geminiApiKey && geminiApiKey.trim() !== "") {
        const keyResult = await updateGeminiKey(geminiApiKey);
        if (!keyResult.success) {
          setError(keyResult.error || "Profile saved but failed to update API key");
          setIsLoading(false);
          return;
        }
      }
      
      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } else {
      setError(result.error || "Failed to update profile");
    }

    setIsLoading(false);
  };

  if (isFetching) {
    return (
      <div className="profile-update-container">
        <div className="profile-loading">
          <Loader2 className="w-8 h-8 animate-spin text-white/60" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-update-container">
      <div className="profile-update-card">
        <div className="profile-header">
          <div className="profile-header-content">
            <User className="w-8 h-8" />
            <div>
              <h1 className="profile-title">Complete Your Profile</h1>
              <p className="profile-subtitle">
                Fill in your details to get started with JobSphere
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="profile-error">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="profile-success">
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          {/* Gemini API Key Section */}
          <section className="profile-section">
            <h2 className="section-title">API Configuration</h2>
            <div className="form-group">
              <label className="form-label">
                <Key className="w-4 h-4 inline mr-2" />
                Gemini API Key (Optional)
              </label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="form-input"
                placeholder="Enter your Gemini API key to enable AI features"
              />
              <p className="form-hint">
                Your API key is stored securely and used for AI-powered features like resume generation and cold email generation.
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline ml-1"
                >
                  Get your API key here
                </a>
              </p>
            </div>
          </section>

          {/* Personal Information */}
          <section className="profile-section">
            <h2 className="section-title">Personal Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.personal.first_name}
                  onChange={handlePersonalChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.personal.last_name}
                  onChange={handlePersonalChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.personal.city}
                  onChange={handlePersonalChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.personal.country}
                  onChange={handlePersonalChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.personal.phone}
                  onChange={handlePersonalChange}
                  className="form-input"
                  placeholder="+91-123456789"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.personal.email}
                  onChange={handlePersonalChange}
                  className="form-input"
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="form-label">GitHub</label>
                <input
                  type="url"
                  name="github"
                  value={formData.personal.github}
                  onChange={handlePersonalChange}
                  className="form-input"
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.personal.linkedin}
                  onChange={handlePersonalChange}
                  className="form-input"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="profile-section">
            <h2 className="section-title">Professional Summary</h2>
            <div className="form-group">
              <textarea
                value={formData.summary}
                onChange={handleSummaryChange}
                className="form-textarea"
                rows={4}
                placeholder="Write a brief summary about yourself..."
              />
            </div>
          </section>

          {/* Education */}
          <section className="profile-section">
            <div className="section-header">
              <h2 className="section-title">Education</h2>
              <button
                type="button"
                onClick={addEducation}
                className="add-button"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            </div>
            {formData.education.map((edu, index) => (
              <div key={index} className="array-item">
                <div className="array-item-header">
                  <span className="array-item-title">Education #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="remove-button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Period</label>
                    <input
                      type="text"
                      value={edu.period}
                      onChange={(e) =>
                        updateEducation(index, "period", e.target.value)
                      }
                      className="form-input"
                      placeholder="2023 -- 2027"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(index, "degree", e.target.value)
                      }
                      className="form-input"
                      placeholder="B.Tech IT"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) =>
                        updateEducation(index, "institution", e.target.value)
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      value={edu.city}
                      onChange={(e) =>
                        updateEducation(index, "city", e.target.value)
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Grade</label>
                    <input
                      type="text"
                      value={edu.grade}
                      onChange={(e) =>
                        updateEducation(index, "grade", e.target.value)
                      }
                      className="form-input"
                      placeholder="8.99"
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Experience */}
          <section className="profile-section">
            <div className="section-header">
              <h2 className="section-title">Experience</h2>
              <button
                type="button"
                onClick={addExperience}
                className="add-button"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </button>
            </div>
            {formData.experience.map((exp, index) => (
              <div key={index} className="array-item">
                <div className="array-item-header">
                  <span className="array-item-title">Experience #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="remove-button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Period</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) =>
                        updateExperience(index, "period", e.target.value)
                      }
                      className="form-input"
                      placeholder="Jul 2025 -- Present"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) =>
                        updateExperience(index, "role", e.target.value)
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(index, "company", e.target.value)
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      value={exp.city}
                      onChange={(e) =>
                        updateExperience(index, "city", e.target.value)
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group form-group-full">
                    <label className="form-label">Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) =>
                        updateExperience(index, "description", e.target.value)
                      }
                      className="form-textarea"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Projects */}
          <section className="profile-section">
            <div className="section-header">
              <h2 className="section-title">Projects</h2>
              <button
                type="button"
                onClick={addProject}
                className="add-button"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </div>
            {formData.projects.map((project, index) => (
              <div key={index} className="array-item">
                <div className="array-item-header">
                  <span className="array-item-title">Project #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="remove-button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) =>
                        updateProject(index, "title", e.target.value)
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subtitle</label>
                    <input
                      type="text"
                      value={project.subTitle}
                      onChange={(e) =>
                        updateProject(index, "subTitle", e.target.value)
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tech Stack</label>
                    <input
                      type="text"
                      value={project.tech}
                      onChange={(e) =>
                        updateProject(index, "tech", e.target.value)
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stats/Achievement</label>
                    <input
                      type="text"
                      value={project.stats}
                      onChange={(e) =>
                        updateProject(index, "stats", e.target.value)
                      }
                      className="form-input"
                      placeholder="1st Place"
                    />
                  </div>
                  <div className="form-group form-group-full">
                    <label className="form-label">Description</label>
                    <textarea
                      value={project.description}
                      onChange={(e) =>
                        updateProject(index, "description", e.target.value)
                      }
                      className="form-textarea"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Skills */}
          <section className="profile-section">
            <h2 className="section-title">Skills</h2>
            {["languages", "frameworks", "tools", "databases"].map((category) => (
              <div key={category} className="skill-category">
                <label className="form-label">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </label>
                <div className="skill-input-group">
                  <input
                    type="text"
                    className="skill-input"
                    placeholder={`Add ${category} (press Enter)`}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill(category, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
                <div className="skill-tags">
                  {formData.skills[category].map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(category, index)}
                        className="skill-tag-remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Certifications */}
          <section className="profile-section">
            <div className="section-header">
              <h2 className="section-title">Certifications</h2>
              <button
                type="button"
                onClick={addCertification}
                className="add-button"
              >
                <Plus className="w-4 h-4" />
                Add Certification
              </button>
            </div>
            {formData.certifications.map((cert, index) => (
              <div key={index} className="array-item">
                <div className="array-item-header">
                  <span className="array-item-title">
                    Certification #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="remove-button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      value={cert.category}
                      onChange={(e) =>
                        updateCertification(index, "category", e.target.value)
                      }
                      className="form-input"
                      placeholder="SQL"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Details</label>
                    <input
                      type="text"
                      value={cert.details}
                      onChange={(e) =>
                        updateCertification(index, "details", e.target.value)
                      }
                      className="form-input"
                      placeholder="CS50"
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

          <div className="form-actions">
            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;

