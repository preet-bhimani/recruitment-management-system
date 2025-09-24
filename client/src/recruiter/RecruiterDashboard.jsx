import React, { useState } from "react";
import CommonNavbar from "../components/CommonNavbar";
import RecruiterSidebar from "./RecruiterSidebar";
import Footer from "../components/Footer";
import { 
  Users, 
  FileText, 
  Calendar, 
  UserCheck, 
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const dashboardStats = [
    {
      title: "All Applications",
      count: 45,
      icon: <Users className="w-8 h-8" />,
      color: "bg-purple-700",
      route: "/recruiter-candidate"
    },
    {
      title: "Exam Stage",
      count: 12,
      icon: <FileText className="w-8 h-8" />,
      color: "bg-blue-700",
      route: "/recruiter-exam"
    },
    {
      title: "Tech Interview",
      count: 8,
      icon: <Calendar className="w-8 h-8" />,
      color: "bg-indigo-700",
      route: "/recruiter-tech-interview"
    },
    {
      title: "HR Interview",
      count: 5,
      icon: <UserCheck className="w-8 h-8" />,
      color: "bg-purple-600",
      route: "/recruiter-hr-interview"
    },
    {
      title: "Final Selection",
      count: 3,
      icon: <TrendingUp className="w-8 h-8" />,
      color: "bg-emerald-700",
      route: "/recruiter-selection"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950">
      {/* Navbar */}
      <CommonNavbar isLoggedIn={true} role="Recruiter" />

      <div className="flex flex-1">
        {/* Sidebar */}
        <RecruiterSidebar
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />

        {/* Main Content */}
        <main className="flex-1 transition-all duration-300 text-neutral-300">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">Recruiter Dashboard</h1>
                <p className="text-neutral-400">Manage candidates and recruitment process</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(stat.route)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.color} p-3 rounded-lg text-white`}>
                        {stat.icon}
                      </div>
                      <div className="text-3xl font-bold text-white">{stat.count}</div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white">{stat.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RecruiterDashboard;
