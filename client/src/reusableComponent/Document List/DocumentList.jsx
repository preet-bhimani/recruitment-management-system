import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Plus, Filter, Download } from "lucide-react";
import CommonPagination, { paginate } from "../CommonPagination";

const DocumentList = ({ role = "admin" }) => {
    const navigate = useNavigate();

    const documents = [
        {
            dlId: "9282A458-JBC1-42D9-E158-30FGHI1JKL59",
            fullName: "Preet Bhimani",
            title: "Jr. Software Developer",
            email: "preet@gmail.com",
            status: "Completed",
            bankName: "ICICI",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
        {
            dlId: "1203M590-NOB8-94P5-QR78-21STUV3QWX86",
            fullName: "Kush Vadodariya",
            title: "Jr. Data Analyst",
            email: "kush@gamil.com",
            status: "Pending",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
        {
            dlId: "3021Y095-ZAB9-49B6-CD87-12EFGH4IJZ68",
            fullName: "Aadil Parmar",
            title: "Sr. Quality Analyst",
            email: "aadil@gamil.com",
            status: "Pending",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
        {
            dlId: "2103K580-LMB4-38N6-OP08-01QRST3UVZ01",
            fullName: "Nehal Padhiyar",
            title: "Jr. HR",
            email: "nehal@gamil.com",
            status: "Completed",
            bankName: "SBI",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
    ];

    // Filters
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        jobTitle: "",
        status: "",
        bankName: "",
    });

    const jobTitles = useMemo(() => Array.from(new Set(documents.map(d => d.title))).sort(), [documents]);
    const statusOptions = ["Completed", "Pending"];
    const bankNames = useMemo(() => Array.from(new Set(documents.map(d => d.bankName).filter(Boolean))).sort(), [documents]);

    // Filter Logic
    const filtered = useMemo(() => {
        return documents.filter(d => {
            if (filters.jobTitle && d.title !== filters.jobTitle) return false;
            if (filters.status && d.status !== filters.status) return false;
            if (filters.bankName && d.bankName !== filters.bankName) return false;
            return true;
        });
    }, [documents, filters]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const pageItems = useMemo(() => paginate(filtered, currentPage, pageSize), [filtered, currentPage, pageSize]);
    useEffect(() => setCurrentPage(1), [filters]);

    return <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        
        {/* Filter Button */}
        <div className="flex flex-wrap items-center justify-end gap-3 mb-4">
            <button
                className="flex items-center gap-2 px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm"
                onClick={() => setShowFilters(s => !s)}>
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
                            value={filters.jobTitle}
                            onChange={e => setFilters(f => ({ ...f, jobTitle: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                            <option value="">All</option>
                            {jobTitles.map(jt => <option key={jt} value={jt}>{jt}</option>)}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">Status</label>
                        <select
                            value={filters.status}
                            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                            <option value="">All</option>
                            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Bank Name */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">Bank Name</label>
                        <select
                            value={filters.bankName}
                            onChange={e => setFilters(f => ({ ...f, bankName: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                            <option value="">All</option>
                            {bankNames.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mt-3 flex gap-2 justify-end">
                    <button
                        className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
                        onClick={() => setFilters({ jobTitle: "", status: "", bankName: "" })}>
                        Clear
                    </button>

                    <button className="flex items-center gap-2 px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded text-sm">
                        <Download size={14} /> Download
                    </button>
                </div>
            </div>
        )}

        {/* Candidates Document List Details */}
        <div className="space-y-3">
            {pageItems.length === 0 && (
                <div className="text-center py-6 text-neutral-400">No documents found.</div>
            )}
            {pageItems.map(doc => (
                <div key={doc.dlId} className="bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                    {/* Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img src={doc.photo} alt={doc.fullName} className="w-14 h-14 rounded-full border border-neutral-600 flex-shrink-0" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-1 flex-1 min-w-0">
                            <p className="break-all"><span className="font-medium text-purple-300">Document Id:</span> {doc.dlId}</p>
                            <p className="break-words"><span className="font-medium text-purple-300">Full Name:</span> {doc.fullName}</p>
                            <p className="break-words"><span className="font-medium text-purple-300">Title:</span> {doc.title}</p>
                            <p className="break-words"><span className="font-medium text-purple-300">Email:</span> {doc.email}</p>
                            <p className="break-words"><span className="font-medium text-purple-300">Status:</span> <span
                                className={`px-2 py-0.5 rounded text-xs ${doc.status === "Completed"
                                    ? "bg-emerald-800 text-emerald-100"
                                    : "bg-rose-800 text-rose-100"}`}>
                                {doc.status}
                            </span></p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2 sm:mt-0">
                        <button className="flex items-center gap-1 px-2 py-1 bg-purple-800 hover:bg-purple-700 rounded text-xs" onClick={() => navigate("/view-documentlist")}>
                            <Eye size={14} /> View
                        </button>

                        {role === "admin" && (
                            <>
                                <button className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs" onClick={() => navigate("/admin-update-document")}>
                                    <Edit size={14} /> Update
                                </button>
                                <button className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </>
                        )}

                        {role === "admin" && doc.status === "Pending" && (
                            <button className="flex items-center gap-1 px-2 py-1 bg-green-800 hover:bg-green-700 rounded text-xs" onClick={() => navigate('/admin-add-document')}>
                                <Plus size={14} /> Add
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
    </div>;
};

export default DocumentList;
