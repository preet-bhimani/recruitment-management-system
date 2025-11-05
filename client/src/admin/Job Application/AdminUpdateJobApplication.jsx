import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-toastify";

const AdminUpdateJobApplication = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    const [jobapp, setJobappData] = useState({
        jaId: "",
        userId: "",
        joId: "",
        examResult: "",
        examDate: null,
        feedback: "",
        status: "",
    })

    // Error Set
    const [errors, setErrors] = useState({
        status: "",
    });

    // Fetch Job Application
    const fetchJobApplication = async () => {
        try {
            const res = await axios.get(`https://localhost:7119/api/JobApplication/${id}`)
            setJobappData(res.data || []);
        }
        catch (err) {
            toast.error("Error to fetch data!")
        }
    }

    // Handle Update
    const handleUpdate = async (e) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = { ...errors };

        if (!jobapp.status.trim()) {
            newErrors.status = "Status cannot be empty.";
            hasError = true;
        }
        else {
            newErrors.status = "";
        }

        setErrors(newErrors);
        if (hasError) return;

        // Endpoint Logic
        try {
            const res = await axios.put(`https://localhost:7119/api/JobApplication/update/${id}`, jobapp);
            toast.success(res.data.message || "Job application submitted successfully!");
            navigate(-1);

        } 
        catch (err) {
            console.log(err)
            toast.error(err.response.data || "Failed to submit job application!");
        }
    }

    useEffect(() => {
        fetchJobApplication();
    }, [])

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
                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg">
                        {/* Job Application ID */}
                        <div className="md:col-span-2">
                            <label className="block mb-1 text-sm font-medium text-neutral-300">
                                Job Application ID
                            </label>
                            <input
                                type="text"
                                value={jobapp.jaId}
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
                                value={jobapp.userId}
                                disabled
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
                                value={jobapp.joId}
                                disabled
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
                                name="examDate"
                                value={jobapp.examDate}
                                onChange={(e) => setJobappData({ ...jobapp, examDate: e.target.value })}
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100" />
                        </div>

                        {/* Exam Result */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Exam Result</label>
                            <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" 
                            value={jobapp.examResult}
                            onChange={(e) => setJobappData({ ...jobapp, examResult: e.target.value })}>
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
                                value={jobapp.feedback}
                                onChange={(e) => setJobappData({ ...jobapp, feedback: e.target.value })}
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 resize-none">
                            </textarea>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Status <span className="text-rose-500">*</span></label>
                            <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" 
                            value={jobapp.status}
                            onChange={(e) => setJobappData({ ...jobapp, status: e.target.value })}>
                                <option value="" disabled>Select Status</option>
                                <option value="Applied">Applied</option>
                                <option value="Exam">Exam</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Hold">Hold</option>
                            </select>
                        {errors.status && (<p className="text-rose-500 text-sm mt-1">{errors.status}</p>)}
                        </div>

                        {/* Submit */}
                        <div className="md:col-span-2">
                            <button
                                type="submit"
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
