import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { useParams } from "react-router-dom";
import ShowAddCampusDrive from "../../reusableComponent/Campus Drive/ShowAddCampusDrive";

function AdminAddJobCampusDrive() {

    const [isCollapsed, setIsCollapsed] = useState(false);
    const { id } = useParams();

    return <div className="flex flex-col h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Page Content */}
            <main className="flex-1 bg-neutral-950 text-white p-6 overflow-y-auto">
                <ShowAddCampusDrive role="Admin" id={id} />
            </main>
        </div>
    </div >;
}

export default AdminAddJobCampusDrive;
