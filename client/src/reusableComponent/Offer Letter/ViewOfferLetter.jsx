import React, { useEffect, useState } from "react";
import { ArrowLeft, Mail, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CommonLoader from "../../components/CommonLoader";
import axiosInstance from "../../routes/axiosInstance";

function ViewOfferLetter() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleBack = () => navigate(-1);

    // When There is no Data
    const safe = (val) => {
        if (!val || String(val).trim() === "")
            return "-";
        return val;
    };

    // Badge Color for Offer Letter Status
    const badgeClassForStatus = (status) => {
        const v = String(status || "").toLowerCase();
        if (v === "accepted") return "bg-green-600 text-white";
        if (v === "rejected") return "bg-red-600 text-white";
        if (v === "hold") return "bg-gray-500 text-white";
        return "bg-neutral-700 text-white";
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return date.split("T")[0];
    };

    // Fetch Offer Letter Details
    const fetchOfferLetterById = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`OfferLetter/fetch/${id}`)
            setOffer(res.data);
        }
        catch (err) {
            toast.error("Failed to load Offer Letter details!");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOfferLetterById();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950">
                <CommonLoader />
            </div>
        );
    }

    if (!offer) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                No Offer Letter Found
            </div>
        );
    }

    return <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-6 flex justify-center">

        {/* Back Button */}
        <button
            onClick={handleBack}
            className="fixed top-4 left-4 z-50 bg-neutral-800 p-2 rounded-full hover:bg-neutral-700 transition">
            <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="w-full max-w-6xl bg-neutral-900 border border-neutral-800 rounded-xl p-6 md:p-8 mt-12">
            <div className="flex flex-col md:flex-row md:justify-between gap-6">
                <div className="flex gap-4">

                    {/* Photo */}
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-500 overflow-hidden flex items-center justify-center text-lg font-bold">
                        {offer.photo ? (
                            <img
                                src={offer.photo}
                                alt={safe(offer.fullName)}
                                className="w-full h-full object-cover" />
                        ) : (
                            safe(offer.fullName).slice(0, 2).toUpperCase()
                        )}
                    </div>

                    {/* Candidate Details for Offer Letter */}
                    <div>
                        <h1 className="text-2xl font-bold">{safe(offer.fullName)}</h1>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-400">
                            <div className="flex items-center gap-2">
                                <span className="text-purple-400 font-medium">{safe(offer.title)}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-purple-400" />
                                <span className="truncate">{safe(offer.email)}</span>
                            </div>
                        </div>
                        <div className="mt-3 h-1 w-28 bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full" />
                    </div>
                </div>

                {/* Status */}
                <div className="flex items-start justify-end">
                    <span
                        className={`px-4 py-1 rounded-full text-sm font-medium ${badgeClassForStatus(
                            offer.offerLetterStatus
                        )}`}>
                        {safe(offer.offerLetterStatus)}
                    </span>
                </div>
            </div>
            <div className="border-t border-neutral-800 my-8" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">

                <div>
                    <div className="text-purple-400 font-medium mb-1"> Offer Letter ID </div>
                    <div className="text-neutral-200">{safe(offer.olId)}</div>
                </div>

                <div>
                    <div className="text-purple-400 font-medium mb-1"> Job Type </div>
                    <div className="text-neutral-200">{safe(offer.jobType)}</div>
                </div>

                <div>
                    <div className="text-purple-400 font-medium mb-1"> Salary </div>
                    <div className="text-neutral-200">{safe(offer.salary)}</div>
                </div>

                <div>
                    <div className="text-purple-400 font-medium mb-1"> Joining Date </div>
                    <div className="text-neutral-200">{formatDate(offer.joiningDate)}</div>
                </div>

                <div>
                    <div className="text-purple-400 font-medium mb-1"> End Date </div>
                    <div className="text-neutral-200">{formatDate(offer.endDate)}</div>
                </div>

                <div>
                    <div className="text-purple-400 font-medium mb-1"> Bond Time </div>
                    <div className="text-neutral-200">{offer.bondTime ? `${offer.bondTime} Months` : "-"}</div>
                </div>
            </div>

            <div className="border-t border-neutral-800 my-8" />

            {/* Offer Letter */}
            <div>
                <h3 className="text-purple-400 font-semibold mb-3"> Offer Letter </h3>

                {offer.offerLetter ? (
                    <a
                        href={offer.offerLetter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2 bg-purple-700 hover:bg-purple-600 rounded-md transition">
                        <FileText size={18} />
                        View Offer Letter
                    </a>
                ) : (
                    <p className="text-neutral-400">
                        No offer letter available.
                    </p>
                )}
            </div>
        </div>
    </div>;
}

export default ViewOfferLetter;
