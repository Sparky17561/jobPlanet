import React from "react";
import { Briefcase, Mail, TrendingUp, CheckCircle } from "lucide-react";

const DashboardStats = ({ profileData }) => {
  // Calculate profile strength
  const calculateProfileStrength = () => {
    if (!profileData) return 0;
    
    let score = 0;
    let total = 0;

    // Personal info (20 points)
    total += 20;
    if (profileData.personal?.first_name) score += 5;
    if (profileData.personal?.last_name) score += 5;
    if (profileData.personal?.email) score += 5;
    if (profileData.personal?.phone) score += 5;

    // Summary (15 points)
    total += 15;
    if (profileData.summary && profileData.summary.trim().length > 50) score += 15;

    // Education (20 points)
    total += 20;
    if (profileData.education && profileData.education.length > 0) {
      score += Math.min(20, profileData.education.length * 10);
    }

    // Experience (20 points)
    total += 20;
    if (profileData.experience && profileData.experience.length > 0) {
      score += Math.min(20, profileData.experience.length * 10);
    }

    // Skills (15 points)
    total += 15;
    const skills = profileData.skills || {};
    const totalSkills = (skills.languages?.length || 0) + 
                       (skills.frameworks?.length || 0) + 
                       (skills.tools?.length || 0) + 
                       (skills.databases?.length || 0);
    if (totalSkills > 0) {
      score += Math.min(15, totalSkills * 2);
    }

    // Projects (10 points)
    total += 10;
    if (profileData.projects && profileData.projects.length > 0) {
      score += Math.min(10, profileData.projects.length * 5);
    }

    return Math.round((score / total) * 100);
  };

  const profileStrength = calculateProfileStrength();

  // Count total skills
  const skills = profileData?.skills || {};
  const totalSkills = (skills.languages?.length || 0) + 
                     (skills.frameworks?.length || 0) + 
                     (skills.tools?.length || 0) + 
                     (skills.databases?.length || 0);

  // Count projects
  const totalProjects = profileData?.projects?.length || 0;

  // Count experience
  const totalExperience = profileData?.experience?.length || 0;

  const stats = [
    {
      label: "Total Skills",
      value: totalSkills.toString(),
      change: `${totalSkills} skills listed`,
      trend: "up",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Projects",
      value: totalProjects.toString(),
      change: `${totalProjects} projects added`,
      trend: "up",
      icon: Briefcase,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Profile Strength",
      value: `${profileStrength}%`,
      change: profileStrength >= 80 ? "Excellent!" : profileStrength >= 60 ? "Good" : "Needs work",
      trend: profileStrength >= 60 ? "up" : "down",
      icon: TrendingUp,
      color: profileStrength >= 80 ? "from-green-500 to-emerald-500" : profileStrength >= 60 ? "from-yellow-500 to-orange-500" : "from-red-500 to-pink-500",
    },
    {
      label: "Work Experience",
      value: totalExperience.toString(),
      change: `${totalExperience} positions listed`,
      trend: "up",
      icon: CheckCircle,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="dashboard-stats">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="stat-card">
            <div className="stat-icon-wrapper">
              <div className={`stat-icon bg-gradient-to-br ${stat.color}`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-change ${stat.trend}`}>
                {stat.change}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;

