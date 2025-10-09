import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import HRInterview from "../../reusableComponent/Hr Interview/HRInterview";

const AdminHRInterview = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    return <div className="flex flex-col h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Page Content */}
            <main className="flex-1 bg-neutral-950 text-white p-6 overflow-y-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">HR Interview</h1>
                </div>
                <HRInterview role="admin" />
            </main>
        </div>
    </div >;
};

export default AdminHRInterview;
