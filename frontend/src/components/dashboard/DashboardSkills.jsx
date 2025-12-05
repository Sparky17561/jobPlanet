import React, { useMemo } from "react";
import { Code, Database, Cloud, GitBranch } from "lucide-react";

const DashboardSkills = ({ profileData }) => {
  const skills = useMemo(() => {
    const allSkills = [];
    const skillsData = profileData?.skills || {};

    // Languages
    if (skillsData.languages && skillsData.languages.length > 0) {
      skillsData.languages.forEach(skill => {
        allSkills.push({ name: skill, category: "languages", icon: Code });
      });
    }

    // Frameworks
    if (skillsData.frameworks && skillsData.frameworks.length > 0) {
      skillsData.frameworks.forEach(skill => {
        allSkills.push({ name: skill, category: "frameworks", icon: Code });
      });
    }

    // Tools
    if (skillsData.tools && skillsData.tools.length > 0) {
      skillsData.tools.forEach(skill => {
        allSkills.push({ name: skill, category: "tools", icon: GitBranch });
      });
    }

    // Databases
    if (skillsData.databases && skillsData.databases.length > 0) {
      skillsData.databases.forEach(skill => {
        allSkills.push({ name: skill, category: "databases", icon: Database });
      });
    }

    // Assign default levels based on category (you can customize this)
    return allSkills.map(skill => ({
      ...skill,
      level: skill.category === "languages" ? 85 : 
             skill.category === "frameworks" ? 80 :
             skill.category === "databases" ? 75 : 70
    })).slice(0, 8); // Show top 8 skills
  }, [profileData]);

  if (skills.length === 0) {
    return (
      <div className="dashboard-skills">
        <h2 className="section-title">Your Skills</h2>
        <div className="skills-empty">
          <p className="empty-text">No skills added yet. Update your profile to add skills.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-skills">
      <h2 className="section-title">Your Skills</h2>
      <div className="skills-grid">
        {skills.map((skill, index) => {
          const IconComponent = skill.icon;
          return (
            <div key={index} className="skill-item">
              <div className="skill-header">
                <IconComponent className="skill-icon" />
                <span className="skill-name">{skill.name}</span>
                <span className="skill-percentage">{skill.level}%</span>
              </div>
              <div className="skill-bar">
                <div
                  className="skill-progress"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardSkills;

