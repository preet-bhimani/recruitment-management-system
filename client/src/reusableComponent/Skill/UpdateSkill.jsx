import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"
import CommonLoader from "../../components/CommonLoader";
import axiosInstance from "../../routes/axiosInstance";

const UpdateSkill = ({ id }) => {

    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { role } = useAuth();
    const navigate = useNavigate();
    const [skillData, setSkillData] = useState({
        skillId: "",
        skillName: "",
        skillStatus: true
    });

    // Update Skill Logic
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!skillData.skillName.trim()) {
            toast.error("Skill name cannot be empty");
            return;
        }
        try {
            setSubmitLoading(true);
            const res = await axiosInstance.put(`Skill/${id}`, skillData)
            toast.success("Skill updated successfully");
            if (role === "Admin") {
                navigate(`/admin-skill`)
            }
            else {
                navigate(`/recruiter-skill`)
            }
        }
        catch (err) {
            toast.error(err.response?.data || "Something went wrong");
        }
        finally {
            setSubmitLoading(false);
        }
    };

    // Fetch Skills
    useEffect(() => {
        const fetchSkill = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(`Skill/${id}`);
                setSkillData(res.data);
            }
            catch (err) {
                toast.error("Failed to fetch skill data");
            }
            finally {
                setLoading(false);
            }
        };
        fetchSkill();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950">
                <CommonLoader />
            </div>
        );
    }

    return <>
        {submitLoading && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                <div className="bg-neutral-900 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                    <CommonLoader />
                </div>
            </div>
        )}

        <form
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg
                        ${submitLoading ? "pointer-events-none opacity-70" : ""}`}
            onSubmit={handleUpdate}>

            {/* Skill ID */}
            <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium text-neutral-300">
                    Skill ID
                </label>
                <input
                    type="text"
                    value={skillData.skillId}
                    disabled
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-300 cursor-not-allowed" />
            </div>

            {/* Skill Name */}
            <div>
                <label className="block mb-1 text-sm font-medium">
                    Skill Name <span className="text-rose-500">*</span>
                </label>
                <input
                    type="text"
                    value={skillData.skillName}
                    onChange={(e) => setSkillData({ ...skillData, skillName: e.target.value })}
                    placeholder="Enter Skill Name"
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
            </div>

            {/* SkillStatus */}
            <div>
                <label className="block mb-1 text-sm font-medium">Skill Status <span className="text-rose-500">*</span></label>
                <select
                    name="SkillStatus"
                    value={String(skillData.skillStatus)}
                    onChange={(e) => setSkillData({ ...skillData, skillStatus: e.target.value === "true"})}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100">
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
                    {submitLoading ? "Updating..." : "+ Update Skill "}
                </button>
            </div>
        </form>
    </>;
};

export default UpdateSkill;
