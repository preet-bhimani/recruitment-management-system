import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import CommonNavbar from "../components/CommonNavbar";
import RecruiterSidebar from "./RecruiterSidebar";
import SentOfferLetter from "../reusableComponent/Offer Letter/SentOfferLetter";
import Footer from "../components/Footer";

function RecruiterSentOfferLetter() {

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { id } = useParams();

    return <div className="min-h-screen flex flex-col bg-neutral-950">
        {/* Navbar */}
        <CommonNavbar isLoggedIn={true} role="recruiter" />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <RecruiterSidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />

            {/* Main Content */}
            <main className="flex-1 bg-neutral-950 text-white p-6 overflow-y-auto">
                <div className="text-center mt-8 mb-8">
                    <h1 className="text-4xl font-bold text-center text-white mb-4">Sent Offer Letter</h1>
                </div>
                <SentOfferLetter role="recruiter" id={id} />
            </main>
        </div>
        {/* Footer */}
        <Footer />
    </div>;
}

export default RecruiterSentOfferLetter;
