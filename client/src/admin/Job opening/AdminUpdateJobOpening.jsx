import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

const AdminUpdateJobOpening = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const [jobsData, setJobsData] = useState({
        joId: "8723B287-CCC3-46D9-CE23-08EEBF2GFD35",
        title: "Jr. Software Engineer",
        noOfOpening: 4,
        requiredSkills: "Asp.Net ReactJS",
        preferredSkills: "Git Azure",
        location: "Ahmedabad",
        experience: "1",
        description: "Bachelor s/Master s degree in Engineering, Computer Science (or equivalent experience). At least 1+ years of relevant experience as a software engineer. A minimum of 1+ years of C#, .Net Core, and SQL development experience. Excellent English communication skills",
        status: "Open"
    });

    return <div className="flex flex-col h-screen">

        {/* Navbar */}
        <Navbar />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Content Area */}
            <main className="flex-1 bg-neutral-950 text-white p-3 sm:p-6 overflow-y-auto">
                <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-400">Update Job Opening</h1>

                {/* User Update Form */}
                <div className="max-w-6xl mx-auto">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg">
                        {/* Job Opening ID */}
                        <div className="md:col-span-2">
                            <label className="block mb-1 text-sm font-medium text-neutral-300">
                                Job Opening ID
                            </label>
                            <input
                                type="text"
                                defaultValue={jobsData.joId}
                                disabled
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-300 cursor-not-allowed" />
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Title <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                defaultValue={jobsData.title}
                                placeholder="Enter Title"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* No of Opening */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                No of Opening <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="number"
                                defaultValue={jobsData.noOfOpening}
                                placeholder="Enter No of Opening"
                                min="1"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* Required Skills */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Required Skills <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                defaultValue={jobsData.requiredSkills}
                                placeholder="Enter Required Skills"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* Preferred Skills */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Preferred Skills 
                            </label>
                            <input
                                type="text"
                                defaultValue={jobsData.preferredSkills}
                                placeholder="Enter Preferred Skills"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Location <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                defaultValue={jobsData.location}
                                placeholder="Enter Location"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Experience <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="number"
                                defaultValue={jobsData.experience}
                                placeholder="Enter Experience"
                                min="0"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Description <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                            defaultValue={jobsData.description}
                                placeholder="Enter Description"
                                rows="4"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 resize-none">
                            </textarea>
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Comment 
                            </label>
                            <textarea
                            defaultValue={jobsData.comment}
                                placeholder="Enter Comment"
                                rows="4"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 resize-none">
                            </textarea>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Status</label>
                            <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700">
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                                <option value="Hold">Hold</option>
                            </select>
                        </div>

                        {/* Submit */}
                        <div className="md:col-span-2">
                            <button
                                type="button"
                                className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-medium">
                                + Update Job Opening
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>

    </div>;
};

export default AdminUpdateJobOpening;
