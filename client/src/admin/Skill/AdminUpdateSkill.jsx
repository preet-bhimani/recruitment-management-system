import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminUpdateSkill = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();
    const [skillData, setSkillData] = useState({
        skillId: "",
        skillName: "",
    });

    // Update Skill Logic
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!skillData.skillName.trim()) {
            toast.error("Skill name cannot be empty");
            return;
        }
        try {
            const res = await axios.put(`https://localhost:7119/api/Skill/${skillData.skillId}`,
                { skillName: skillData.skillName });
            toast.success("Skill updated successfully");
            navigate("/admin-skill");
        }
        catch (err) { toast.error(err.response?.data || "Something went wrong"); }
    };

    // Fetch Skills
    useEffect(() => {
        const fetchSkill = async () => {
            try {
                const res = await axios.get(`https://localhost:7119/api/Skill/${id}`);
                setSkillData(res.data);
            } catch (err) { toast.error("Failed to fetch skill data"); }
        };
        fetchSkill();
    }, [id]);

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
                    <h1 className="text-4xl font-bold text-white mb-4">Update Skill</h1>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-1 gap-4 bg-neutral-900 p-6 rounded-lg shadow-lg" onSubmit={handleUpdate}>

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

                    {/* Submit */}
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-500 p-2 rounded font-medium">
                            Update Skill
                        </button>
                    </div>
                </form>
            </main>
        </div>
    </div>;
};

export default AdminUpdateSkill;
