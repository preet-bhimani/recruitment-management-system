import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";

const AdminUpdateCampusDrive = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    const [campusdrive, setCampusDrive] = useState({
        cdid: "",
        joId: "",
        universityName: "",
        driveDate: "",
        isActive: "",
    })

    // Error Message
    const [errors, setErrors] = useState({
        joId: "",
        universityName: "",
        driveDate: "",
    });

    // Fetch Campus Drive
    const fetchCampusDrive = async () => {
        try {
            const res = await axios.get(`https://localhost:7119/api/CampusDrive/${id}`)
            setCampusDrive(res.data || []);
        }
        catch (err) {
            toast.error("Failed to load campus drive data!")
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
            const res = await axios.put(`https://localhost:7119/api/CampusDrive/update/${id}`, campusdrive)

            toast.success(res.data.message || "Campus Drive updated successfully!");
            navigate(-1);
        } catch (err) {
            toast.error(err.response.data || "Failed to update campus drive.");
        }
    };

    useEffect(() => {
        fetchCampusDrive();
    }, [])

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

                {/* User Update Form */}
                <div className="max-w-6xl mx-auto">
                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg">

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
                                value={campusdrive.joId}
                                onChange={e => setCampusDrive({ ...campusdrive, joId: e.target.value })}
                                placeholder="Enter Job Opening Id"
                                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                            {errors.joId && (<p className="text-rose-500 text-sm mt-1">{errors.joId}</p>)}
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
                                className="w-full bg-purple-600 hover:bg-purple-500 p-2 rounded font-medium">
                                + Update Campus Drive
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    </div>;
};

export default AdminUpdateCampusDrive;
