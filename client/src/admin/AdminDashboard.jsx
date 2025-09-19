import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar fixed at top */}
      <Navbar />

      {/* Main wrapper */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Content Area */}
        <main className="flex-1 bg-neutral-900 text-white p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

          {/* Card container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-800 p-6 rounded-lg shadow-md text-center">
              <button onClick={() => navigate("/admin-user")} className="text-xl">User</button>
            </div>
            <div className="bg-neutral-800 p-6 rounded-lg shadow-md text-center">
              <button onClick={() => navigate("/admin-jobopening")} className="text-xl">Job Opening</button>
            </div>
            <div className="bg-neutral-800 p-6 rounded-lg shadow-md text-center">
              <button onClick={() => navigate("/admin-jobapplication")} className="text-xl">Job Application</button>
            </div>
            <div className="bg-neutral-800 p-6 rounded-lg shadow-md text-center">
              <button onClick={() => navigate("/admin-techinterview")} className="text-xl">Technical Interview</button>
            </div>
            <div className="bg-neutral-800 p-6 rounded-lg shadow-md text-center">
              <button onClick={() => navigate("/admin-hrinterview")} className="text-xl">HR Interview</button>
            </div>
            <div className="bg-neutral-800 p-6 rounded-lg shadow-md text-center">
              <button onClick={() => navigate("/admin-selection")} className="text-xl">Selection</button>
            </div>
            <div className="bg-neutral-800 p-6 rounded-lg shadow-md text-center">
              <button onClick={() => navigate("/admin-document")} className="text-xl">Document List</button>
            </div>
            <div className="bg-neutral-800 p-6 rounded-lg shadow-md text-center">
              <button onClick={() => navigate("/admin-campusdrive")} className="text-xl">Campus Drive</button>
            </div>
            <div className="bg-neutral-800 p-6 rounded-lg shadow-md text-center">
              <button onClick={() => navigate("/admin-employee")} className="text-xl">Employee</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
