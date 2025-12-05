import React, { useEffect } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardSkills from "../components/dashboard/DashboardSkills";
import RecentTasks from "../components/dashboard/RecentTasks";
import { useAuth } from "../contexts/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, profileData, fetchProfile } = useAuth();

  useEffect(() => {
    // Only fetch if we don't have profile data yet
    if (!profileData) {
      fetchProfile();
    }
  }, []); // Empty dependency array - only run once on mount

  const firstName = profileData?.personal?.first_name || user?.username || "User";

  return (
    <div className="dashboard-app">
      <DashboardHeader />
      <div className="dashboard-main-container">
        <DashboardSidebar />
        <div className="dashboard-content-area">
          <div className="dashboard-content">
            <div className="dashboard-welcome">
              <h1 className="dashboard-title">Welcome back, {firstName}! 👋</h1>
              <p className="dashboard-subtitle">
                Here's what's happening with your job applications today.
              </p>
            </div>

            <DashboardStats profileData={profileData} />

            <div className="dashboard-grid">
              <DashboardSkills profileData={profileData} />
              <RecentTasks />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
