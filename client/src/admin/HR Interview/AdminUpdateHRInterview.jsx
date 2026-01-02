import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { Clock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CommonLoader from "../../components/CommonLoader";

const AdminUpdateHRInterview = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedType, setSelectedType] = useState('hr');
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [hrData, setHRData] = useState({
        hiId: "",
        jaId: "",
        userId: "",
        joId: "",
        meetingSubject: "",
        interviewerEmail: "",
        interviewerName: "",
        hrDate: "",
        hrTime: "",
        hrFeedback: "",
        hrRating: null,
        hrIsClear: "",
        meetingLink: "",
        hrStatus: ""
    })

    // Errors
    const [errors, setErrors] = useState({
        meetingSubject: "",
        hrDate: "",
        hrTime: "",
        interviewerName: "",
        interviewerEmail: "",
    })

    // Fetch HR Interview Data
    const fetchHrIn = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`https://localhost:7119/api/HRInterview/${id}`);
            setHRData(res.data || []);
        }
        catch (err) {
            toast.error("Error fetching data!");
        }
        finally {
            setLoading(false)
        }
    }

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

    // Handle Meeting Submission
    const handleHrinUpdate = async (e) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = { ...errors };

        // Validate Meeting Subject
        if (!hrData.meetingSubject.trim()) {
            newErrors.meetingSubject = "Meeting Subject is required";
            hasError = true;
        }
        else {
            newErrors.meetingSubject = "";
        }

        // Validate Tech Date
        if (!hrData.hrDate.trim()) {
            newErrors.hrDate = "HR Date is required";
            hasError = true;
        }
        else {
            newErrors.hrDate = "";
        }

        // Validate Tech Time
        if (!hrData.hrTime.trim()) {
            newErrors.hrTime = "HR Time is required";
            hasError = true;
        }
        else {
            newErrors.hrTime = "";
        }

        // Validate Interviewer Email
        if (!hrData.interviewerEmail.trim()) {
            newErrors.interviewerEmail = "Interview Email is required";
            hasError = true;
        }
        else {
            newErrors.interviewerEmail = "";
        }

        // Validate Interviewer Name
        if (!hrData.interviewerName.trim()) {
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
            setSubmitLoading(true);
            const payload = {
                JOId: hrData.joId,
                JAId: hrData.jaId,
                UserId: hrData.userId,
                MeetingSubject: hrData.meetingSubject,
                HRDate: hrData.hrDate,
                HRTime: hrData.hrTime,
                DurationMinutes: 60,
                InterviewerName: hrData.interviewerName,
                InterviewerEmail: hrData.interviewerEmail,
                HRStatus: hrData.hrStatus,
                HRIsClear: hrData.hrIsClear,
                HRFeedback: hrData.hrFeedback,
                HRRating: hrData.hrRating,
            };
            const res = await axios.put(`https://localhost:7119/api/HRInterview/update/${id}`,
                payload, { headers: { "Content-Type": "application/json" } });
            toast.success(res.data || "HR interview updated successfully!");
            navigate(-1);
        }
        catch (err) {
            toast.error(err.response.data || "Something went wrong");
        }
        finally {
            setSubmitLoading(false);
        }
    }

    useEffect(() => {
        fetchHrIn();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950">
                <CommonLoader />
            </div>
        );
    }

    return <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100">
        {/* Navbar */}
        <Navbar />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            <div className="flex-1 overflow-y-auto p-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Update HR Interview</h1>
                </div>
                {submitLoading && (
                    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                        <div className="bg-neutral-900 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                            <CommonLoader />
                            <span className="text-neutral-200 text-sm">
                                Updating HR Interview
                            </span>
                        </div>
                    </div>
                )}

                {/* Meeting Form */}
                <div className="max-w-5xl mx-auto">
                    <form
                        onSubmit={handleHrinUpdate}
                        className={`bg-neutral-900 rounded-md p-6 shadow-sm
                            ${submitLoading ? "pointer-events-none opacity-70" : ""}`}>

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
                                        disabled
                                        onChange={handleTypeChange} />
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
                                        defaultChecked
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
                                <span className="ml-2 px-2 py-1 bg-purple-700 text-purple-100 rounded text-sm font-medium">
                                    {getDurationText(selectedType)}
                                </span>
                            </div>
                        </div>

                        {/* Meeting Details */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block mb-1 text-sm font-medium text-neutral-300">
                                    HR Interview ID
                                </label>
                                <input
                                    type="text"
                                    value={hrData.hiId}
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
                                        value={hrData.meetingSubject}
                                        onChange={(e) => setHRData({ ...hrData, meetingSubject: e.target.value })}
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
                                        value={hrData.jaId}
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
                                        value={hrData.userId}
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
                                        value={hrData.joId}
                                        disabled
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>

                                {/* hrFeedback */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        hrFeedback
                                    </label>
                                    <textarea
                                        placeholder="Enter Comment"
                                        rows="4"
                                        value={hrData.hrFeedback}
                                        onChange={(e) => setHRData({ ...hrData, hrFeedback: e.target.value })}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 resize-none">
                                    </textarea>
                                </div>

                                {/* hrIsClear */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">hrIsClear</label>
                                    <select
                                        name="hrIsClear"
                                        value={hrData.hrIsClear}
                                        onChange={(e) => setHRData({ ...hrData, hrIsClear: e.target.value })}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100">
                                        <option value="Pending">Pending</option>
                                        <option value="Clear">Clear</option>
                                        <option value="Not Clear">Not Clear</option>
                                        <option value="In Progress">In Progress</option>
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
                                        value={hrData.hrDate}
                                        onChange={(e) => setHRData({ ...hrData, hrDate: e.target.value })}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100" />
                                    {errors.hrDate && (<p className="text-rose-500 text-sm mt-1">{errors.hrDate}</p>)}
                                </div>

                                {/* Time */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Start Time <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={hrData.hrTime}
                                        onChange={(e) => setHRData({ ...hrData, hrTime: e.target.value })}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100" />
                                    {errors.hrTime && (<p className="text-rose-500 text-sm mt-1">{errors.hrTime}</p>)}
                                </div>

                                {/* Interviewer Name */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        Interviewer Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={hrData.interviewerName}
                                        onChange={(e) => setHRData({ ...hrData, interviewerName: e.target.value })}
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
                                        value={hrData.interviewerEmail}
                                        onChange={(e) => setHRData({ ...hrData, interviewerEmail: e.target.value })}
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
                                        value={hrData.meetingLink}
                                        disabled
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>

                                {/* HRRating */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">
                                        hrRating <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        max={5}
                                        min={1}
                                        value={hrData.hrRating}
                                        onChange={(e) => setHRData({ ...hrData, hrRating: parseInt(e.target.value) })}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                                </div>

                                {/* HRStatus */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium">hrStatus</label>
                                    <select
                                        name="hrStatus"
                                        value={hrData.hrStatus}
                                        onChange={(e) => setHRData({ ...hrData, hrStatus: e.target.value })}
                                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100">
                                        <option value="Clear">Clear</option>
                                        <option value="In Progress" disabled>In Progress</option>
                                        <option value="Hold">Hold</option>
                                        <option value="Not Clear" disabled>Not Clear</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-neutral-600">
                            <button
                                type="submit"
                                disabled={submitLoading}
                                className={`px-6 py-2 rounded font-medium transition text-white flex items-center gap-2
                                    ${submitLoading
                                        ? "bg-neutral-600 cursor-not-allowed"
                                        : "bg-purple-700 hover:bg-purple-600"
                                    }`}>
                                {submitLoading ? "Updating..." : "+ Update HR Interview "}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>;
};

export default AdminUpdateHRInterview;
