import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { Clock } from "lucide-react";

const AdminUpdateTechInterview = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedType, setSelectedType] = useState('technical');

    const [techData, setTechData] = useState({
        tiId: "8171H347-JAK0-31N8-WO47-29KZMN0EPL48",
        jaId: "9282H458-JAK1-42N9-WO58-30KZMN1EPL589",
        userID: "8723A287-BBB3-46C9-BD23-08DDAE2FEC35",
        joId: "8723B287-CCC3-46D9-CE23-08EEBF2GFD35",
        meetingSubject: "Tech Round 1",
        interviewEmail: "preet@gmail.com",
        interviewerName: "Paresh Tanna",
        date: "2024-09-14",
        time: "12:00",
        feedback: "Congratulation!!! You completed first round. Now prepare for next round",
        rating: 4,
        IsClear: "Pass",
        meetingLink: "www.microsoftteams.com",
        status: "Clear"
    })

    const getDuration = (type) => {
        return type === 'technical' ? 2 : 1;};

    const getDurationText = (type) => {
        const hours = getDuration(type);
        return `${hours} hour${hours > 1 ? 's' : ''}`;};

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);};

    return <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100">
        {/* Navbar */}
        <Navbar />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            <div className="flex-1 overflow-y-auto p-4">
                <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-4">Update Technical Interview Meeting</h1>
                    </div>

                {/* Meeting Form */}
                <div className="max-w-5xl mx-auto">
                    <form className="bg-neutral-900  rounded-md p-6 shadow-sm">

                        {/* Interview Type Selection */}
                        <div className="mb-6">
                            <label className="block mb-3 text-lg font-medium">
                                Meeting Type <span className="text-rose-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${selectedType === 'technical' ? 'border-purple-500 bg-purple-900/20' : 'border-neutral-600 bg-neutral-800'}`}>
                                    <input
                                        type="radio"
                                        name="meetingType"
                                        value="technical"
                                        className="mr-3"
                                        defaultChecked
                                        onChange={handleTypeChange} />
                                    <div>
                                        <div className="font-medium text-purple-400">Technical Interview</div>
                                    </div>
                                </label>
                                <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${selectedType === 'hr' ? 'border-green-500 bg-green-900/20' : 'border-neutral-600 bg-neutral-800'}`}>
                                    <input
                                        type="radio"
                                        name="meetingType"
                                        value="hr"
                                        className="mr-3"
                                        onChange={handleTypeChange} />
                                    <div>
                                        <div className="font-medium text-green-400">HR Interview</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="mb-6 p-4 bg-neutral-800 rounded-lg border border-neutral-600">
                            <div className="flex items-center">
                                <Clock className="mr-2 text-neutral-100" size={20} />
                                <span className="font-medium">Meeting Duration: </span>
                                <span className="ml-2 px-2 py-1 bg-amber-700 text-amber-100 rounded text-sm font-medium">
                                    {getDurationText(selectedType)}
                                </span>
                            </div>
                        </div>

                        {/* Meeting Details */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block mb-1 text-sm font-medium text-neutral-300">
                                    Tech Interview ID
                                </label>
                                <input
                                    type="text"
                                    defaultValue={techData.tiId}
                                    disabled
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-300 cursor-not-allowed" />
                            </div>
                            {/* Left Column */}
                            <div className="space-y-4">

                                <h3 className="text-lg font-medium text-amber-200 border-b border-neutral-600 pb-2">Meeting Information</h3>

                                {/* Meeting Subject */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Meeting Subject <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={techData.meetingSubject}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>

                                {/* Job Application ID */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Job Application ID <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={techData.jaId}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>

                                {/* User ID */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        User ID <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={techData.userID}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>

                                {/* Job Opening ID */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Job Opening ID<span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={techData.joId}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>

                                {/* Feedback */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Feedback
                                    </label>
                                    <textarea
                                        placeholder="Enter Comment"
                                        rows="4"
                                        defaultValue={techData.feedback}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 resize-none">
                                    </textarea>
                                </div>

                                {/* IsClear */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">IsClear</label>
                                    <select
                                        name="isClear"
                                        defaultValue={techData.IsClear}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100">
                                        <option value="Pass">Pass</option>
                                        <option value="Fail">Fail</option>
                                        <option value="Wait">Wait</option>
                                    </select>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-amber-200 border-b border-neutral-600 pb-2">Schedule & Interviewer</h3>

                                {/* Date */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Interview Date <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        defaultValue={techData.date}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100" />
                                </div>

                                {/* Time */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Start Time <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        defaultValue={techData.time}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100" />
                                </div>

                                {/* Interviewer Name */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Interviewer Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={techData.interviewerName}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>

                                {/* Interviewer Email */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Interviewer Email <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue={techData.interviewEmail}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>

                                {/* Meeting Link */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Meeting Link <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={techData.meetingLink}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>

                                {/* Rating */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Rating <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        max={5}
                                        min={0}
                                        defaultValue={techData.rating}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>
                                {/* Status */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Status</label>
                                    <select
                                        name="Status"
                                        defaultValue={techData.status}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100">
                                        <option value="Clear">Clear</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Hold">Hold</option>
                                        <option value="Inactive">Not Clear</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-neutral-600">
                            <button
                                type="button"
                                className="px-6 py-2 bg-purple-700 hover:bg-purple-600 rounded font-medium transition text-white flex items-center gap-2">

                                + Update {selectedType === 'technical' ? 'Technical' : 'HR'} Interview
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>;
};

export default AdminUpdateTechInterview;
