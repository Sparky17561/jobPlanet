import React from "react";
import { Clock, CheckCircle2, Circle } from "lucide-react";

const RecentTasks = () => {
  const tasks = [
    {
      id: 1,
      title: "Resume tailored for Software Engineer at Google",
      type: "Resume",
      status: "completed",
      date: "2 hours ago",
    },
    {
      id: 2,
      title: "Cold email generated for Microsoft recruiter",
      type: "Cold Email",
      status: "completed",
      date: "5 hours ago",
    },
    {
      id: 3,
      title: "Interview prep for Amazon SDE role",
      type: "Interview Prep",
      status: "in-progress",
      date: "1 day ago",
    },
    {
      id: 4,
      title: "Application form filled for Meta",
      type: "Form Filler",
      status: "completed",
      date: "2 days ago",
    },
    {
      id: 5,
      title: "Resume tailored for Product Manager at Apple",
      type: "Resume",
      status: "pending",
      date: "3 days ago",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "in-progress":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="recent-tasks">
      <h2 className="section-title">Recent Tasks</h2>
      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <div className="task-icon">{getStatusIcon(task.status)}</div>
            <div className="task-content">
              <div className="task-title">{task.title}</div>
              <div className="task-meta">
                <span className={`task-type ${getStatusColor(task.status)}`}>
                  {task.type}
                </span>
                <span className="task-date">{task.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTasks;

