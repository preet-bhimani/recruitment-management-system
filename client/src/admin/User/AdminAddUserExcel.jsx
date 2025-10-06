import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import AddUserExcel from "../../reusableComponent/User/AddUserExcel";

const AdminAddUserExcel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar fixed at top */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Layout */}
        <main className="flex-1 bg-neutral-950 text-white p-3 sm:p-6 overflow-y-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Add User via Excel</h1>
          </div>
          <AddUserExcel />
        </main>
      </div>
    </div>
  );
};

export default AdminAddUserExcel;
