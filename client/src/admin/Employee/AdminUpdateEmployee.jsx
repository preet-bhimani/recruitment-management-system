import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

const AdminUpdateEmployee = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const [employeeData, setEmployeeData] = useState({
        empId: "9CF256C4-7ECA-4469-8CCE-08DD70ACE5C1",
        userId: "3F7D9A6B-28BD-405E-A1CD-F160894C79BA",
        jaId: "9834B398-CCC4-57D0-CE34-19EEBF3GFD46",
        joId: "8723C287-DDD3-46E9-BF23-08FFCE2HGE35",
        selectionId: "9282H458-JAK1-42N9-W158-30KZMN1EPL59",
        dlId: "1203M590-NOB8-94P5-QR78-21STUV3QWX86",
        joiningDate: "2026-01-18",
        department: "IT Backend",
        probationPeriod: 0,
        salary: 50000,
    })

    return <div className="flex flex-col h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Page Content */}
            <main className="flex-1 bg-neutral-950 text-white p-6 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-6 text-blue-400">Update Employee</h1>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-6 rounded-lg shadow-lg">
                    {/* Employee ID */}
                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm font-medium text-neutral-300">
                            Employee ID
                        </label>
                        <input
                            type="text"
                            value={employeeData.empId}
                            disabled
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-300 cursor-not-allowed" />
                    </div>

                    {/* User Id */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            User Id <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            defaultValue={employeeData.userId}
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Selection Id */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Selection Id <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            defaultValue={employeeData.selectionId}
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Job Application Id */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Job Application Id <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            defaultValue={employeeData.jaId}
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Job Opening Id */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Job Opening Id <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            defaultValue={employeeData.joId}
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Document List Id */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Document List Id <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            defaultValue={employeeData.dlId}
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Joining Date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-neutral-200">
                            Joining Date <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="date"
                            defaultValue={employeeData.joiningDate}
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-200
                                    focus:outline-none focus:ring-2 focus:ring-sky-600"/>
                    </div>

                    {/* Probation Time */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Probation Time</label>
                        <input
                            type="text"
                            defaultValue={employeeData.probationPeriod}
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Salary */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Salary <span className="text-rose-500">*</span></label>
                        <input
                            type="number"
                            defaultValue={employeeData.salary}
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Department <span className="text-rose-500">*</span></label>
                        <input
                            type="text"
                            defaultValue={employeeData.department}
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Status</label>
                        <select className="w-full p-2.5 rounded bg-neutral-800 border border-neutral-700">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2">
                        <button
                            type="button"
                            className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-medium">
                            Update Employee
                        </button>
                    </div>
                </form>
            </main>
        </div>
    </div >;
};

export default AdminUpdateEmployee;
