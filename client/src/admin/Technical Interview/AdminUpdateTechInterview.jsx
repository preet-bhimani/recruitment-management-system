import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { Clock } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminUpdateTechInterview = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedType, setSelectedType] = useState('technical');
    const { id } = useParams();
    const navigate = useNavigate();

    const [techData, setTechData] = useState({
        tiId: "",
        jaId: "",
        userId: "",
        joId: "",
        meetingSubject: "",
        interviewerEmail: "",
        interviewerName: "",
        techDate: "",
        techTime: "",
        techFeedback: "",
        techRating: null,
        techIsClear: "",
        meetingLink: "",
        techStatus: ""
    })

    // Errors
    const [errors, setErrors] = useState({
        meetingSubject: "",
        techDate: "",
        techTime: "",
        interviewerName: "",
        interviewerEmail: "",
    })

    // Fetch Technical Interview Data
    const fetchTechin = async () => {
        try {
            const res = await axios.get(`https://localhost:7119/api/TechnicalInterview/${id}`);
            setTechData(res.data || []);
        } catch (err) {
            toast.error("Error fetching data!");
        }
    }

    const getDuration = (type) => {
        return type === 'technical' ? 2 : 1;
    };

    const getDurationText = (type) => {
        const hours = getDuration(type);
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    };

    // Handle Meeting Submission
    const handleTechinUpdate = async (e) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = { ...errors };

        // Validate Meeting Subject
        if (!techData.meetingSubject.trim()) {
            newErrors.meetingSubject = "Meeting Subject is required";
            hasError = true;
        }
        else {
            newErrors.meetingSubject = "";
        }

        // Validate Tech Date
        if (!techData.techDate.trim()) {
            newErrors.techDate = "Technical Date is required";
            hasError = true;
        }
        else {
            newErrors.techDate = "";
        }

        // Validate Tech Time
        if (!techData.techTime.trim()) {
            newErrors.techTime = "Technical Time is required";
            hasError = true;
        }
        else {
            newErrors.techTime = "";
        }

        // Validate Interviewer Email
        if (!techData.interviewerEmail.trim()) {
            newErrors.interviewerEmail = "Interview Email is required";
            hasError = true;
        }
        else {
            newErrors.interviewerEmail = "";
        }

        // Validate Interviewer Name
        if (!techData.interviewerName.trim()) {
            newErrors.interviewerName = "interviewer Name is required";
            hasError = true;
        }
        else {
            newErrors.interviewerName = "";
        }

        setErrors(newErrors);
        if (hasError) return;

        // Create Playload as It has to be in JSON Format
        try {
            const payload = {
                JOId: techData.joId,
                JAId: techData.jaId,
                UserId: techData.userId,
                MeetingSubject: techData.meetingSubject,
                TechDate: techData.techDate,
                TechTime: techData.techTime,
                DurationMinutes: selectedType === "technical" ? 120 : 60,
                InterviewerName: techData.interviewerName,
                InterviewerEmail: techData.interviewerEmail,
                TechStatus: techData.techStatus,
                TechIsClear: techData.techIsClear,
                TechFeedback: techData.techFeedback,
                TechRating: techData.techRating,
            };
            const res = await axios.put(`https://localhost:7119/api/TechnicalInterview/update/${id}`, 
                payload, { headers: { "Content-Type": "application/json" } });
            toast.success(res.data.message || "Technical interview updated successfully!");
            navigate(-1);
        }
        catch (err) {
            toast.error(err.response.data || "Something went wrong");
        }
    }

    useEffect(() => {
        fetchTechin();
    }, [])

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
                                        checked={selectedType === "technical"}
                                        onChange={() => setSelectedType("technical")} />
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
                                        checked={selectedType === "hr"}
                                        onChange={() => setSelectedType("hr")} />
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
                                    value={techData.tiId}
                                    disabled
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-300 cursor-not-allowed" />
                            </div>
                            {/* Left Column */}
                            <div className="space-y-4">

                                <h3 className="text-lg font-medium text-purple-500 border-b border-neutral-600 pb-2">Meeting Information</h3>

                                {/* Meeting Subject */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Meeting Subject <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={techData.meetingSubject}
                                        onChange={(e) => setTechData({ ...techData, meetingSubject: e.target.value })}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                    {errors.meetingSubject && (<p className="text-rose-500 text-sm mt-1">{errors.meetingSubject}</p>)}
                                </div>

                                {/* Job Application ID */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Job Application ID <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={techData.jaId}
                                        disabled
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>

                                {/* User ID */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        User ID <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={techData.userId}
                                        disabled
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>

                                {/* Job Opening ID */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Job Opening ID<span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={techData.joId}
                                        disabled
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>

                                {/* techFeedback */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        techFeedback
                                    </label>
                                    <textarea
                                        placeholder="Enter Comment"
                                        rows="4"
                                        value={techData.techFeedback}
                                        onChange={(e) => setTechData({ ...techData, techFeedback: e.target.value })}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 resize-none">
                                    </textarea>
                                </div>

                                {/* techIsClear */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">techIsClear</label>
                                    <select
                                        name="techIsClear"
                                        value={techData.techIsClear}
                                        onChange={(e) => setTechData({ ...techData, techIsClear: e.target.value })}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100">
                                        <option value="Clear">Clear</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Not Clear">Not Clear</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-purple-500 border-b border-neutral-600 pb-2">Schedule & Interviewer</h3>

                                {/* Date */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Interview Date <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={techData.techDate}
                                        onChange={(e) => setTechData({ ...techData, techDate: e.target.value })}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100" />
                                    {errors.techDate && (<p className="text-rose-500 text-sm mt-1">{errors.techDate}</p>)}
                                </div>

                                {/* Time */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Start Time <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={techData.techTime}
                                        onChange={(e) => setTechData({ ...techData, techTime: e.target.value })}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100" />
                                    {errors.techTime && (<p className="text-rose-500 text-sm mt-1">{errors.techTime}</p>)}
                                </div>

                                {/* Interviewer Name */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Interviewer Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={techData.interviewerName}
                                        onChange={(e) => setTechData({ ...techData, interviewerName: e.target.value })}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                    {errors.interviewerName && (<p className="text-rose-500 text-sm mt-1">{errors.interviewerName}</p>)}
                                </div>

                                {/* Interviewer Email */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Interviewer Email <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={techData.interviewerEmail}
                                        onChange={(e) => setTechData({ ...techData, interviewerEmail: e.target.value })}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                    {errors.interviewerEmail && (<p className="text-rose-500 text-sm mt-1">{errors.interviewerEmail}</p>)}
                                </div>

                                {/* Meeting Link */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Meeting Link <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={techData.meetingLink}
                                        disabled
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>

                                {/* Rating */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Rating <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        onChange={(e) => setTechData({ ...techData, techRating: e.target.value })}
                                        max={5}
                                        min={0}
                                        value={techData.techRating}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>

                                {/* techStatus */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">techStatus</label>
                                    <select
                                        name="techStatus"
                                        value={techData.techStatus}
                                        onChange={(e) => setTechData({ ...techData, techStatus: e.target.value })}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100">
                                        <option value="Clear">Clear</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Not Clear">Not Clear</option>
                                        <option value="Hold">Hold</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-neutral-600">
                            <button
                                type="button"
                                onClick={handleTechinUpdate}
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
