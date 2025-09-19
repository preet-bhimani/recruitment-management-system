import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

const AdminUpdateCampusDrive = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const [campusdrive, setCampusDriveData] = useState({
        cdId: "9834B398-CCC4-57D0-CE34-19EEBF3GFD46",
        joId: "8723B287-CCC3-46D9-CE23-08EEBF2GFD35",
        universityName: "RK University",
        DriveDate: "2025-07-16",
    })

    return <div className="flex flex-col h-screen">

        {/* Navbar */}
        <Navbar />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Content Area */}
            <main className="flex-1 bg-neutral-950 text-white p-3 sm:p-6 overflow-y-auto">
                <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-400">Update Campus Drive</h1>

                {/* User Update Form */}
                <div className="max-w-6xl mx-auto">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg">
                        {/* Campus Drive ID */}
                        <div className="md:col-span-2">
                            <label className="block mb-1 text-sm font-medium text-neutral-300">
                                Campus Drive ID
                            </label>
                            <input
                                type="text"
                                defaultValue={campusdrive.cdId}
                                disabled
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-300 cursor-not-allowed" />
                        </div>

                        {/* Job Opening Id */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Job Opening Id <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                defaultValue={campusdrive.joId}
                                placeholder="Enter Job Opening Id"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* University Name */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                University Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                defaultValue={campusdrive.universityName}
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
                                defaultValue={campusdrive.DriveDate}
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-200
                                           focus:outline-none focus:ring-2 focus:ring-sky-600"/>
                        </div>

                        {/* Submit */}
                        <div className="md:col-span-2">
                            <button
                                type="button"
                                className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-medium">
                                + Update Campus Drive
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    </div>;
};

export default AdminUpdateCampusDrive;
