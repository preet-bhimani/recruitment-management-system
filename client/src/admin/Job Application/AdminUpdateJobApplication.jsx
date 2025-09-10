import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../Sidebar";
const AdminUpdateJobApplication = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const [jobapp, setJobappData] = useState({
        jaId: "9834B398-CCC4-57D0-CE34-19EEBF3GFD46",
        userId: "8723A287-BBB3-46C9-BD23-08DDAE2FEC35",
        joId: "8723B287-CCC3-46D9-CE23-08EEBF2GFD35",
        testResult: "Pass",
        comment: "Congratulations!!! You are now shorlisted for the next round of interview. The other information will be shared with you soon."
    })

    return <div className="flex flex-col h-screen">

        {/* Navbar */}
        <Navbar />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Content Area */}
            <main className="flex-1 bg-neutral-950 text-white p-3 sm:p-6 overflow-y-auto">
                <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-400">Update Job Application</h1>

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

                        {/* joId */}
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

                        {/* Test Result */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Test Result</label>
                            <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" defaultValue={jobapp.testResult}>
                                <option value="" disabled>Select Test Result</option>
                                <option value="Pass">Pass</option>
                                <option value="Fail">Fail</option>
                                <option value="Wait">Wait</option>
                            </select>
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

                        {/* Submit */}
                        <div className="md:col-span-2">
                            <button
                                type="button"
                                className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-medium">
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
