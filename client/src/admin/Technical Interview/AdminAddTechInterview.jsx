import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../Sidebar";

const AdminAddTechInterview = () => {

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
                <h1 className="text-2xl font-bold mb-6 text-blue-400">Add Technical Interview</h1>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-6 rounded-lg shadow-lg">
                    {/* TI ID */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            TI ID <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter TI ID"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>
                </form>
            </main>
        </div>
    </div>;
};

export default AdminAddTechInterview;
