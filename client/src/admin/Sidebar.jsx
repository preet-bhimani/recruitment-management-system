import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  User,
  BriefcaseBusiness,
  FileUser,
  HatGlasses,
  HandCoins,
  Speech,
  BadgeCheck,
  DockIcon,
  University,
  IdCardLanyard,
  GraduationCap,
} from "lucide-react";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [openItem, setOpenItem] = useState(null);

  const items = [
    {
      title: "User",
      icon: <User size={20} />,
      children: [
        { name: "Admin User", path: "/admin-user" },
        { name: "Add User", path: "/admin-add-user" },
      ],
    },
    {
      title: "Job Opening",
      icon: <BriefcaseBusiness size={20} />,
      children: [
        { name: "Admin Job Opening", path: "/admin-jobopening" },
        { name: "Add Job Opening ", path: "/admin-add-jobopening" },
      ],
    },
    {
      title: "Job Application",
      icon: <FileUser size={20} />,
      children: [
        { name: "Admin Job Application", path: "/admin-jobapplication" },
        { name: "Add Job Application ", path: "/admin-add-jobapplication" },
      ],
    },
    {
      title: "Technical Interview",
      icon: <Speech size={20} />,
      children: [
        { name: "Admin Tech Interview", path: "/admin-techinterview" },
        { name: "Add Tech Interview ", path: "/admin-add-techinterview" },
      ],
    },
    {
      title: "HR Interview",
      icon: <HatGlasses size={20} />,
      children: [
        { name: "Admin HR Interview", path: "/admin-hrinterview" },
        { name: "Add HR Interview ", path: "/admin-add-hrinterview" },
      ],
    },
    {
      title: "Document List",
      icon: <DockIcon size={20} />,
      children: [{ name: "Admin Document List", path: "/admin-document" }],
    },
    {
      title: "Offer Letter",
      icon: <HandCoins size={20} />,
      children: [
        { name: "Admin Offer Letter", path: "/admin-offer-letter" },
        { name: "Sent Offer Letter", path: "/admin-add-offerletter" },
      ],
    },
    {
      title: "Selection",
      icon: <BadgeCheck size={20} />,
      children: [{ name: "Admin Selection", path: "/admin-selection" }],
    },
    {
      title: "Campus Drive",
      icon: <University size={20} />,
      children: [
        { name: "Admin Campus Drive", path: "/admin-campusdrive" },
        { name: "Add Campus Drive ", path: "/admin-add-campusdrive" },
      ],
    },
    {
      title: "Employee",
      icon: <IdCardLanyard size={20} />,
      children: [
        { name: "Admin Employee", path: "/admin-employee" },
        { name: "Add Employee ", path: "/admin-add-employee" },
      ],
    },
    {
      title: "Skill",
      icon: <GraduationCap size={20} />,
      children: [
        { name: "Admin Skill", path: "/admin-skill" },
        { name: "Add Skill ", path: "/admin-add-skill" },
      ],
    },
  ];

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div
      className={`h-[calc(100vh-56px)] bg-neutral-900 text-neutral-200 border-r border-neutral-700 transform transition-all duration-300
      ${isCollapsed ? "w-16" : "w-64"} overflow-y-auto`}>
      {/* Main Layout */}
      <div className="p-4 border-b border-neutral-700 flex justify-between items-center">
        {!isCollapsed && (
          <h2 className="text-xl font-bold tracking-wide">Admin Panel</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-neutral-800 transition ml-auto">
          {isCollapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* Menu Items */}
      <ul className="p-2 space-y-2">
        {items.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center p-2 rounded-lg hover:bg-neutral-800 transition">
              <span className="mr-2">{item.icon}</span>
              {!isCollapsed && (
                <span className="flex-1 text-left">{item.title}</span>
              )}
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
                      className="block p-2 rounded hover:text-neutral-100 hover:bg-neutral-800 transition">
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

export default Sidebar;
