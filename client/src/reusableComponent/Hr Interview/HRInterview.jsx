import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Filter, Download } from "lucide-react";
import CommonPagination, { paginate } from "../CommonPagination";

const HRInterview = ({ role = "admin" }) => {

    const navigate = useNavigate();

    const hrin = [
        {
            hrId: "9282H458-JAK1-42N9-W158-30KZMN1EPL59",
            fullName: "Preet Bhimani",
            title: "Jr. Software Developer",
            email: "preet@gmail.com",
            date: "2024-12-22",
            isClear: "Clear",
            status: "Clear",
            rating: 5,
            noofRound: 2,
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
        {
            hrId: "1203R590-HFB8-94B5-DJ78-21URDK3QLZ86",
            fullName: "Sahil Lotiya",
            title: "Jr. Data Analyst",
            email: "sahil@gamil.com",
            date: "2025-08-01",
            isClear: "Not Clear",
            status: "Not Clear",
            rating: 2,
            noofRound: 1,
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
    ];

    // Filters List
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        jobTitle: "",
        noOfRoundMin: "",
        isClear: "",
        status: "",
        dateFrom: "",
        dateTo: "",
        minRating: "",
    });

    // Job Title List
    const jobTitles = useMemo(
        () => Array.from(new Set(hrin.map((h) => h.title))).sort(),
        [hrin]
    );
    const isClearOptions = ["In Progress", "Clear", "Not Clear"];
    const statusOptions = ["In Progress", "Clear", "Not Clear", "Hold"];

    // Filter Logic
    const filtered = useMemo(() => {
        return hrin.filter((h) => {
            if (filters.jobTitle && h.title !== filters.jobTitle) return false;
            if (filters.noOfRoundMin && Number(h.noofRound) < Number(filters.noOfRoundMin)) return false;
            if (filters.isClear && h.isClear !== filters.isClear) return false;
            if (filters.status && h.status !== filters.status) return false;
            if (filters.minRating && Number(h.rating) < Number(filters.minRating)) return false;
            if (filters.dateFrom) {
                const from = new Date(filters.dateFrom);
                const d = new Date(h.date);
                if (d < from) return false;
            }
            if (filters.dateTo) {
                const to = new Date(filters.dateTo);
                const d = new Date(h.date);
                if (d > to) return false;
            }
            return true;
        });
    }, [hrin, filters]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const pageItems = useMemo(
        () => paginate(filtered, currentPage, pageSize),
        [filtered, currentPage, pageSize]);
    useEffect(() => setCurrentPage(1), [filters]);

    return <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-end gap-3 mb-4">
            {role === "admin" && (
                <button
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-sm"
                    onClick={() => navigate("/admin-add-hrinterview")}>
                    + Add HR Interview
                </button>
            )}

            {/* Filter Button */}
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

                    {/* No of Rounds */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">
                            No. of Rounds
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={filters.noOfRoundMin}
                            onChange={(e) => setFilters((f) => ({ ...f, noOfRoundMin: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm" />
                    </div>

                    {/* IsClear */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">isClear</label>
                        <select
                            value={filters.isClear}
                            onChange={(e) => setFilters((f) => ({ ...f, isClear: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                            <option value="">All</option>
                            {isClearOptions.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                            <option value="">All</option>
                            {statusOptions.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date From */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">Date From</label>
                        <input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm" />
                    </div>

                    {/* Date To */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">Date To</label>
                        <input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm" />
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">Min Rating</label>
                        <select
                            value={filters.minRating}
                            onChange={(e) => setFilters((f) => ({ ...f, minRating: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                            <option value="">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                </div>

                <div className="mt-3 flex gap-2 justify-end">
                    <button
                        className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
                        onClick={() =>
                            setFilters({
                                jobTitle: "",
                                noOfRoundMin: "",
                                isClear: "",
                                status: "",
                                dateFrom: "",
                                dateTo: "",
                                minRating: "",
                            })}>
                        Clear
                    </button>

                    <button className="flex items-center gap-2 px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded text-sm">
                        <Download size={14} /> Download
                    </button>
                </div>
            </div>
        )}

        <div className="space-y-3">
            {pageItems.length === 0 && (
                <div className="text-center py-6 text-neutral-400">
                    No HR interviews found.
                </div>
            )}

            {pageItems.map((hr) => (
                <div
                    key={hr.hrId}
                    className="bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">

                    {/* Interview Details */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img src={hr.photo} alt={hr.fullName} className="w-14 h-14 rounded-full border border-neutral-600 flex-shrink-0" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-1 flex-1 min-w-0">
                            <p className="break-all"><span className="font-medium text-purple-300">HRId:</span>{" "}{hr.hrId}</p>
                            <p className="break-words"><span className="font-medium text-purple-300">Full Name:</span>{" "}{hr.fullName}</p>
                            <p className="break-words"><span className="font-medium text-purple-300">Title:</span>{" "}{hr.title}</p>
                            <p className="break-words"><span className="font-medium text-purple-300">Email:</span>{" "}{hr.email}</p>
                            <p className="break-words"><span className="font-medium text-purple-300">Date:</span>{" "}{hr.date}</p>
                            <p className="truncate"><span className="font-medium text-purple-300">No. of Rounds:</span>{" "}{hr.noofRound}</p>

                            {/* IsClear */}
                            <p className="truncate">
                                <span className="font-medium text-purple-300">IsClear:</span>{" "}
                                <span
                                    className={`px-2 py-0.5 rounded text-xs ${hr.isClear === "Clear"
                                        ? "bg-emerald-800 text-emerald-200"
                                        : hr.isClear === "In Progress"
                                            ? "bg-yellow-800 text-yellow-200"
                                            : "bg-rose-800 text-rose-200"}`}>
                                    {hr.isClear}
                                </span>
                            </p>

                            {/* Status */}
                            <p className="truncate">
                                <span className="font-medium text-purple-300">Status:</span>{" "}
                                <span
                                    className={`px-2 py-0.5 rounded text-xs ${hr.status === "Clear"
                                        ? "bg-emerald-800 text-emerald-200"
                                        : hr.status === "In Progress"
                                            ? "bg-yellow-800 text-yellow-200"
                                            : "bg-rose-800 text-rose-200"}`}>
                                    {hr.status}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2 sm:mt-0">
                        <button
                            className="flex items-center gap-1 px-2 py-1 bg-purple-800 hover:bg-purple-700 rounded text-xs"
                            onClick={() => navigate("/view-hrinterview")}>
                            <Eye size={14} /> View
                        </button>

                        {role === "admin" && (
                            <>
                                <button
                                    className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs"
                                    onClick={() => navigate("/admin-update-hrinterview")}>
                                    <Edit size={14} /> Update
                                </button>

                                <button className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs">
                                    <Trash2 size={14} /> Delete
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
    </div>
};

export default HRInterview;
