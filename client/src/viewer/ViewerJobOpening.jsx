import React, { useState } from "react";
import CommonNavbar from "../components/CommonNavbar";
import Footer from "../components/Footer";
import JobOpening from "../reusableComponent/JobOpening";
import ViewerSidebar from "./ViewerSidebar";

const ViewerJobOpening = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

  return <div className="min-h-screen flex flex-col bg-neutral-950">
        {/* Navbar */}
        <CommonNavbar isLoggedIn={true} role="Viewer" />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            <ViewerSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>

            {/* Main Content */}
            <main className="flex-1 bg-neutral-950 text-white p-6 overflow-y-auto">
                <div className="text-center mt-8 mb-8">
                    <h1 className="text-4xl font-bold text-center text-white mb-4">Job Opening</h1>
                </div>
                <JobOpening role="viewer"/>
            </main>
        </div>
        {/* Footer */}
        <Footer />
    </div>;
};

export default ViewerJobOpening;
