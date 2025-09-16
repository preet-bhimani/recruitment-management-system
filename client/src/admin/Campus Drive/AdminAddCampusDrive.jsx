import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../../components/Navbar";

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
                <h1 className="text-2xl font-bold mb-6 text-blue-400">Add Campus Drive</h1>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-6 rounded-lg shadow-lg">

                    {/* Job Opening ID */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Job Opening ID <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Job Opening ID"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* University Name */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            University Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter University Name"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Drive Date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-neutral-200">
                            Drive Date <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="date"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-200
                                           focus:outline-none focus:ring-2 focus:ring-sky-600"/>
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2">
                        <button
                            type="button"
                            className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-medium">
                            + Add Campus Drive
                        </button>
                    </div>
                </form>
            </main>
        </div>
    </div>;
};

export default AdminAddCampusDrive;
