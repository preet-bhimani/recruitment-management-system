import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { Filter, Eye, Edit, Trash2, Download } from "lucide-react";
import CommonPagination, { paginate } from "../CommonPagination";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Selection = ({ role = "admin" }) => {

    const [selection, setSelection] = useState([]);
    const navigate = useNavigate();

    // Fetch Selected Candidates
    const fetchSelection = async () => {
        try {
            const res = await axios.get(`https://localhost:7119/api/Selection`);
            setSelection(res.data || []);
        }
        catch (err) {
            toast.error("Failed to fetch selected candidates!");
        }
    };

    useEffect(() => {
        fetchSelection();
    }, []);

    // Filters
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        title: "",
        selectionStatus: ""
    });

    // Dropdown Options
    const titles = useMemo(
        () => Array.from(new Set(selection.map((t) => t.title))).sort(),
        [selection]
    );

    const statusOptions = ["Selected", "Joined", "Not Joined", "Hold"];

    // Filter Logic
    const filtered = useMemo(() => {
        return selection.filter((c) => {
            if (filters.title && c.title !== filters.title) return false;
            if (filters.selectionStatus && c.selectionStatus !== filters.selectionStatus) return false;
            return true;
        });
    }, [selection, filters]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const pageItems = useMemo(
        () => paginate(filtered, currentPage, pageSize),
        [filtered, currentPage]
    );

    // Handle Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Move this selection to Hold?")) return;

        try {
            await axios.put(`https://localhost:7119/api/Selection/hold/${id}`);
            toast.success("Selection moved to Hold!");
            fetchSelection();
        }
        catch (err) {
            toast.error("Failed to move selection to Hold!");
        }
    };

    useEffect(() => setCurrentPage(1), [filters]);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">

            {/* Filters Button */}
            <div className="flex justify-end mb-4">
                <button
                    className="flex items-center gap-2 px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm"
                    onClick={() => setShowFilters((s) => !s)}>
                    <Filter size={16} /> Filters
                </button>
            </div>

            {/* Filters UI */}
            {showFilters && (
                <div className="mb-4 bg-neutral-900 border border-neutral-700 rounded-md p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                        {/* Job Title */}
                        <div>
                            <label className="block text-xs text-neutral-300 mb-1">Job Title</label>
                            <select
                                value={filters.title}
                                onChange={(e) => setFilters((f) => ({ ...f, title: e.target.value }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                                <option value="">All</option>
                                {titles.map((jt) => (
                                    <option key={jt} value={jt}>
                                        {jt}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selection Status */}
                        <div>
                            <label className="block text-xs text-neutral-300 mb-1">Selection Status</label>
                            <select
                                value={filters.selectionStatus}
                                onChange={(e) => setFilters((f) => ({ ...f, selectionStatus: e.target.value }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                                <option value="">All</option>
                                {statusOptions.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-3 flex gap-2 justify-end">
                        <button
                            className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
                            onClick={() => setFilters({
                                title: "",
                                selectionStatus: ""
                            })}>
                            Clear
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded text-sm">
                            <Download size={14} /> Download
                        </button>
                    </div>
                </div>
            )}

            {/* Selected Candidates List */}
            <div className="space-y-3">
                {pageItems.length === 0 && (
                    <div className="text-center py-6 text-neutral-400">No selected candidates found.</div>
                )}

                {pageItems.map((c) => (
                    <div key={c.selectionId}
                        className="bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                        {/* Candidate Details */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <img
                                src={c.photo}
                                alt={c.fullName}
                                className="w-14 h-14 rounded-full border border-neutral-600 flex-shrink-0" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-1 flex-1 min-w-0">
                                <p><span className="font-medium text-purple-300">ID:</span> {c.selectionId}</p>
                                <p><span className="font-medium text-purple-300">Name:</span> {c.fullName}</p>
                                <p><span className="font-medium text-purple-300">Email:</span><span className="break-all">{" "}{c.email}</span></p>
                                <p><span className="font-medium text-purple-300">Title:</span> {c.title}</p>
                                <p><span className="font-medium text-purple-300">Status:</span>
                                    <span
                                        className={`ml-2 px-2 py-0.5 rounded text-xs 
                                        ${c.selectionStatus === "Selected"
                                                ? "bg-blue-800 text-blue-200"
                                                : c.selectionStatus === "Joined"
                                                    ? "bg-emerald-800 text-emerald-200"
                                                    : "bg-rose-800 text-rose-200"
                                            }`}>
                                        {c.selectionStatus}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-2 sm:mt-0">
                            <button className="flex items-center gap-1 px-2 py-1 bg-purple-800 hover:bg-purple-700 rounded text-xs" onClick={() => navigate(`/view-selection/${c.selectionId}`)}>
                                <Eye size={14} /> View
                            </button>
                            <button className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs"
                                onClick={() => navigate(`/admin-update-selection/${c.selectionId}`)}>
                                <Edit size={14} /> Update
                            </button>
                            {c.selectionStatus !== "Hold" && (
                                <button className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs"
                                    onClick={() => handleDelete(c.selectionId)}>
                                    <Trash2 size={14} /> Delete
                                </button>
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
        </div>
    );
};

export default Selection;
