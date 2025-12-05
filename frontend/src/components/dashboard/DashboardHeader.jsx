import React from "react";
import { Link } from "react-router-dom";

const DashboardHeader = () => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <div className="logo">📄</div>
        <h1 className="header-title">JobSphere Dashboard</h1>
      </div>
      <div className="header-right">
        <button className="header-btn btn-secondary">Notifications</button>
        <Link to="/profile" className="header-btn btn-secondary">
          Profile
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeader;

