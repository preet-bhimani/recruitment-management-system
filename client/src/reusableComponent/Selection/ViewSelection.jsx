import React, { useState, useEffect } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CommonLoader from "../../components/CommonLoader";
import axiosInstance from "../../routes/axiosInstance";

const ViewSelection = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [selection, setSelection] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleBack = () => navigate(-1);

    // When There is no Data
    const safe = (val) => {
        if (!val || val.trim() === "")
            return "-";
        return val;
    };

    // Badge Color for Status
    const badgeClassFor = (val) => {
        const v = String(val || "")
        if (v.includes("Joined")) return "bg-green-600 text-white";
        if (v.includes("Not Joined")) return "bg-red-500 text-white";
        if (v.includes("Selected")) return "bg-yellow-500 text-white";
        if (v.includes("Hold")) return "bg-grey-600 text-white";
        return "bg-gray-700 text-white";
    };

    // Fetch Selected Candidate Details
    const fetchSelectionByID = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`Selection/${id}`)
            setSelection(res.data || []);
        } 
        catch (err) {
            toast.error("Failed to load Selection details!")
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSelectionByID();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950">
                <CommonLoader />
            </div>
        );
    }

    if (!selection) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Selected Candidates Not Found
            </div>
        );
    }

    return <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-6 flex justify-center items-start">

        {/* Back Button */}
        <button
            onClick={handleBack}
            aria-label="Go back"
            className="fixed top-4 left-4 z-50 bg-neutral-800 text-white p-2 rounded-full shadow-md hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
            <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Other Details */}
        <div className="w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-lg p-6 md:p-8 shadow-sm mt-12">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">

                    {/* Photo */}
                    <div className="w-14 h-14 rounded-md bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 overflow-hidden">
                        {selection.photo ? (
                            <img
                                src={selection.photo}
                                alt={safe(selection.fullName)}
                                className="w-full h-full object-cover" />
                        ) : (
                            <span>{selection.fullName.slice(0, 2).toUpperCase()}</span>
                        )}
                    </div>

                    <div className="min-w-0">
                        <h1 className="text-xl md:text-2xl font-extrabold leading-tight text-white truncate">
                            {safe(selection.fullName)}
                        </h1>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-400">
                            <div className="flex items-center gap-2">
                                <span className="text-purple-400 font-medium">{safe(selection.title)}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-purple-400" />
                                <span className="truncate">{safe(selection.email)}</span>
                            </div>
                        </div>
                        <div className="mt-3 h-0.5 w-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-400" />
                    </div>
                </div>

                {/* Status */}
                <div className="w-full md:w-auto flex justify-center md:justify-end items-center">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClassFor(
                            selection.selectionStatus
                        )}`}>
                        {safe(selection.selectionStatus)}
                    </span>
                </div>
            </div>

            <div className="border-t border-neutral-800 my-5" />

            {/* Other Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs md:text-sm text-neutral-400">
                <div>
                    <div className="text-purple-400 font-medium">Selection ID</div>
                    <div className="text-neutral-200 break-all">
                        {safe(selection.selectionId)}
                    </div>
                </div>

                <div>
                    <div className="text-purple-400 font-medium">Job Title</div>
                    <div className="text-neutral-200">{safe(selection.title)}</div>
                </div>

                <div>
                    <div className="text-purple-400 font-medium">Job Type</div>
                    <div className="text-neutral-200">{safe(selection.jobType)}</div>
                </div>
            </div>

            <div className="border-t border-neutral-800 my-5" />

            {/* Offer Letter Download */}
            <div>
                <div className="text-sm font-semibold text-purple-400 mb-2">
                    Offer Letter
                </div>

                {selection.offerLetter ? (
                    <a
                        href={selection.offerLetter}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded text-sm font-medium transition">
                        Download Offer Letter
                    </a>
                ) : (
                    <div className="text-neutral-400">No offer letter available.</div>
                )}
            </div>
        </div>
    </div>;
};

export default ViewSelection;
