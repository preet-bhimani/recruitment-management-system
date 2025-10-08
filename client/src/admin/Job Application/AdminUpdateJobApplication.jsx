import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

const AdminUpdateJobApplication = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const [jobapp, setJobappData] = useState({
        jaId: "9834B398-CCC4-57D0-CE34-19EEBF3GFD46",
        userId: "8723A287-BBB3-46C9-BD23-08DDAE2FEC35",
        joId: "8723B287-CCC3-46D9-CE23-08EEBF2GFD35",
        examResult: "Pass",
        examDate: "2025-07-18",
        comment: "Your Exam Date is 16/07/2025. You will recive mail regarding id and password with exam portal link.",
        feedback: "Congratulations!!! You are now shorlisted for the interview. The other information will be shared with you soon.",
        status: "Shortlisted",
        overallStatus: "Technical interview"
    })

    return <div className="flex flex-col h-screen">

        {/* Navbar */}
        <Navbar />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Content */}
            <main className="flex-1 bg-neutral-950 text-white p-3 sm:p-6 overflow-y-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Update Job Application</h1>
                </div>
                {/* User Update Form */}
                <div className="max-w-6xl mx-auto">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg">
                        {/* Job Application ID */}
                        <div className="md:col-span-2">
                            <label className="block mb-1 text-sm font-medium text-neutral-300">
                                Job Application ID
                            </label>
                            <input
                                type="text"
                                defaultValue={jobapp.jaId}
                                disabled
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-300 cursor-not-allowed" />
                        </div>

                        {/* userId */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                UserId <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                defaultValue={jobapp.userId}
                                placeholder="Enter userId"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* Job Opening Id */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                JoId <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                defaultValue={jobapp.joId}
                                placeholder="Enter joId"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        </div>

                        {/* Exam Date */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Exam Date
                            </label>
                            <input
                                type="date"
                                name="exam date"
                                defaultValue={jobapp.examDate}
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100" />
                        </div>

                        {/* Exam Result */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Exam Result</label>
                            <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" defaultValue={jobapp.examResult}>
                                <option value="" disabled>Select Exam Result</option>
                                <option value="Pass">Pass</option>
                                <option value="Fail">Fail</option>
                            </select>
                        </div>

                        {/* Feedback */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Feedback
                            </label>
                            <textarea
                                placeholder="Enter Feedback"
                                rows="4"
                                defaultValue={jobapp.feedback}
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 resize-none">
                            </textarea>
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Comment
                            </label>
                            <textarea
                                placeholder="Enter Comment"
                                rows="4"
                                defaultValue={jobapp.comment}
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 resize-none">
                            </textarea>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Status</label>
                            <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" defaultValue={jobapp.status}>
                                <option value="" disabled>Select Status</option>
                                <option value="Applied">Applied</option>
                                <option value="Exam">Exam</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        {/* Overall Status */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Overall Status <span className="text-rose-500">*</span></label>
                            <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" defaultValue={jobapp.overallStatus}>
                                <option value="" disabled>Select Overall Status</option>
                                <option value="Applied">Applied</option>
                                <option value="Exam">Exam</option>
                                <option value="Technical interview">Technical interview</option>
                                <option value="HR interview">HR interview</option>
                                <option value="Selected">Selected</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Hold">Hold</option>
                            </select>
                        </div>

                        {/* Submit */}
                        <div className="md:col-span-2">
                            <button
                                type="button"
                                className="w-full bg-purple-600 hover:bg-purple-500 p-2 rounded font-medium">
                                + Update Job Application
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    </div>;
};

export default AdminUpdateJobApplication;
