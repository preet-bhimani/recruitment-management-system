import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import CommonLoader from "../../components/CommonLoader";
import { useAuth } from "../../contexts/AuthContext";

function AddCampusDrive() {

    const { id } = useParams();
    const [submitLoading, setSubmitLoading] = useState(false);
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        joId: id,
        universityName: "",
        driveDate: "",
        isActive: true,
    })

    // Error Message
    const [errors, setErrors] = useState({
        universityName: "",
        driveDate: "",
    });

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = { ...errors };

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
            setSubmitLoading(true);
            const res = await axios.post(`https://localhost:7119/api/CampusDrive`, formData, {
                headers: { Authorization: `Bearer ${token}`, }
            })
            toast.success(res.data || "Campus Drive added successfully!");

            // Clear FormData
            setFormData({
                joId: id,
                universityName: "",
                driveDate: "",
                isActive: true
            });

            // Clear Validation Errors
            setErrors({
                universityName: "",
                driveDate: ""
            });
        }
        catch (err) {
            toast.error(err.response?.data || "Failed to add campus drive!");
        }
        finally {
            setSubmitLoading(false);
        }
    };

    return <>
        {submitLoading && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                <div className="bg-neutral-900 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                    <CommonLoader />
                </div>
            </div>
        )}

        <form
            onSubmit={handleSubmit}
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
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
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
                            ? "bg-purple-400 cursor-not-allowed"
                            : "bg-purple-600 hover:bg-purple-500"
                        }`}>
                    {submitLoading ? "Adding..." : "+ Add Campus Drive"}
                </button>
            </div>
        </form >
    </>;
}

export default AddCampusDrive;
