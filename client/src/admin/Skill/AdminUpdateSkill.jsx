import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const AdminUpdateSkill = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const [skillData, setSkillData] = useState({
            skillId: "9CF256C4-7ECA-4469-8CCE-08DD70ACE5C1",
            skillName: "Java",
        })

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

                <form className="grid grid-cols-1 md:grid-cols-1 gap-4 bg-neutral-900 p-6 rounded-lg shadow-lg">

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
                            defaultValue={skillData.skillName}
                            placeholder="Enter Skill Name"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2">
                        <button
                            type="button"
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
