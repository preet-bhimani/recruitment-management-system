import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import AddCampusDrive from "../../reusableComponent/Campus Drive/AddCampusDrive";

const AdminAddCampusDrive = () => {

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
                    <h1 className="text-4xl font-bold text-white mb-4">Add Campus Drive</h1>
                </div>
                <AddCampusDrive role="Admin" />
            </main>
        </div>
    </div>;
};

export default AdminAddCampusDrive;
