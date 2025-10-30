import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Download } from "lucide-react";
import CommonPagination, { paginate } from "../CommonPagination";
import axios from "axios";
import { toast } from "react-toastify";

const Skill = ({ role = "admin" }) => {

    const navigate = useNavigate();

    const [allSkills, setAllSkills] = useState([]);

    // Fetch  Skills
    const fetchSkills = async () => {
        try {
            const res = await axios.get("https://localhost:7119/api/Skill");
            setAllSkills(res.data || []);
        }
        catch (err) { toast.error("Failed to load skills"); }
    };

    // Delete Skill Logic
    const handleDelete = async (skillId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this skill?");
        if (!confirmDelete) return;
        try {
            const res = await axios.delete(`https://localhost:7119/api/Skill/${skillId}`);
            if (res.status === 200) {
                toast.success("Skill deleted successfully");
                fetchSkills();
            }
        } catch (err) {
            toast.error(err.response?.data || "Failed to delete skill");
        }
    };

    // Fetching Data
    useEffect(() => {
        fetchSkills();
    }, []);

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
                                    onClick={() => navigate(`/admin-update-skill/${skill.skillId}`)}>
                                    Update
                                </button>

                                <button className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs"
                                    onClick={() => handleDelete(skill.skillId)}>
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
