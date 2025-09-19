import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { Clock } from "lucide-react";

const AdminMeetingSchedual = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedType, setSelectedType] = useState('technical');

    const getDuration = (type) => {
        return type === 'technical' ? 2 : 1; 
    };

    const getDurationText = (type) => {
        const hours = getDuration(type);
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
    };

    return <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100">
        {/* Navbar */}
        <Navbar />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            <div className="flex-1 overflow-y-auto p-4">
                <h1 className="text-2xl font-semibold mb-4 text-blue-400">Auto Generate Meeting</h1>

                {/* Meeting Form */}
                <div className="max-w-5xl mx-auto">
                    <form className="bg-neutral-900  rounded-md p-6 shadow-sm">

                        {/* Interview Type Selection */}
                        <div className="mb-6">
                            <label className="block mb-3 text-lg font-medium">
                                Meeting Type <span className="text-rose-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${selectedType === 'technical' ? 'border-blue-500 bg-blue-900/20' : 'border-neutral-600 bg-neutral-800'}`}>
                                    <input
                                        type="radio"
                                        name="meetingType"
                                        value="technical"
                                        className="mr-3"
                                        defaultChecked
                                        onChange={handleTypeChange}/>
                                    <div>
                                        <div className="font-medium text-blue-400">Technical Interview</div>
                                    </div>
                                </label>
                                <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${selectedType === 'hr' ? 'border-green-500 bg-green-900/20' : 'border-neutral-600 bg-neutral-800'}`}>
                                    <input
                                        type="radio"
                                        name="meetingType"
                                        value="hr"
                                        className="mr-3"
                                        onChange={handleTypeChange}/>
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
                                        name="meetingSubject"
                                        placeholder="Enter Meeting Subject"
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400"/>
                                </div>

                                {/* Job Application ID */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Job Application ID <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="jaid"
                                        placeholder="Enter JAID"
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400"/>
                                </div>

                                {/* User ID */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        User ID <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="userID"
                                        placeholder="Enter User ID"
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>

                                {/* Job Opening ID */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Job Opening ID<span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="joid"
                                        placeholder="Enter JOID"
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
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
                                        name="date"
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100" />
                                </div>

                                {/* Time */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Start Time <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100" />
                                </div>

                                {/* Interviewer Name */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Interviewer Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="interviewerName"
                                        placeholder="Enter Interviewer's name"
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>

                                {/* Interviewer Email */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Interviewer Email <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="interviewerEmail"
                                        placeholder="Enter Interviewer's email"
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-neutral-600">
                            <button
                                type="button"
                                className="px-6 py-2 bg-sky-700 hover:bg-sky-600 rounded font-medium transition text-white flex items-center gap-2">
                                
                                + ADD {selectedType === 'technical' ? 'Technical' : 'HR'} Meeting
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>;
};

export default AdminMeetingSchedual;
