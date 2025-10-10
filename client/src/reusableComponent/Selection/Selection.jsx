import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Plus, Filter, Download } from "lucide-react";
import CommonPagination, { paginate } from "../CommonPagination";

const Selection = ({ role = "admin" }) => {
    const navigate = useNavigate();

    const selection = [
        {
            selectionId: "9282H458-JAK1-42N9-W158-30KZMN1EPL59",
            fullName: "Preet Bhimani",
            title: "Jr. Software Developer",
            email: "preet@gmail.com",
            status: "Accepted",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
        {
            selectionId: "1203R590-HFB8-94B5-DJ78-21URDK3QLZ86",
            fullName: "Kush Vadodariya",
            title: "Jr. Data Analyst",
            email: "kush@gamil.com",
            status: "Pending",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
        {
            selectionId: "3021R095-HFB9-49B6-DJ87-12URDK4QLZ68",
            fullName: "Aadil Parmar",
            title: "Sr. Quality Analyst",
            email: "aadil@gamil.com",
            status: "Sent",
            templateType: "Job",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
        {
            selectionId: "2103R580-HFB4-38B6-DJ08-01URDK3QLZ01",
            fullName: "Nehal Padhiyar",
            title: "Jr. HR",
            email: "nehal@gamil.com",
            status: "Declined",
            templateType: "Internship",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
    ];

    // Filters
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        jobTitle: "",
        status: "",
    });

    // Job Titles for Filter
    const jobTitles = useMemo(
        () => Array.from(new Set(selection.map((s) => s.title))).sort(),
        [selection]
    );

    const statusOptions = [
        "Document Pending",
        "Pending",
        "Sent",
        "Accepted",
        "Declined",
    ];

    // Badge for Status
    const badgeClassFor = (val) => {
        const v = String(val || "").toLowerCase();
        if (v.includes("accept")) return "bg-emerald-800 text-emerald-200";
        if (v.includes("pending") && v.includes("document"))
            return "bg-violet-800 text-violet-200";
        if (v === "pending") return "bg-yellow-800 text-yellow-200";
        if (v.includes("sent")) return "bg-sky-800 text-sky-200";
        if (v.includes("decline") || v.includes("declined"))
            return "bg-rose-800 text-rose-200";
        return "bg-neutral-700 text-neutral-200";
    };

    // Filter Logic
    const filtered = useMemo(() => {
        return selection.filter((s) => {
            if (filters.jobTitle && s.title !== filters.jobTitle) return false;
            if (filters.status) {
                if (filters.status === "Document Pending") {
                    const v = String(s.status || "").toLowerCase();
                    if (!v.includes("document") && v !== "document pending") return false;
                } else {
                    if (String(s.status || "").toLowerCase() !== filters.status.toLowerCase())
                        return false;
                }
            }
            return true;
        });
    }, [selection, filters]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const pageItems = useMemo(
        () => paginate(filtered, currentPage, pageSize),
        [filtered, currentPage, pageSize]);
    useEffect(() => setCurrentPage(1), [filters]);

    return <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-end gap-3 mb-4">
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

                    {/* Job Title Filter */}
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

                    {/* Status Filter */}
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

                    <div className="flex items-end justify-end gap-2">
                        <button className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
                            onClick={() =>
                                setFilters({
                                    jobTitle: "",
                                    status: "",
                                })}>
                            Clear
                        </button>

                        <button className="flex items-center gap-2 px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded text-sm">
                            <Download size={14} /> Download
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Selected Candidate Data */}
        <div className="space-y-3">
            {pageItems.length === 0 && (
                <div className="text-center py-6 text-neutral-400">No selections found.</div>
            )}

            {pageItems.map((sel) => (
                <div
                    key={sel.selectionId}
                    className="bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img src={sel.photo} alt={sel.fullName} className="w-14 h-14 rounded-full border border-neutral-600 flex-shrink-0" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-1 flex-1 min-w-0">
                            <p className="break-all"><span className="font-medium text-purple-300">SelectionId:</span>{" "} {sel.selectionId}</p>
                            <p className="break-words"><span className="font-medium text-purple-300">Full Name:</span>{" "} {sel.fullName}</p>
                            <p className="break-words"><span className="font-medium text-purple-300">Title:</span> {sel.title}</p>
                            <p className="break-words"><span className="font-medium text-purple-300">Email:</span> {sel.email}</p>
                            <p className="truncate">
                                <span className="font-medium text-purple-300">Status:</span>{" "}
                                <span className={`px-2 py-0.5 rounded text-xs ${badgeClassFor(sel.status)}`}>
                                    {sel.status}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2 sm:mt-0">
                        {sel.status === "Pending" && role === "admin" && (
                            <button
                                className="flex items-center gap-1 px-2 py-1 bg-green-800 hover:bg-green-700 rounded text-xs"
                                onClick={() => navigate("/admin-sentmail-selection")}>
                                <Plus size={14} /> Sent
                            </button>
                        )}

                        <button
                            className="flex items-center gap-1 px-2 py-1 bg-purple-800 hover:bg-purple-700 rounded text-xs"
                            onClick={() => navigate("/view-selection")}>
                            <Eye size={14} /> View
                        </button>

                        {role === "admin" && (
                            <>
                                <button
                                    className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs"
                                    onClick={() => navigate("/admin-update-selection")}>
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
    </div>;
};

export default Selection;
