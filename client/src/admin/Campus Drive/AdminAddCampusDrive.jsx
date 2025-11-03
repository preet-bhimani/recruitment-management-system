import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import axios from "axios";
import { toast } from "react-toastify";

const AdminAddCampusDrive = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const [formData, setFormData] = useState({
        joId: "",
        universityName: "",
        driveDate: "",
        isActive: true,
    })

    // Error Message
    const [errors, setErrors] = useState({
        joId: "",
        universityName: "",
        driveDate: "",
    });

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = { ...errors };

        if (!formData.joId.trim()) {
            newErrors.joId = "Job Opening ID is required.";
            hasError = true;
        }
        else {
            newErrors.joId = "";
        }

        if (!formData.universityName.trim()) {
            newErrors.universityName = "University Name is required.";
            hasError = true;
        }
        else {
            newErrors.universityName = "";
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
            const res = await axios.post(`https://localhost:7119/api/CampusDrive`, formData)
            toast.success(res.data.message || "Campus Drive added successfully!");
        } catch (err) {
            toast.error(err.response.message || "Failed to add campus drive.");
        }
    };

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
                    <h1 className="text-4xl font-bold text-white mb-4">Add Campus Drive</h1>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-6 rounded-lg shadow-lg">

                    {/* Job Opening ID */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Job Opening ID <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Job Opening ID"
                            value={formData.joId}
                            onChange={e => setFormData({ ...formData, joId: e.target.value })}
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
                            placeholder="Enter University Name"
                            value={formData.universityName}
                            onChange={e => setFormData({ ...formData, universityName: e.target.value })}
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
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true"})}
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
                            + Add Campus Drive
                        </button>
                    </div>
                </form>
            </main>
        </div>
    </div>;
};

export default AdminAddCampusDrive;
