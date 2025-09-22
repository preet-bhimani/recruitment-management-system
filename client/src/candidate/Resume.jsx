import React from "react";
import CommonNavbar from "../components/CommonNavbar";
import { Upload, FileText } from "lucide-react";

const Resume = () => {
    return <div className="flex flex-col h-screen">
        {/* Navbar */}
        < CommonNavbar isLoggedIn role="Candidates" />

        <div className="flex flex-1 overflow-hidden">
            
            {/* Main Layout */}
            <main className="flex-1 bg-neutral-950 text-white p-3 sm:p-6 overflow-y-auto">
                <h1 className="text-xl text-center sm:text-2xl font-bold mb-4 sm:mb-6 text-white-700">Upload Resume</h1>

                {/* Resume Upload */}
                <div className="max-w-xl mx-auto mb-6">
                    <div className="bg-neutral-900 p-4 rounded-lg shadow-md">
                        <div className="text-center">
                            <FileText className="mx-auto mb-2 text-neutral-400" size={32} />
                            <h2 className="text-lg font-semibold mb-2">Upload Resume</h2>
                            <p className="text-neutral-400 mb-4 text-sm">
                                Upload resume file to auto-fill your details
                            </p>

                            {/* File Upload */}
                            <div className="border-2 border-dashed border-neutral-600 rounded-lg p-4 mb-3 hover:border-neutral-500 transition">
                                <input
                                    id="resume-upload"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="hidden" />
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
                            <button className="px-4 py-2 rounded-lg font-medium bg-purple-700 hover:bg-purple-800 text-white transition text-sm">
                                Process Resume
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-6xl mx-auto">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg">
   
                        {/* Skills */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Skills</label>
                            <input
                                type="text"
                                placeholder="e.g., React, Java"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                        </div>

                        {/* Bachelor Details */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Bachelor Degree</label>
                            <input
                                type="text"
                                placeholder="Enter degree"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Bachelor University</label>
                            <input
                                type="text"
                                placeholder="Enter university"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Bachelor %</label>
                            <input
                                type="number"
                                placeholder="Enter percentage"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                        </div>

                        {/* Master Details */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Master Degree</label>
                            <input
                                type="text"
                                placeholder="Enter degree"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Master University</label>
                            <input
                                type="text"
                                placeholder="Enter university"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Master %</label>
                            <input
                                type="number"
                                placeholder="Enter percentage"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Years of Experience</label>
                            <input
                                type="number"
                                placeholder="Enter years"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Previous Company Name</label>
                            <input
                                type="text"
                                placeholder="Enter company"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Previous Company Title</label>
                            <input
                                type="text"
                                placeholder="Enter title"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                        </div>
                       
                        {/* Submit */}
                        <div className="md:col-span-2">
                            <button
                                type="button"
                                className="w-full bg-purple-700 hover:bg-purple-800 p-3 rounded font-medium transition text-white">
                                + Add Details
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    </div>
};

export default Resume;
