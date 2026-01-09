import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import CommonLoader from "../../components/CommonLoader";
import axiosInstance from "../../routes/axiosInstance";

const InterviewScheduling = ({ role = "admin" }) => {

    const navigate = useNavigate();

    const location = useLocation();
    const data = location.state;
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState(() => {
        if (location.state?.overallStatus === "HR Interview") return "hr";
        return "technical";
    });

    // Form Data for Meeting 
    const [formData, setFormData] = useState({
        meetingSubject: "",
        joId: "",
        jaId: "",
        userId: "",
        techDate: "",
        techTime: "",
        hrDate: "",
        hrTime: "",
        interviewerName: "",
        interviewerEmail: "",
    });

    // Errors
    const [errors, setErrors] = useState({
        meetingSubject: "",
        joId: "",
        jaId: "",
        userId: "",
        techDate: "",
        techTime: "",
        hrTime: "",
        hrDate: "",
        interviewerName: "",
        interviewerEmail: "",
    })

    const getDuration = (type) => {
        return type === 'technical' ? 2 : 1;
    };

    const getDurationText = (type) => {
        const hours = getDuration(type);
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    };

    // Handle Meeting Submission
    const handleMeeting = async (e) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = { ...errors };

        // Validate Meeting Subject
        if (!formData.meetingSubject.trim()) {
            newErrors.meetingSubject = "Meeting Subject is required";
            hasError = true;
        }
        else {
            newErrors.meetingSubject = "";
        }

        // Validate Job Application ID
        if (!formData.jaId.trim()) {
            newErrors.jaId = "Job Application ID is required";
            hasError = true;
        }
        else {
            newErrors.jaId = "";
        }

        // Validate User ID
        if (!formData.userId.trim()) {
            newErrors.userId = "User ID is required";
            hasError = true;
        }
        else {
            newErrors.userId = "";
        }

        // Validate Job Opening ID
        if (!formData.joId.trim()) {
            newErrors.joId = "Job Opening ID is required";
            hasError = true;
        }
        else {
            newErrors.joId = "";
        }

        // Validate Date
        if (selectedType === "technical" && !formData.techDate.trim()) {
            newErrors.hrDate = "Technical Date is required";
            hasError = true;
        }
        else if (selectedType === "hr" && !formData.hrDate.trim()) {
            newErrors.hrDate = "HR Date is required";
            hasError = true;
        }
        else {
            newErrors.techDate = "";
            newErrors.hrDate = "";
        }

        // Validate Time
        if (selectedType === "technical" && !formData.techTime.trim()) {
            newErrors.hrTime = "Technical Time is required";
            hasError = true;
        }
        else if (selectedType === "hr" && !formData.hrTime.trim()) {
            newErrors.hrTime = "HR Time is required";
            hasError = true;
        }
        else {
            newErrors.techTime = "";
            newErrors.hrTime = "";
        }

        // Validate Interviewer Email
        if (!formData.interviewerEmail.trim()) {
            newErrors.interviewerEmail = "Interview Email is required";
            hasError = true;
        }
        else {
            newErrors.interviewerEmail = "";
        }

        // Validate Interviewer Name
        if (!formData.interviewerName.trim()) {
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
            setLoading(true);
            const payload = selectedType === "technical"
                ? {
                    JOId: formData.joId,
                    JAId: formData.jaId,
                    UserId: formData.userId,
                    MeetingSubject: formData.meetingSubject,
                    TechDate: formData.techDate,
                    TechTime: formData.techTime,
                    DurationMinutes: 120,
                    InterviewerName: formData.interviewerName,
                    InterviewerEmail: formData.interviewerEmail
                }
                : {
                    JOId: formData.joId,
                    JAId: formData.jaId,
                    UserId: formData.userId,
                    MeetingSubject: formData.meetingSubject,
                    HRDate: formData.hrDate,
                    HRTime: formData.hrTime,
                    DurationMinutes: 60,
                    InterviewerName: formData.interviewerName,
                    InterviewerEmail: formData.interviewerEmail
                };

            const res = await axiosInstance.post(selectedType === "technical" ? `TechnicalInterview/schedule` : `HRInterview/schedule`, payload)

            toast.success(res.data.message || "Technical interview scheduled successfully!");
            navigate(-1);
        }
        catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }
        finally {
            setLoading(false);
        }
    }

    // Set Formdata from Location State
    useEffect(() => {
        if (data) {
            setFormData(prev => ({
                ...prev,
                joId: data.joId,
                jaId: data.jaId,
                userId: data.userId,
            }));

            if (data.overallStatus === "Technical Interview") {
                setSelectedType("technical");
            }
            else if (data.overallStatus === "HR Interview") {
                setSelectedType("hr");
            }
        }
    }, [data]);

    return <>
        {loading && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                <div className="bg-neutral-900 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                    <CommonLoader />
                    <span className="text-neutral-200 text-sm">
                        Scheduling interview & sending emails
                    </span>
                </div>
            </div>
        )}

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
                            disabled
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
                            disabled
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
                            value={formData.meetingSubject}
                            onChange={(e) => setFormData({ ...formData, meetingSubject: e.target.value })}
                            placeholder="Enter Meeting Subject"
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
                            name="jaId"
                            value={formData.jaId}
                            readOnly
                            placeholder="Enter JAID"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                        {errors.jaId && (<p className="text-rose-500 text-sm mt-1">{errors.jaId}</p>)}
                    </div>

                    {/* User ID */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            User ID <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="userID"
                            value={formData.userId}
                            readOnly
                            placeholder="Enter User ID"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                        {errors.userId && (<p className="text-rose-500 text-sm mt-1">{errors.userId}</p>)}
                    </div>

                    {/* Job Opening ID */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Job Opening ID<span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="joId"
                            value={formData.joId}
                            readOnly
                            placeholder="Enter JOID"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                        {errors.joId && (<p className="text-rose-500 text-sm mt-1">{errors.joId}</p>)}
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
                            name="techDate"
                            value={selectedType === "technical" ? formData.techDate : formData.hrDate || ""}
                            onChange={(e) =>
                                selectedType === "technical"
                                    ? setFormData({ ...formData, techDate: e.target.value })
                                    : setFormData({ ...formData, hrDate: e.target.value })
                            }
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
                            name="techTime"
                            value={selectedType === "technical" ? formData.techTime : formData.hrTime || ""}
                            onChange={(e) =>
                                selectedType === "technical"
                                    ? setFormData({ ...formData, techTime: e.target.value })
                                    : setFormData({ ...formData, hrTime: e.target.value })
                            }
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
                            name="interviewerName"
                            value={formData.interviewerName}
                            onChange={(e) => setFormData({ ...formData, interviewerName: e.target.value })}
                            placeholder="Enter Interviewer's name"
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
                            name="interviewerEmail"
                            value={formData.interviewerEmail}
                            onChange={(e) => setFormData({ ...formData, interviewerEmail: e.target.value })}
                            placeholder="Enter Interviewer's email"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-400" />
                        {errors.interviewerEmail && (<p className="text-rose-500 text-sm mt-1">{errors.interviewerEmail}</p>)}
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-neutral-600">
                <button
                    type="button"
                    onClick={handleMeeting}
                    disabled={loading}
                    className={`px-6 py-2 rounded font-medium transition text-white flex items-center gap-2
                    ${loading ? "bg-neutral-600 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-600"}`}>
                    {loading
                        ? "Scheduling meeting..."
                        : `+ ADD ${selectedType === 'technical' ? 'Technical' : 'HR'} Meeting`
                    }
                </button>
            </div>
        </form>
    </>
};

export default InterviewScheduling;
