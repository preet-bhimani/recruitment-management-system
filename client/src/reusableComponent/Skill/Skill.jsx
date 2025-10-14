import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Download } from "lucide-react";
import CommonPagination, { paginate } from "../CommonPagination";

const Skill = ({ role = "admin" }) => {

    const navigate = useNavigate();

    const allSkills = [
        { skillId: "4613003f-5dd6-4dc1-9ac6-2dd0c66c8a32", skillName: "Java" },
        { skillId: "ea4a5867-ed19-44d2-85e8-ed96a924d61b", skillName: "Python" },
        { skillId: "e7dd23a2-b66e-440a-bbc5-0d9a47be2488", skillName: "C#" },
        { skillId: "3d6e3218-e736-4e8d-9f32-c54d71326df3", skillName: "C++" },
        { skillId: "26a425d8-d4d0-4991-b437-5f5392be87cf", skillName: "HTML" },
        { skillId: "af117926-be6d-4626-9848-4060d3dd2cd0", skillName: "CSS" },
        { skillId: "0880e40e-8827-4475-a21f-95fb035ef791", skillName: "JavaScript" },
        { skillId: "2ce41639-dc3f-45b2-a95d-41081c467594", skillName: "React" },
        { skillId: "5b9f4502-9987-4368-b532-812365cbd942", skillName: "Angular" },
        { skillId: "ecdf9544-5639-4c93-af9d-780851f061ce", skillName: "Node.js" },
        { skillId: "c4c8e9e1-9de9-40de-a984-f796e241ae47", skillName: "Express.js" },
        { skillId: "2a6d28c2-fdf5-4e7a-903c-ce52278179ab", skillName: "ASP.NET Core" },
        { skillId: "13bbfed5-8ce9-4121-ac05-b7f5f3d58949", skillName: "ASP.NET MVC" },
        { skillId: "7be74c7e-d812-457f-85f1-d5e81e36db62", skillName: "Web API" },
        { skillId: "073e1566-0fe1-426d-bb46-705aa6926a5f", skillName: "SQL" },
        { skillId: "90ec192f-70f3-4ff8-ba98-589387d0410a", skillName: "MySQL" },
        { skillId: "362c3eb7-9407-49ed-bcac-8887e708070a", skillName: "Data Science" },
        { skillId: "de3ab5a5-3a41-4047-95ae-7070bb07c974", skillName: "MongoDB" },
        { skillId: "a65254f2-fe7c-4d3a-b593-d9c88e1fb0dd", skillName: "Figma" },
        { skillId: "d1f296bc-46d5-4f6d-8832-3535fa48a1d8", skillName: "SCADA" },
        { skillId: "93cfb584-77c4-4397-972e-173c1923a715", skillName: "Git" },
        { skillId: "1bcf9c7a-d079-4c16-8454-f252b243c812", skillName: "GitHub" },
        { skillId: "0f3edb3d-fb73-4b77-b1fb-44a91f73ee29", skillName: "Docker" },
        { skillId: "21ed837e-f5d6-400d-9b1a-31c4230f82c1", skillName: "Kubernetes" },
        { skillId: "4299a57b-4dcb-4023-908f-d39fc37ebdae", skillName: "AWS" },
        { skillId: "5c8aa8d6-5a62-47fb-a103-7cf586153c1f", skillName: "Azure" },
        { skillId: "49bc8491-eb18-469e-b396-f7898d41a9a3", skillName: "Firebase" },
        { skillId: "495cd3a2-53be-4a1c-9838-140129e92162", skillName: "Linux" },
        { skillId: "417502c9-2f03-42db-84b0-640528a28652", skillName: "UI/UX Design" },
        { skillId: "cf99cc91-ad4f-4c14-9c36-381b3b3f4b5a", skillName: "Data Structures" },
        { skillId: "bea2b4f1-87e8-4d57-ab46-8377f2edf77a", skillName: "Algorithms" },
        { skillId: "6aae60c8-44d3-4986-8ecd-466e24459929", skillName: "Machine Learning" },
        { skillId: "02428d13-5136-48ec-8470-a876690142e1", skillName: "Artificial Intelligence" },
        { skillId: "e74b120d-1773-4b64-a03d-816c349f6f80", skillName: "Cyber Security" },
        { skillId: "b8213a09-da4b-49ce-95ad-fd0dfa7f95e7", skillName: "Data Analysis" },
        { skillId: "62c628e3-c16b-4333-afb3-f10edc4729a5", skillName: "Power BI" },
        { skillId: "f459c7dd-ef0b-42ca-baa8-96b10f0c8d0a", skillName: "Tableau" },
        { skillId: "b6556456-5b6a-4d6e-9435-8937ce7fef60", skillName: "Cloud Computing" },
        { skillId: "e75aad0f-3266-4148-a15e-344763a3b311", skillName: "Communication" },
        { skillId: "5094c19d-2579-448e-9c25-cbf83566b19d", skillName: "Leadership" },
        { skillId: "93e22b37-594f-46b8-af39-0e28c8d5152d", skillName: "Team Management" },
        { skillId: "69933a14-277d-452e-bdba-ec0527e9c5aa", skillName: "Problem Solving" },
        { skillId: "2c36ec2c-8df4-4085-b08a-9ed9bd8eb0e3", skillName: "Critical Thinking" },
        { skillId: "a022214b-fec5-4f48-ad50-db2708c16dc7", skillName: "Time Management" },
        { skillId: "84ed1d6e-f888-4691-a9e3-3255f551fb81", skillName: "Tally" },
        { skillId: "fc7d2450-026d-4d0c-b485-0b7d1ecdf552", skillName: "MS Office" },
        { skillId: "32b5df0c-31f1-40af-8b4c-7497d02660f3", skillName: "Accounting" },
        { skillId: "d8be5e4c-0338-4813-ad0c-f165cf32adb3", skillName: "Client Handling" },
        { skillId: "b5a7939d-2926-4e64-92d2-91bd903835e4", skillName: "Negotiation" },
        { skillId: "8c908af4-8103-47ad-bc87-5720d95ce971", skillName: "Adaptability" },
    ];


    // Filter field
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        q: "",
    });

    // Filter Logic
    const filtered = useMemo(() => {
        const q = (filters.q || "").trim().toLowerCase();
        let list = allSkills;
        if (q) {
            list = list.filter((s) => String(s.skillName || "").toLowerCase().includes(q));
        }
        return list;
    }, [allSkills, filters.q]);

    // Pagination 
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;
    const pageItems = useMemo(() => paginate(filtered, currentPage, pageSize), [filtered, currentPage, pageSize]);
    useEffect(() => setCurrentPage(1), [filters]);

    return <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">

        {/* Add Skill and Filter Button */}
        <div className="flex flex-wrap items-center justify-end gap-3 mb-4">
            {role === "admin" && (
                <button
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-sm"
                    onClick={() => navigate("/admin-add-skill")}>
                    + Add Skill
                </button>
            )}

            <button
                className="flex items-center gap-2 px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm"
                onClick={() => setShowFilters((s) => !s)}>
                <Filter size={16} /> Filters
            </button>
        </div>

        {/* Filters UI */}
        {showFilters && (
            <div className="mb-4 bg-neutral-900 border border-neutral-700 rounded-md p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                        <label className="block text-xs text-neutral-300 mb-1">Search Skill</label>
                        <input
                            type="text"
                            placeholder="Search by skill name..."
                            value={filters.q}
                            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm" />
                    </div>
                </div>

                <div className="mt-3 flex gap-2 justify-end">
                    <button
                        className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
                        onClick={() => setFilters({ q: "" })}>
                        Clear
                    </button>

                    <button className="flex items-center gap-2 px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded text-sm">
                        <Download size={14} /> Download
                    </button>
                </div>
            </div>
        )}

        {/* Skills Details */}
        <div className="space-y-3">
            {pageItems.length === 0 && (
                <div className="text-center py-6 text-neutral-400">No skills found.</div>
            )}

            {pageItems.map((skill) => (
                <div
                    key={skill.skillId}
                    className="bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-1 flex-1 min-w-0 text-neutral-300">
                            <p className="break-all">
                                <span className="font-medium text-purple-300">Skill ID:</span>{" "}
                                <span className="text-neutral-200">{skill.skillId}</span>
                            </p>

                            <p className="break-words">
                                <span className="font-medium text-purple-300">Skill Name:</span>{" "}
                                <span className="text-neutral-200">{skill.skillName}</span>
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2 sm:mt-0">
                        {role === "admin" && (
                            <>
                                <button
                                    className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs"
                                    onClick={() => navigate("/admin-update-skill")}>
                                    Update
                                </button>

                                <button className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs">
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>

        {/* Pagination */}
        <div className="mt-4">
            <CommonPagination
                totalItems={filtered.length}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage} />
        </div>
    </div>;
};

export default Skill;
