import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import Employee from "../../reusableComponent/Employee/Employee";


const AdminEmployee = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    return <div className="flex flex-col h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            <main className="flex-1 bg-neutral-950 text-white p-6 overflow-y-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Employee</h1>
                </div>
                <Employee role="admin" />
            </main>
        </div>
    </div >;
};

export default AdminEmployee;
