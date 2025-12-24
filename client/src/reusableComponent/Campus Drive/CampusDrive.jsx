import React, { useState, useMemo, useEffect } from "react";
import { Eye, Edit, Trash2, Filter, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CommonPagination, { paginate } from "../CommonPagination";
import axios from "axios";
import { toast } from "react-toastify";

const CampusDrive = ({ role = "admin" }) => {

    const navigate = useNavigate();

    const [campus, setCampus] = useState([]);

    // Fetch Campus Drive
    const fetchCampusDrive = async () => {
        try {
            const res = await axios.get(`https://localhost:7119/api/CampusDrive`)
            setCampus(res.data || []);
        }
        catch (err) {
            toast.error("Failed to load campus drive data!")
        }
    }

    // Filters
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        jobTitle: "",
        universityName: "",
        dateFrom: "",
        dateTo: "",
    });

    // Filter for Job Titles and Universities
    const jobTitles = useMemo(() => Array.from(new Set(campus.map((c) => c.title))).sort(), [campus]);

    const universities = useMemo(() => Array.from(new Set(campus.map((c) => c.universityName).filter(Boolean))).sort(), [campus]);

    // Fliter Logic
    const filtered = useMemo(() => {
        return campus.filter((c) => {
            if (filters.jobTitle && c.title !== filters.jobTitle) return false;
            if (filters.universityName && c.universityName !== filters.universityName) return false;
            if (filters.dateFrom) {
                const from = new Date(filters.dateFrom);
                const d = new Date(c.driveDate);
                if (d < from) return false;
            }
            if (filters.dateTo) {
                const to = new Date(filters.dateTo);
                const d = new Date(c.driveDate);
                if (d > to) return false;
            }
            return true;
        });
    }, [campus, filters]);

    const handleAddNavigate = () =>{
        if(role == "admin")
        {
            navigate("/admin-add-campusdrive")
        }
        else if(role == "recruiter")
        {
            navigate("/recruiter-add-campusdrive")
        }
    }

    // Handle Delete
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to inactive campus drive ?");
        if (!confirmDelete) return;
        try {
            await axios.delete(`https://localhost:7119/api/CampusDrive/delete/${id}`);
            toast.success('Campus Drive Inactive Successfully!');
            await fetchCampusDrive();
        }
        catch (err) {
            toast.error(err.response.data || 'Failed to inactive campus drive!')
        }
    }

    useEffect(() => {
        fetchCampusDrive();
    }, [])

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const pageItems = useMemo(() => paginate(filtered, currentPage, pageSize), [filtered, currentPage, pageSize]);
    useEffect(() => setCurrentPage(1), [filters]);

    return <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-end gap-3 mb-4">

            <button
                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-sm"
                onClick={handleAddNavigate}>
                + Add Campus Drive
            </button>

            <button className="flex items-center gap-2 px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm"
                onClick={() => setShowFilters((s) => !s)}>
                <Filter size={16} /> Filters
            </button>
        </div>

        {/* Filters UI */}
        {showFilters && (
            <div className="mb-4 bg-neutral-900 border border-neutral-700 rounded-md p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                    {/* Job Title */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">Job Title</label>
                        <select
                            value={filters.jobTitle}
                            onChange={(e) => setFilters((f) => ({ ...f, jobTitle: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                            <option value="">All</option>
                            {jobTitles.map((jt) => (
                                <option key={jt} value={jt}>
                                    {jt}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* University */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">University</label>
                        <select
                            value={filters.universityName}
                            onChange={(e) => setFilters((f) => ({ ...f, universityName: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                            <option value="">All</option>
                            {universities.map((u) => (
                                <option key={u} value={u}>
                                    {u}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date From */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">Drive Date From</label>
                        <input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm" />
                    </div>

                    {/* Date To */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">Drive Date To</label>
                        <input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm" />
                    </div>
                </div>

                <div className="mt-3 flex gap-2 justify-end">
                    <button
                        className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
                        onClick={() => setFilters({ jobTitle: "", universityName: "", dateFrom: "", dateTo: "" })}>
                        Clear
                    </button>

                    <button className="flex items-center gap-2 px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded text-sm">
                        <Download size={14} /> Download
                    </button>
                </div>
            </div>
        )}

        {/* Campus Drive List */}
        <div className="space-y-3">
            {pageItems.map((cd) => (
                <div
                    key={cd.cdId}
                    className="bg-neutral-900 border border-neutral-700 rounded-md p-4 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 flex-1 min-w-0 text-neutral-300">
                            <p className="break-all"><span className="font-medium text-purple-300">CD ID:</span> {cd.cdid}</p>
                            <p className="break-words"><span className="font-medium text-purple-300">University Name:</span> {cd.universityName}</p>
                            <p className="break-words"><span className="font-medium text-purple-300">Title:</span> {cd.title}</p>
                            <p className="break-words"><span className="font-medium text-purple-300">Drive Date:</span> {cd.driveDate}</p>
                            <p>
                                <span className="font-medium text-purple-300">Status:</span>{" "}
                                <span className={`px-2 py-0.5 rounded text-xs ${cd.isActive ? "bg-emerald-800 text-emerald-200" : "bg-rose-800 text-rose-200"}`}>
                                    {cd.isActive ? "Active" : "Inactive"}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2 sm:mt-0">
                        <button
                            className="flex items-center gap-1 px-2 py-1 bg-purple-800 hover:bg-purple-700 rounded text-xs"
                            onClick={() => navigate(`/view-campusdrive/${cd.cdid}`)}>
                            <Eye size={14} /> View
                        </button>

                        {role === "admin" && (
                            <>
                                <button
                                    className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs"
                                    onClick={() => navigate(`/admin-update-campusdrive/${cd.cdid}`)}>
                                    <Edit size={14} /> Update
                                </button>
                                {cd.isActive && (
                                    <button
                                        className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs"
                                        onClick={() => handleDelete(cd.cdid)}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                )}
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
    </div>
};

export default CampusDrive;