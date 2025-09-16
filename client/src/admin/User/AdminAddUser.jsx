import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../Sidebar";

const AdminAddUser = () => {
    
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex flex-col h-screen">
            {/* Navbar */}
            <Navbar />

            {/* Main Layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>

                {/* Page Content */}
                <main className="flex-1 bg-neutral-950 text-white p-6 overflow-y-auto">
                    <h1 className="text-2xl font-bold mb-6 text-blue-400">Add New User</h1>


                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-6 rounded-lg shadow-lg">
                        {/* Full Name */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Full Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter full name"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Email <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Password <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Phone Number <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter phone number"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* City */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                City <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter city"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* DOB */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-neutral-200">
                                Date of Birth <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="date"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-200
                                           focus:outline-none focus:ring-2 focus:ring-sky-600"/>
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Skills</label>
                            <input
                                type="text"
                                placeholder="React, Java"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* Photo */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Photo <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full p-1.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-200
                                           file:h-8.5 file:px-3 file:rounded file:border-0 
                                         file:bg-neutral-600 file:text-white hover:file:bg-sky-800 cursor-pointer"/>
                        </div>

                        {/* Resume */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Resume <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="file"
                                className="w-full p-1.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-200
                                           file:h-8.5 file:px-3 file:rounded file:border-0 
                                         file:bg-neutral-600 file:text-white hover:file:bg-sky-800 cursor-pointer"/>
                        </div>

                        {/* Bachelor Details */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Bachelor Degree</label>
                            <input
                                type="text"
                                placeholder="Enter degree"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Bachelor University</label>
                            <input
                                type="text"
                                placeholder="Enter university"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Bachelor %</label>
                            <input
                                type="number"
                                placeholder="Enter percentage"
                                min="0"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* Master Details */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Master Degree</label>
                            <input
                                type="text"
                                placeholder="Enter degree"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Master University</label>
                            <input
                                type="text"
                                placeholder="Enter university"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Master %</label>
                            <input
                                type="number"
                                placeholder="Enter percentage"
                                min="0"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Years of Experience</label>
                            <input
                                type="number"
                                placeholder="Enter years"
                                min="0"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Previous Company Name</label>
                            <input
                                type="text"
                                placeholder="Enter company"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Previous Company Title</label>
                            <input
                                type="text"
                                placeholder="Enter title"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* Reference */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Reference <span className="text-rose-500">*</span>
                            </label>
                            <select
                                name="reference"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100">
                                <option value="" disabled>Select Reference</option>
                                <option value="Campus Drive">Campus Drive</option>
                                <option value="Walk in drive">Walk in drive</option>
                                <option value="Recruitment Apps">Recruitment Apps</option>
                                <option value="Friends">Family/Friends</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        {/* CDID */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">CDID</label>
                            <input
                                type="text"
                                placeholder="Enter CDID"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Role</label>
                            <select
                                name="role"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100">
                                <option value="" disabled>Select Role</option>
                                <option value="Candidate">Candidate</option>
                                <option value="Recruiter">Recruiter</option>
                                <option value="HR">HR</option>
                                <option value="Interviewer">Interviewer</option>
                                <option value="Reviewer">Reviewer</option>
                                <option value="Viewer">Viewer</option>
                                <option value="Admin">Admin</option>
                            </select>
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
                                + Add User
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div >
    );
};

export default AdminAddUser;
