import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

const AdminUpdateJobOpening = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const [jobsData, setJobsData] = useState({
        joId: "8723B287-CCC3-46D9-CE23-08EEBF2GFD35",
        title: "Jr. Software Engineer",
        noOfOpening: 4,
        requiredSkills: "Asp.Net ReactJS",
        preferredSkills: "Git Azure",
        location: "Ahmedabad",
        experience: "1",
        description: "Bachelor s/Master s degree in Engineering, Computer Science (or equivalent experience). At least 1+ years of relevant experience as a software engineer. A minimum of 1+ years of C#, .Net Core, and SQL development experience. Excellent English communication skills",
        status: "Open"
    });

    return <div className="flex flex-col h-screen">

        {/* Navbar */}
        <Navbar />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Content Area */}
            <main className="flex-1 bg-neutral-950 text-white p-3 sm:p-6 overflow-y-auto">
                <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-400">Update Job Opening</h1>
            </main>
        </div>

    </div>;
};

export default AdminUpdateJobOpening;
