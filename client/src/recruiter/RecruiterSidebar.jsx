import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Users,
  Briefcase,
  Calendar,
  UserPlus,
  FileText,
  FileSpreadsheet,
  Plus,
  Video
} from "lucide-react";

const RecruiterSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [openItem, setOpenItem] = useState(null);

  const items = [
    {
      title: "Candidates",
      icon: <Users size={20} />,
      children: [
        { name: "Candidates", path: "/recruiter-candidates" },
        { name: "Add Candidates", path: "/recruiter-add-candidates" },
        { name: "Add Candidates by Resume", path: "/recruiter-add-candidates-resume" },
        { name: "Add Candidates by Excel", path: "/recruiter-add-candidates-excel" },
      ],
    },
    {
      title: "Job Opening",
      icon: <Briefcase size={20} />,
      children: [
        { name: "Job Opening", path: "/recruiter-job-opening" },
        { name: "Create Job Opening", path: "/recruiter-create-job-opening" },
      ],
    },
    {
      title: "Interviews",
      icon: <Calendar size={20} />,
      children: [
        { name: "Interviews", path: "/recruiter-interviews" },
        { name: "Schedule Meeting", path: "/recruiter-schedule-meeting" },
      ],
    },
  ];

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div
      className={`h-[calc(100vh-56px)] bg-neutral-900 text-neutral-200 border-r border-neutral-700 transform transition-all duration-300
      ${isCollapsed ? "w-16" : "w-64"}`}>
      
      {/* Header */}
      <div className="p-4 border-b border-neutral-700 flex justify-between items-center">
        {!isCollapsed && (
          <h2 className="text-xl font-bold tracking-wide">Recruiter Panel</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-neutral-800 transition ml-auto"
        >
          {isCollapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* Menu Items */}
      <ul className="p-2 space-y-2">
        {items.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center p-2 rounded-lg hover:bg-neutral-800 transition"
            >
              <span className="mr-2">{item.icon}</span>
              {!isCollapsed && <span className="flex-1 text-left">{item.title}</span>}
              {!isCollapsed &&
                (openItem === index ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                ))}
            </button>

            {!isCollapsed && openItem === index && (
              <ul className="ml-8 mt-1 space-y-1 text-sm text-neutral-400">
                {item.children.map((child, i) => (
                  <li key={i}>
                    <Link
                      to={child.path}
                      className="block p-2 rounded hover:text-neutral-100 hover:bg-neutral-800 transition"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecruiterSidebar;
