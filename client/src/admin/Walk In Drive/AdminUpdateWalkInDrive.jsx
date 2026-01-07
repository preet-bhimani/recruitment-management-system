import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import CommonLoader from "../../components/CommonLoader";
import axiosInstance from "../../routes/axiosInstance";

function AdminUpdateWalkInDrive() {

    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [formData, setFormData] = useState({
        joId: "",
        location: "",
        driveDate: "",
        isActive: true,
    })

    // Error Message
    const [errors, setErrors] = useState({
        location: "",
        driveDate: "",
    });

    // Fetch Walk In Drive Data By ID
    const fetchWalkInDriveByID = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`WalkInDrive/${id}`)
            setFormData(res.data || []);
        }
        catch {
            toast.error("Failed to load walk in drive data!");
        }
        finally {
            setLoading(false);
        }
    };

    // Handle Update
    const handleUpdate = async (e) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = { ...errors };

        if (!formData.location.trim()) {
            newErrors.location = "Location is required.";
            hasError = true;
        }
        else {
            newErrors.location = "";
        }

        if (!formData.driveDate.trim()) {
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
            const res = await axiosInstance.put(`WalkInDrive/update/${id}`, formData)
            navigate(-1);
            toast.success(res.data || "Walk In Drive updated successfully!");
        }
        catch (err) {
            toast.error(err.response?.data || "Failed to update walk in drive!");
        }
        finally {
            setSubmitLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchWalkInDriveByID();
        }
    }, [token]);

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
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Page Content */}
            <main className="flex-1 bg-neutral-950 text-white p-6 overflow-y-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Update Walk In Drive</h1>
                </div>

                {submitLoading && (
                    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                        <div className="bg-neutral-900 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                            <CommonLoader />
                            <span className="text-neutral-200 text-sm">
                                Updating Walk In Drive
                            </span>
                        </div>
                    </div>
                )}

                <form
                    onSubmit={handleUpdate}
                    className={`grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg
                        ${submitLoading ? "pointer-events-none opacity-70" : ""}`}>

                    {/* Job Opening ID */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Job Opening ID <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            disabled
                            placeholder="Enter Job Opening ID"
                            value={formData.joId}
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 cursor-not-allowed" />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Location <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Location"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        {errors.location && (<p className="text-rose-500 text-sm mt-1">{errors.location}</p>)}
                    </div>

                    {/* Drive Date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-neutral-200">
                            Drive Date <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={formData.driveDate}
                            onChange={e => setFormData({ ...formData, driveDate: e.target.value })}
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-200
                                    focus:outline-none focus:ring-2 focus:ring-sky-600"/>
                        {errors.driveDate && (<p className="text-rose-500 text-sm mt-1">{errors.driveDate}</p>)}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Status</label>
                        <select
                            value={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700">
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={submitLoading}
                            className={`w-full p-2 rounded font-medium transition
                                ${submitLoading
                                    ? "bg-neutral-600 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-500"
                                }`}>
                            {submitLoading ? "Updating..." : "+ Update Walk In Drive "}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    </div >;
}

export default AdminUpdateWalkInDrive;
