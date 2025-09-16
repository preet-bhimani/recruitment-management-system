import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../Sidebar";

const AdminAddEmployee = () => {

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
                <h1 className="text-2xl font-bold mb-6 text-blue-400">Add Employee</h1>


                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-6 rounded-lg shadow-lg">
                    {/* User Id */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            User Id <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter User Id"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Selection Id */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Selection Id <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Selection Id"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Job Application Id */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Job Application Id <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Job Application Id"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Job Opening Id */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Job Opening Id <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Job Opening Id"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Document List Id */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Document List Id <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Document List Id"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Joining Date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-neutral-200">
                            Joining Date <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="date"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-200
                                           focus:outline-none focus:ring-2 focus:ring-sky-600"/>
                    </div>

                    {/* Probation Time */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Probation Time</label>
                        <input
                            type="text"
                            placeholder="Enter Probation time (in months)"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Salary */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Salary <span className="text-rose-500">*</span></label>
                        <input
                            type="number"
                            placeholder="Enter Salary"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Department <span className="text-rose-500">*</span></label>
                        <input
                            type="text"
                            placeholder="Enter Department"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Status</label>
                        <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2">
                        <button
                            type="button"
                            className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-medium">
                            + Add Employee
                        </button>
                    </div>
                </form>
            </main>
        </div>
    </div >;
};

export default AdminAddEmployee;
