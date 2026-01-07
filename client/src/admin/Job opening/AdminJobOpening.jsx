import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import JobOpening from "../../reusableComponent/Job Opening/JobOpening"

const AdminJobOpening = () => {
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Content */}
        <main className="flex-1 bg-neutral-950 text-white p-6 overflow-y-auto">
          <div className="text-center mt-8 mb-8">
            <h1 className="text-4xl font-bold text-center text-white mb-4">Admin Job Opening</h1>
          </div>
          <JobOpening />
        </main>
      </div>
    </div>
  );
};

export default AdminJobOpening;
