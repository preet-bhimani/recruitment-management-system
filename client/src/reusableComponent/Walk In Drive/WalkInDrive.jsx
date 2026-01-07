import React, { useState, useMemo, useEffect } from "react";
import { Eye, Edit, Trash2, Filter, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CommonPagination, { paginate } from "../CommonPagination";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import CommonLoader from "../../components/CommonLoader";
import * as XLSX from "xlsx";
import axiosInstance from "../../routes/axiosInstance";

function WalkInDrive() {

    const navigate = useNavigate();
    const { token, role } = useAuth();
    const [walkIns, setWalkIns] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch Walk In Drive Data
    const fetchWalkInDrives = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`WalkInDrive`)
            setWalkIns(res.data || []);
        }
        catch {
            toast.error("Failed to load walk-in drive data!");
        }
        finally {
            setLoading(false);
        }
    };

    // Filters
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        jobTitle: "",
        location: "",
        dateFrom: "",
        dateTo: "",
    });

    // Filter Options
    const jobTitles = useMemo(() => Array.from(new Set(walkIns.map((w) => w.title))).sort(), [walkIns]);

    const locations = useMemo(() => Array.from(new Set(walkIns.map((w) => w.location))).sort(), [walkIns]);

    // Filter Logic
    const filtered = useMemo(() => {
        return walkIns.filter((w) => {
            if (filters.jobTitle && w.title !== filters.jobTitle) return false;
            if (filters.location && w.location !== filters.location) return false;

            if (filters.dateFrom) {
                const from = new Date(filters.dateFrom);
                const d = new Date(w.driveDate);
                if (d < from) return false;
            }
            if (filters.dateTo) {
                const to = new Date(filters.dateTo);
                const d = new Date(w.driveDate);
                if (d > to) return false;
            }
            return true;
        });
    }, [walkIns, filters]);

    // Handle Delete
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to inactive this walk in drive?");
        if (!confirmDelete) return;

        try {
            await axiosInstance.delete(`WalkInDrive/delete/${id}`)
            toast.success("Walk In Drive inactivated successfully!");
            fetchWalkInDrives();
        }
        catch (err) {
            toast.error(err.response?.data || "Failed to inactive walk in drive!");
        }
    };

    // Navigation
    const navigateAddDrive = () => {
        if (role == "Admin") {
            navigate("/admin-add-walkindrive")
        }
        else if (role == "Recruiter") {
            navigate("/recruiter-add-walkindrive")
        }
    }

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const pageItems = useMemo(
        () => paginate(filtered, currentPage, pageSize),
        [filtered, currentPage, pageSize]
    );

    useEffect(() => {
        if (token) {
            fetchWalkInDrives();
        }
    }, [token]);

    // Export Excel File
    const handleExport = () => {
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(filtered);

        XLSX.utils.book_append_sheet(wb, ws, "Walk In Drive");

        XLSX.writeFile(wb, "Walk In Drive.xlsx");
    }

    return <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-end gap-3 mb-4">
            <button
                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-sm"
                onClick={navigateAddDrive}>
                + Add Walk In Drive
            </button>

            <button
                className="flex items-center gap-2 px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm"
                onClick={() => setShowFilters((s) => !s)}>
                <Filter size={16} /> Filters
            </button>
        </div>

        {/* Filter UI */}
        {showFilters && (
            <div className="mb-4 bg-neutral-900 border border-neutral-700 rounded-md p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                    {/* Job Title */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1"> Job Title </label>
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

                    {/* Location */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1"> Location </label>
                        <select
                            value={filters.location}
                            onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                            <option value="">All</option>
                            {locations.map((l) => (
                                <option key={l} value={l}>
                                    {l}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date From */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1"> Drive Date From </label>
                        <input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm" />
                    </div>

                    {/* Date To */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1"> Drive Date To </label>
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
                        onClick={() => setFilters({ jobTitle: "", location: "", dateFrom: "", dateTo: "", })}>
                        Clear
                    </button>

                    <button className="flex items-center gap-2 px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded text-sm" onClick={handleExport}>
                        <Download size={14} /> Download
                    </button>
                </div>
            </div>
        )}

        {/* Walk In Drive List */}
        {loading ? (<CommonLoader />) : (
            <div className="space-y-3">
                {pageItems.length === 0 ? (<div className="text-center text-neutral-400 py-12">No Walk In Drive Found</div>) : (
                    pageItems.map((w) => (
                        <div
                            key={w.walkId}
                            className="bg-neutral-900 border border-neutral-700 rounded-md p-4 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-neutral-300 flex-1">
                                <p><span className="font-medium text-purple-300">Walk ID:</span>{" "}{w.walkId}</p>
                                <p><span className="font-medium text-purple-300">Location:</span>{" "}{w.location}</p>
                                <p><span className="font-medium text-purple-300">Job Title:</span>{" "}{w.title}</p>
                                <p><span className="font-medium text-purple-300">Drive Date:</span>{" "}{w.driveDate}</p>
                                <p>
                                    <span className="font-medium text-purple-300">Status:</span>{" "}
                                    <span className={`px-2 py-0.5 rounded text-xs ${w.isActive ? "bg-emerald-800 text-emerald-200" : "bg-rose-800 text-rose-200"}`}>
                                        {w.isActive ? "Active" : "Inactive"}
                                    </span>
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    className="flex items-center gap-1 px-2 py-1 bg-purple-800 hover:bg-purple-700 rounded text-xs"
                                    onClick={() => navigate(`/view-walkindrive/${w.walkId}`)}>
                                    <Eye size={14} /> View
                                </button>

                                {role === "admin" && (
                                    <>
                                        <button
                                            className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs"
                                            onClick={() => navigate(`/admin-update-walkindrive/${w.walkId}`)}>
                                            <Edit size={14} /> Update
                                        </button>

                                        {w.isActive && (
                                            <button
                                                className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs"
                                                onClick={() => handleDelete(w.walkId)}>
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}

        {/* Pagination */}
        <div className="mt-4">
            <CommonPagination
                totalItems={filtered.length}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage} />
        </div>
    </div>
}

export default WalkInDrive;