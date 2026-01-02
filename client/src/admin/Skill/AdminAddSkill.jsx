import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import CommonLoader from "../../components/CommonLoader";

const AdminAddSkill = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Skill Form Data
    const [formData, setFormData] = useState({
        skillName: "",
    });

    // Error Message
    const [errors, setErrors] = useState({
        skillName: "",
    });

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = { ...errors };

        // Validate Skill Name
        if (!formData.skillName.trim()) {
            newErrors.skillName = "Please enter a valid skill name";
            hasError = true;
        }
        else {
            newErrors.skillName = "";
        }

        setErrors(newErrors);
        if (hasError) return;

        // Fetch Data if No Errors Found
        try {
            setSubmitLoading(true);
            const res = await axios.post(`https://localhost:7119/api/Skill`, {
                skillName: formData.skillName.trim(),
            });

            toast.success(res.data || "Skill added successfully");
            setFormData({ skillName: "" });
        }
        catch (err) {
            toast.error(err.response?.data || "Failed to add skill");
        }
        finally {
            setSubmitLoading(false);
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
                    <h1 className="text-4xl font-bold text-white mb-4">Add Skill</h1>
                </div>

                {submitLoading && (
                    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                        <div className="bg-neutral-900 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                            <CommonLoader />
                            <span className="text-neutral-200 text-sm">
                                Skill
                            </span>
                        </div>
                    </div>
                )}

                <form
                    className={`grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg
                        ${submitLoading ? "pointer-events-none opacity-70" : ""}`}
                    onSubmit={handleSubmit}>

                    {/* Skill Name */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Skill Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Skill Name"
                            value={formData.skillName}
                            onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                        {errors.skillName && (<p className="text-rose-500 text-sm mt-1">{errors.skillName}</p>)}
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
                            {submitLoading ? "Adding Skill..." : "+ Add Skill"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    </div>;
};

export default AdminAddSkill;
