import React, { useState } from "react";
import CommonNavbar from "../components/CommonNavbar";
import RecruiterSidebar from "./RecruiterSidebar";
import Footer from "../components/Footer";

const RecruiterDashboard = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-neutral-950">
            {/* Navbar */}
            <CommonNavbar isLoggedIn={true} role="Recruiter" />

            <div className="flex flex-1">
                {/* Sidebar */}
                <RecruiterSidebar
                    isCollapsed={sidebarCollapsed}
                    setIsCollapsed={setSidebarCollapsed}/>

                {/* Main Layout */}
                <main className={`flex-1 transition-all duration-300 text-neutral-300 ${sidebarCollapsed ? 'ml-0' : 'ml-0'}`}>
                    <div className="p-6">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-bold text-white mb-4">Recruiter Dashboard</h1>
                                <p className="text-neutral-400">Manage candidates, job openings, and interviews</p>
                            </div>

                            {/* Dashboard Area */}
                            <div className="bg-neutral-900 rounded-lg p-6">
                                {/* Card container */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-neutral-800 p-6 rounded-lg shadow-md text-center">
                                        <button onClick={() => navigate("/admin-user")} className="text-xl">Candidate</button>
                                    </div>
                                    <div className="bg-neutral-800 p-6 rounded-lg shadow-md text-center">
                                        <button onClick={() => navigate("/admin-jobopening")} className="text-xl">Job Opening</button>
                                    </div>
                                    <div className="bg-neutral-800 p-6 rounded-lg shadow-md text-center">
                                        <button onClick={() => navigate("/admin-jobapplication")} className="text-xl">Interview</button>
                                    </div>
                                </div>
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
