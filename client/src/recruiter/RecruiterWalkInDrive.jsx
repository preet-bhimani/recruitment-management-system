import React, { useState } from "react";
import CommonNavbar from "../components/CommonNavbar";
import RecruiterSidebar from "./RecruiterSidebar";
import Footer from "../components/Footer";
import WalkInDrive from "../reusableComponent/Walk In Drive/WalkInDrive";

function RecruiterWalkInDrive() {

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return <div className="min-h-screen flex flex-col bg-neutral-950">
        {/* Navbar */}
        <CommonNavbar isLoggedIn={true} role="Recruiter" />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <RecruiterSidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />

            {/* Main Content */}
            <main className="flex-1 bg-neutral-950 text-white p-6 overflow-y-auto">
                <div className="text-center mt-8 mb-8">
                    <h1 className="text-4xl font-bold text-center text-white mb-4">Walk In Drive</h1>
                </div>
                <WalkInDrive role="recruiter" />
            </main>
        </div>
        {/* Footer */}
        <Footer />
    </div>;
}

export default RecruiterWalkInDrive;
