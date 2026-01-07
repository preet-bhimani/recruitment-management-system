import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { useParams } from "react-router-dom";
import UpdateJobOpening from "../../reusableComponent/Job Opening/UpdateJobOpening";

const AdminUpdateJobOpening = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);
    const { id } = useParams();

    return <div className="flex flex-col h-screen">

        {/* Navbar */}
        <Navbar />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Content Area */}
            <main className="flex-1 bg-neutral-950 text-white p-3 sm:p-6 overflow-y-auto">
                <div className="text-center mt-8 mb-8">
                    <h1 className="text-4xl font-bold text-center text-white mb-4">Update Job Opening</h1>
                </div>
                <UpdateJobOpening id={id} />
            </main>
        </div>

    </div>;
};

export default AdminUpdateJobOpening;
