import React, { useMemo, useState, useEffect } from "react";
import { Eye, Edit, Trash2, Filter, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CommonPagination, { paginate } from "../CommonPagination";
import axios from "axios";
import { toast } from "react-toastify";

const JobApplication = ({ role = "admin" }) => {

    // Color Bage for Overall Status
    const badge = (s) =>
    ({
        Applied: "bg-yellow-600",
        Exam: "bg-blue-600",
        "Technical Interview": "bg-purple-600",
        "HR Interview": "bg-pink-600",
        Selected: "bg-green-600",
        Rejected: "bg-red-600",
        Hold: "bg-gray-600",
        Shortlisted: "bg-indigo-600",
    }[s] || "bg-yellow-600");

    const navigate = useNavigate();

    const [jobapp, setJobApp] = useState([]);

    // Fetch Job Application
    const fetchJobApplications = async () => {
        try {
            const res = await axios.get(`https://localhost:7119/api/JobApplication`)
            setJobApp(res.data || []);
        }
        catch (err) {
            toast.error("Error to fetch data!")
        }
    }

    // Filters Overview
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        examResult: "",
        status: "",
        overallStatus: "",
        title: "",
        dateFrom: "",
        dateTo: "",
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    // Filtering Logic
    const filtered = useMemo(() => {
        return jobapp.filter((j) => {
            if (filters.examResult && j.examResult !== filters.examResult) return false;
            if (filters.status && j.status !== filters.status) return false;
            if (filters.overallStatus && j.overallStatus !== filters.overallStatus) return false;
            if (filters.title && j.title !== filters.title) return false;
            if (filters.dateFrom) {
                const from = new Date(filters.dateFrom);
                const d = new Date(j.examDate || j.appliedDate);
                if (d < from) return false;
            }
            if (filters.dateTo) {
                const to = new Date(filters.dateTo);
                const d = new Date(j.examDate || j.appliedDate);
                if (d > to) return false;
            }
            return true;
        });
    }, [jobapp, filters]);

    // Pagination logic
    const pageItems = useMemo(
        () => paginate(filtered, currentPage, pageSize),
        [filtered, currentPage, pageSize]
    );

    useEffect(() => {
        setCurrentPage(1);
        fetchJobApplications();
        [filters]
    });

    // Overall Staus Fileds
    const statusOptions = ["Applied", "Exam", "Shortlisted", "Rejected", "Hold"];
    const overallStatusOptions = [
        "Applied",
        "Exam",
        "Technical Interview",
        "HR Interview",
        "Selected",
        "Rejected",
        "Hold",
    ];
    const titles = Array.from(new Set(jobapp.map((j) => j.title))).sort();

    return (
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto w-full min-w-0">

            {/* Add and Filter Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 justify-end">

                {role == "admin" && (<button
                    className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 rounded text-sm w-full sm:w-auto"
                    onClick={() => navigate("/admin-add-jobapplication")}>
                    + Add Job Application
                </button>)}

                <button
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-700 hover:bg-blue-600 rounded text-sm w-full sm:w-auto"
                    onClick={() => setShowFilters((s) => !s)}>
                    <Filter size={14} /> Filters
                </button>
            </div>

            {/* Filters UI*/}
            {showFilters && (
                <div className="mb-4 bg-neutral-900 border border-neutral-700 rounded-md p-3 sm:p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-3">
                        <div>
                            <label className="block mb-1 text-xs text-neutral-200">Exam Result</label>
                            <select
                                value={filters.examResult}
                                onChange={(e) => setFilters((f) => ({ ...f, examResult: e.target.value }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-xs sm:text-sm">
                                <option value="">All</option>
                                <option value="Pass">Pass</option>
                                <option value="Fail">Fail</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block mb-1 text-xs text-neutral-200">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-xs sm:text-sm">
                                <option value="">All</option>
                                {statusOptions.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Overall Status */}
                        <div>
                            <label className="block mb-1 text-xs text-neutral-200">Overall Status</label>
                            <select
                                value={filters.overallStatus}
                                onChange={(e) => setFilters((f) => ({ ...f, overallStatus: e.target.value }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-xs sm:text-sm">
                                <option value="">All</option>
                                {overallStatusOptions.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Job Tiltle */}
                        <div>
                            <label className="block mb-1 text-xs text-neutral-200">Job Title</label>
                            <select
                                value={filters.title}
                                onChange={(e) => setFilters((f) => ({ ...f, title: e.target.value }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-xs sm:text-sm">
                                <option value="">All</option>
                                {titles.map((jt) => (
                                    <option key={jt} value={jt}>
                                        {jt}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date From */}
                        <div>
                            <label className="block mb-1 text-xs text-neutral-200">Date From</label>
                            <input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-xs sm:text-sm" />
                        </div>

                        {/* Date To */}
                        <div>
                            <label className="block mb-1 text-xs text-neutral-200">Date To</label>
                            <input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-xs sm:text-sm" />
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 justify-end">
                        <button
                            className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-sm w-full sm:w-auto"
                            onClick={() =>
                                setFilters({
                                    examResult: "",
                                    status: "",
                                    overallStatus: "",
                                    title: "",
                                    dateFrom: "",
                                    dateTo: "",
                                })}>
                            Clear
                        </button>
                        <button className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-700 hover:bg-purple-600 rounded text-sm w-full sm:w-auto">
                            <Download size={14} /> Download
                        </button>
                    </div>
                </div>
            )}

            {/* Cards List */}
            <div className="space-y-2">
                {pageItems.length === 0 && (
                    <div className="text-center py-6 text-neutral-400">No job applications found.</div>
                )}

                {pageItems.map((ja, idx) => {
                    const appliedDate = ja.appliedDate || ja.examDate || "-";
                    return (
                        <div
                            key={`${ja.jaId}-${idx}`}
                            className="bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                            {/* Photo */}
                            <img
                                src={ja.photo}
                                alt={ja.fullName}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0" />

                            {/* Candidate info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-1 flex-1">
                                <p><span className="font-medium text-purple-300">JAID:</span> {ja.jaId || "-"}</p>
                                <p><span className="font-medium text-purple-300">Name:</span> {ja.fullName || "-"}</p>
                                <p><span className="font-medium text-purple-300">Email:</span> <span className="break-all">{ja.email || "-"}</span></p>
                                <p><span className="font-medium text-purple-300">Title:</span> {ja.title || "-"}</p>
                                <p><span className="font-medium text-purple-300">Applied Date:</span> {ja.appliedDate || "-"}</p>
                                <p><span className="font-medium text-purple-300">Overall Status:</span>{" "}
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${badge(ja.overallStatus)}`}>{ja.overallStatus || "-"}</span></p>
                                <p><span className="font-medium text-purple-300">Hold Status:</span> {ja.holdOverallStatus || "-"}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 ml-0 sm:ml-4">
                                <button
                                    className="flex items-center gap-1 px-2 py-1 bg-purple-800 hover:bg-purple-700 rounded text-xs"
                                    onClick={() => navigate(`/view-jobapplication/${ja.jaId}`)}>
                                    <Eye size={12} /> View
                                </button>

                                {role == "admin" && (<>
                                    <button
                                        className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs"
                                        onClick={() => navigate(`/admin-update-jobapplication/${ja.jaId}`)}>
                                        <Edit size={12} /> Update
                                    </button>

                                    <button className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs">
                                        <Trash2 size={12} /> Delete
                                    </button>
                                </>)}
                            </div>
                        </div>
                    );
                })}
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

export default JobApplication;
