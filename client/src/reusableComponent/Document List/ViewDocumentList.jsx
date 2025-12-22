import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const ViewDocumentList = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [document, setDocumnet] = useState(null);

    // When Values are Missing
    const safe = (val) => {
        if (val === null || val === undefined) return "-";
        if (typeof val === "string" && val.trim() === "") return "-";
        return val;
    };

    // Fetch Documents Details
    const fetchDocumentListByID = async () => {
        try {
            const res = await axios.get(`https://localhost:7119/api/DocumentList/fetch/${id}`)
            setDocumnet(res.data || []);
        } 
        catch (err) {
            console.log(err.data);
            toast.error("Failed to load Candidate Document details!")
        }
    }

    useEffect(() => {
        fetchDocumentListByID();
    }, []);

    if (!document) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading Candidate Document Details...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-6 flex justify-center items-start">

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                aria-label="Go back"
                className="fixed top-4 left-4 z-50 bg-neutral-800 text-white p-2 rounded-full shadow-md hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Documents and Candidate Details */}
            <div className="w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-lg p-6 md:p-8 shadow-sm mt-12">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">

                        {/* Photo */}
                        <div className="w-14 h-14 rounded-md bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 overflow-hidden">
                            {document.photo ? (
                                <img
                                    src={document.photo}
                                    alt={safe(document.fullName)}
                                    className="w-full h-full object-cover" />
                            ) : (
                                <span>{document.fullName.slice(0, 2).toUpperCase()}</span>
                            )}
                        </div>

                        <div className="min-w-0">
                            <h1 className="text-xl md:text-2xl font-extrabold leading-tight text-white truncate">
                                {safe(document.fullName)}
                            </h1>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-400">
                                <div className="flex items-center gap-2">
                                    <span className="text-purple-400 font-medium">{safe(document.title)}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-purple-400" />
                                    <span className="truncate">{safe(document.email)}</span>
                                </div>
                            </div>
                            <div className="mt-3 h-0.5 w-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-400" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-neutral-800 my-5" />

                {/* Document Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs md:text-sm text-neutral-400">

                    <div>
                        <div className="text-purple-400 font-medium">Bank Name</div>
                        <div className="text-neutral-200">{safe(document.bankName)}</div>
                    </div>
                    <div>
                        <div className="text-purple-400 font-medium">Bank Account</div>
                        <div className="text-neutral-200">{safe(document.bankAccNo)}</div>
                    </div>
                    <div>
                        <div className="text-purple-400 font-medium">IFSC</div>
                        <div className="text-neutral-200">{safe(document.bankIFSC)}</div>
                    </div>
                    <div>
                        <div className="text-purple-400 font-medium">Document List ID</div>
                        <div className="text-neutral-200 break-all">{safe(document.dlId)}</div>
                    </div>
                </div>

                <div className="border-t border-neutral-800 my-5" />

                {/* Download Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <div className="text-sm font-semibold text-purple-400 mb-2">Aadhar</div>
                        {document.aadhar ? (
                            <a
                                href={document.aadhar}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded text-sm font-medium transition">
                                Download Aadhar
                            </a>
                        ) : (
                            <div className="text-neutral-400">No Aadhar available</div>
                        )}
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-purple-400 mb-2">PAN</div>
                        {document.pan ? (
                            <a
                                href={document.pan}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded text-sm font-medium transition">
                                Download PAN
                            </a>
                        ) : (
                            <div className="text-neutral-400">No PAN available</div>
                        )}
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-purple-400 mb-2">Experience Letter</div>
                        {document.experienceLetter ? (
                            <a
                                href={document.experienceLetter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded text-sm font-medium transition">
                                Download Experience Letter
                            </a>
                        ) : (
                            <div className="text-neutral-400">No Experience Letter available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewDocumentList;
