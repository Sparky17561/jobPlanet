import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Mail,
  MessageSquare,
  User,
  Settings,
} from "lucide-react";

const DashboardSidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Resume Builder", icon: FileText, path: "/resume-builder" },
    { name: "Cold Reply Generator", icon: Mail, path: "/products/cold-mail" },
    { name: "Prep Hub", icon: MessageSquare, path: "/products/prep-hub" },
  ];

  const isActive = (path) => {
    if (path === "/products/cold-mail") {
      return location.pathname === "/products/cold-mail";
    }
    if (path === "/products/prep-hub") {
      return location.pathname === "/products/prep-hub";
    }
    return location.pathname === path;
  };

  const bottomItems = [
    { name: "Profile", icon: User, path: "/profile" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];


  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-content">
        {/* Top Navigation */}
        <div className="sidebar-nav">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={index}
                to={item.path}
                className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
              >
                <IconComponent className="sidebar-icon" />
                <span className="sidebar-text">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="sidebar-bottom">
          {bottomItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={index}
                to={item.path}
                className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
              >
                <IconComponent className="sidebar-icon" />
                <span className="sidebar-text">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

