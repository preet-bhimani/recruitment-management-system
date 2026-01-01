import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { Filter, Eye, Edit, Trash2, Download } from "lucide-react";
import CommonPagination, { paginate } from "../CommonPagination";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CommonLoader from "../../components/CommonLoader";

const OfferLetter = () => {

    const [offerLetters, setOfferLetters] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch Offer Letters
    const fetchOfferLetters = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`https://localhost:7119/api/OfferLetter`);
            setOfferLetters(res.data || []);
        }
        catch (err) {
            toast.error("Failed to fetch offer letters!");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOfferLetters();
    }, []);

    // Filters
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        title: "",
        templateType: "",
        overallStatus: "",
        dateFrom: "",
        dateTo: "",
        minSalary: "",
    });

    // Dropdown Options
    const titles = useMemo(
        () => Array.from(new Set(offerLetters.map((t) => t.title))).sort(),
        [offerLetters]);

    const templateTypes = ["Internship", "Job"];

    const statusOptions = ["Offer Letter Pending", "Offer Letter Sent", "Accepted", "Rejected"];

    // Filter Logic
    const filtered = useMemo(() => {
        return offerLetters.filter((t) => {
            if (filters.title && t.title !== filters.title) return false;
            if (filters.templateType && t.templateType !== filters.templateType) return false;
            if (filters.overallStatus && t.overallStatus !== filters.overallStatus) return false;
            if (filters.minSalary && Number(t.salary) < Number(filters.minSalary)) return false;
            if (filters.dateFrom) {
                const from = new Date(filters.dateFrom);
                const d = new Date(t.joiningDate);
                if (d < from) return false;
            }
            if (filters.dateTo) {
                const to = new Date(filters.dateTo);
                const d = new Date(t.joiningDate);
                if (d > to) return false;
            }

            return true;
        });
    }, [offerLetters, filters]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const pageItems = useMemo(
        () => paginate(filtered, currentPage, pageSize),
        [filtered, currentPage, pageSize]);

    // Handle Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Move this offer letter to Hold?")) return;

        try {
            await axios.put(`https://localhost:7119/api/OfferLetter/hold/${id}`);

            toast.success("Offer letter moved to Hold.");
            fetchOfferLetters();
        }
        catch (error) {
            toast.error("Failed to move to Hold.");
        }
    };

    useEffect(() => setCurrentPage(1), [filters]);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="flex flex-wrap items-center justify-end gap-3 mb-4">
                {/* Filters Button */}
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

                        {/* Title */}
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

                        {/* Template Type */}
                        <div>
                            <label className="block text-xs text-neutral-300 mb-1">Template Type</label>
                            <select
                                value={filters.templateType}
                                onChange={(e) => setFilters((f) => ({ ...f, templateType: e.target.value }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                                <option value="">All</option>
                                {templateTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-xs text-neutral-300 mb-1">Status</label>
                            <select
                                value={filters.overallStatus}
                                onChange={(e) => setFilters((f) => ({ ...f, overallStatus: e.target.value }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                                <option value="">All</option>
                                {statusOptions.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Min Salary */}
                        <div>
                            <label className="block text-xs text-neutral-300 mb-1">Min Salary</label>
                            <input
                                type="number"
                                min="0"
                                value={filters.minSalary}
                                onChange={(e) => setFilters((f) => ({ ...f, minSalary: e.target.value }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm" />
                        </div>

                        {/* Joining Date From */}
                        <div>
                            <label className="block text-xs text-neutral-300 mb-1">Joining Date From</label>
                            <input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm" />
                        </div>

                        {/* Joining Date To */}
                        <div>
                            <label className="block text-xs text-neutral-300 mb-1">Joining Date To</label>
                            <input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm" />
                        </div>
                    </div>

                    {/* Clear Button */}
                    <div className="mt-3 flex gap-2 justify-end">
                        <button
                            className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
                            onClick={() =>
                                setFilters({
                                    title: "",
                                    templateType: "",
                                    overallStatus: "",
                                    dateFrom: "",
                                    dateTo: "",
                                    minSalary: "",
                                })}>
                            Clear
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded text-sm">
                            <Download size={14} /> Download
                        </button>
                    </div>
                </div>
            )}

            {/* Candidates List */}
            {loading ? (<CommonLoader />) : (
                <div className="space-y-3">
                    {pageItems.length === 0 && (
                        <div className="text-center py-6 text-neutral-400">No offer letters found</div>
                    )}

                    {pageItems.map((offer) => (
                        <div
                            key={offer.olId}
                            className="bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                            {/* Candidate Details */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <img
                                    src={offer.photo}
                                    alt={offer.fullName}
                                    className="w-14 h-14 rounded-full border border-neutral-600 flex-shrink-0" />

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-1 flex-1 min-w-0">

                                    <p><span className="font-medium text-purple-300">OLId:</span> {offer.olId}</p>
                                    <p><span className="font-medium text-purple-300">Name:</span> {offer.fullName}</p>
                                    <p><span className="font-medium text-purple-300">Title:</span> {offer.title}</p>
                                    <p><span className="font-medium text-purple-300">Email:</span> <span className="break-all">{offer.email || "-"}</span></p>
                                    <p><span className="font-medium text-purple-300">Salary:</span> {offer.salary}</p>
                                    <p><span className="font-medium text-purple-300">Joining:</span>{" "}{new Date(offer.joiningDate).toLocaleDateString("en-GB")}</p>
                                    <p><span className="font-medium text-purple-300">Template:</span>{" "}{offer.templateType}</p>
                                    <p><span className="font-medium text-purple-300">Status:</span>{" "}
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs
                                        ${offer.offerLetterStatus === "Accepted"
                                                    ? "bg-emerald-800 text-emerald-200"
                                                    : offer.OfferLetterStatus === "Rejected"
                                                        ? "bg-red-800 text-red-200"
                                                        : "bg-grey-800 text-grey-200"
                                                }`}>
                                            {offer.offerLetterStatus}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-2 sm:mt-0">
                                <button className="flex items-center gap-1 px-2 py-1 bg-purple-800 hover:bg-purple-700 rounded text-xs"
                                    onClick={() => { navigate(`/view-offerletter/${offer.olId}`) }}>
                                    <Eye size={14} /> View
                                </button>

                                <button className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs"
                                    onClick={() => { navigate(`/admin-update-offerletter/${offer.olId}`) }}>
                                    <Edit size={14} /> Update
                                </button>
                                {offer.offerLetterStatus !== "Hold" && (
                                    <button className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs"
                                        onClick={() => handleDelete(offer.olId)}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
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
    );
};

export default OfferLetter;
