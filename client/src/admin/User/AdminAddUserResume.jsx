import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../Sidebar";
import { Upload, FileText } from "lucide-react";

const AdminAddUserResume = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex flex-col h-screen">
            {/* Navbar fixed at top */}
            <Navbar />

            {/* Main wrapper */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

                {/* Content Area */}
                <main className="flex-1 bg-neutral-950 text-white p-3 sm:p-6 overflow-y-auto">
                    <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-400">Add User with Resume</h1>

                    {/* Resume Upload */}
                    <div className="max-w-xl mx-auto mb-6">
                        <div className="bg-neutral-900 p-4 rounded-lg shadow-md">
                            <div className="text-center">
                                <FileText className="mx-auto mb-2 text-neutral-400" size={32} />
                                <h2 className="text-lg font-semibold mb-2">Upload Resume</h2>
                                <p className="text-neutral-400 mb-4 text-sm">
                                    Upload resume file to auto-fill user details
                                </p>

                                {/* File Upload */}
                                <div className="border-2 border-dashed border-neutral-600 rounded-lg p-4 mb-3 hover:border-neutral-500 transition">
                                    <input
                                        id="resume-upload"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="hidden"/>
                                    <label
                                        htmlFor="resume-upload"
                                        className="cursor-pointer flex flex-col items-center justify-center">
                                        <div className="flex flex-col items-center">
                                            <Upload className="text-neutral-400 mb-1 mx-auto" size={24} />
                                            <span className="text-neutral-200 block text-sm">Click to upload resume</span>
                                            <span className="text-xs text-neutral-400 mt-1 block">
                                                PDF, DOC, DOCX
                                            </span>
                                        </div>
                                    </label>
                                </div>

                                {/* Upload Button */}
                                <button className="px-4 py-2 rounded-lg font-medium bg-sky-700 hover:bg-sky-600 text-white transition text-sm">
                                    Process Resume
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* User Details Form */}
                    <div className="max-w-6xl mx-auto">
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg">

                            {/* Full Name */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    Full Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter full name"
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400"/>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    Email <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400"/>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    Password <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400"/>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    Phone Number <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter phone number"
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400"/>
                            </div>

                            {/* City */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    City <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter city"
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400"/>
                            </div>

                            {/* DOB */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    Date of Birth <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-sky-600"/>
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">Skills</label>
                                <input
                                    type="text"
                                    placeholder="e.g., React, Java"
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400"/>
                            </div>

                            {/* Photo */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    Photo <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full p-1.5 rounded bg-neutral-800 border border-neutral-600 text-neutral-100
                  file:h-8.5 file:px-3 file:rounded file:border-0 
                  file:bg-neutral-600 file:text-white hover:file:bg-sky-800 cursor-pointer"/>
                            </div>

                            {/* Bachelor Details */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">Bachelor Degree</label>
                                <input
                                    type="text"
                                    placeholder="Enter degree"
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400"/>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Bachelor University</label>
                                <input
                                    type="text"
                                    placeholder="Enter university"
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400"/>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Bachelor %</label>
                                <input
                                    type="number"
                                    placeholder="Enter percentage"
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400"/>
                            </div>

                            {/* Master Details */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">Master Degree</label>
                                <input
                                    type="text"
                                    placeholder="Enter degree"
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400"/>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Master University</label>
                                <input
                                    type="text"
                                    placeholder="Enter university"
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400"/>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Master %</label>
                                <input
                                    type="number"
                                    placeholder="Enter percentage"
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400"/>
                            </div>

                            {/* Experience */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">Years of Experience</label>
                                <input
                                    type="number"
                                    placeholder="Enter years"
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400"/>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Previous Company Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter company"
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400"/>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Previous Company Title</label>
                                <input
                                    type="text"
                                    placeholder="Enter title"
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400"/>
                            </div>

                            {/* Reference */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    Reference <span className="text-rose-500">*</span>
                                </label>
                                <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100">
                                    <option value="" disabled selected hidden>Select Reference</option>
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
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400"/>
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">Role</label>
                                <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100">
                                    <option value="" disabled selected hidden>Select Role</option>
                                    <option value="Candidate">Candidate</option>
                                    <option value="Recruiter">Recruiter</option>
                                    <option value="HR">HR</option>
                                    <option value="Interviewer">Interviewer</option>
                                    <option value="Reviewer">Reviewer</option>
                                    <option value="Viewer">Viewer</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>

                            {/* IsActive */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">Status</label>
                                <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100">
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Submit */}
                            <div className="md:col-span-2">
                                <button
                                    type="button"
                                    className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded font-medium transition text-white">
                                    + Add User
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminAddUserResume;
