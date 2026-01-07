import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import CommonLoader from "../../components/CommonLoader";
import { useAuth } from "../../contexts/AuthContext";
import axiosInstance from "../../routes/axiosInstance";

const AdminUpdateCampusDrive = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { token } = useAuth();

    const [campusdrive, setCampusDrive] = useState({
        cdid: "",
        joId: "",
        universityName: "",
        driveDate: "",
        isActive: "",
    })

    // Error Message
    const [errors, setErrors] = useState({
        universityName: "",
        driveDate: "",
    });

    // Fetch Campus Drive
    const fetchCampusDrive = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`CampusDrive/${id}`)
            setCampusDrive(res.data || []);
        }
        catch (err) {
            toast.error("Failed to load campus drive data!")
        }
        finally {
            setLoading(false);
        }
    }

    // Handle Update
    const handleUpdate = async (e) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = { ...errors };

        if (!campusdrive.joId.trim()) {
            newErrors.joId = "Job Opening ID is required.";
            hasError = true;
        }
        else {
            newErrors.joId = "";
        }

        if (!campusdrive.universityName.trim()) {
            newErrors.universityName = "University Name is required.";
            hasError = true;
        }
        else {
            newErrors.universityName = "";
        }

        if (!campusdrive.driveDate.trim()) {
            newErrors.driveDate = "Drive Date is required.";
            hasError = true;
        }
        else {
            newErrors.driveDate = "";
        }

        setErrors(newErrors);
        if (hasError) return;

        // Endpoint Logic
        try {
            setSubmitLoading(true);
            const res = await axiosInstance.put(`CampusDrive/update/${id}`, campusdrive)

            toast.success(res.data.message || "Campus Drive updated successfully!");
            navigate(-1);
        }
        catch (err) {
            toast.error(err.response.data || "Failed to update campus drive!");
        }
        finally {
            setSubmitLoading(false);
        }
    };

    useEffect(() => {
        fetchCampusDrive();
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950">
                <CommonLoader />
            </div>
        );
    }

    return <div className="flex flex-col h-screen">

        {/* Navbar */}
        <Navbar />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Content Area */}
            <main className="flex-1 bg-neutral-950 text-white p-3 sm:p-6 overflow-y-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Update Campus Drive</h1>
                </div>
                {submitLoading && (
                    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                        <div className="bg-neutral-900 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                            <CommonLoader />
                        </div>
                    </div>
                )}

                {/* User Update Form */}
                <div className="max-w-6xl mx-auto">
                    <form
                        onSubmit={handleUpdate}
                        className={`grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg
                        ${submitLoading ? "pointer-events-none opacity-70" : ""}`}>

                        {/* Campus Drive ID */}
                        <div className="md:col-span-2">
                            <label className="block mb-1 text-sm font-medium text-neutral-300">
                                Campus Drive ID
                            </label>
                            <input
                                type="text"
                                value={campusdrive.cdid}
                                disabled
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-300 cursor-not-allowed" />
                        </div>

                        {/* Job Opening Id */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Job Opening Id <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                disabled
                                value={campusdrive.joId}
                                placeholder="Enter Job Opening Id"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-300 cursor-not-allowed" />
                        </div>

                        {/* University Name */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                University Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={campusdrive.universityName}
                                onChange={e => setCampusDrive({ ...campusdrive, universityName: e.target.value })}
                                placeholder="Enter University Name"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                            {errors.universityName && (<p className="text-rose-500 text-sm mt-1">{errors.universityName}</p>)}
                        </div>

                        {/* Drive Date */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-neutral-200">
                                Drive Date <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={campusdrive.driveDate}
                                onChange={e => setCampusDrive({ ...campusdrive, driveDate: e.target.value })}
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-200
                                           focus:outline-none focus:ring-2 focus:ring-sky-600"/>
                            {errors.driveDate && (<p className="text-rose-500 text-sm mt-1">{errors.driveDate}</p>)}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Status</label>
                            <select
                                value={campusdrive.isActive}
                                onChange={(e) => setCampusDrive({ ...campusdrive, isActive: e.target.value === "true" })}
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700">
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>

                        {/* Submit */}
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className={`w-full p-2 rounded font-medium transition
                                    ${submitLoading
                                        ? "bg-neutral-600 cursor-not-allowed"
                                        : "bg-purple-600 hover:bg-purple-500"
                                    }`}>
                                {submitLoading ? "Updating..." : "+ Update Campus Drive"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    </div>;
};

export default AdminUpdateCampusDrive;
