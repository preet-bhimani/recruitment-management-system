import React, { use, useEffect, useState } from "react";
import { MapPin, Briefcase, Clock, Users, Tag, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';
import CommonLoader from "../../components/CommonLoader";

const ViewJobOpening = () => {

    // Back Button
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const handleBack = () => {
        navigate(-1);
    };

    const [jobsData, setJobsData] = useState(null);
    const [expanded, setExpanded] = useState(false);

    // Fetch Job Opening Details
    const fetchJobOpeningByID = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`https://localhost:7119/api/JobOpening/${id}`)
            setJobsData(res.data || []);
        }
        catch (err) {
            toast.error("Failed to load Job Opening details!")
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchJobOpeningByID();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950">
                <CommonLoader />
            </div>
        );
    }

    if (!jobsData) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading Job Opening Details...
            </div>
        );
    }

    const requiredSkills = jobsData.requiredSkills ? jobsData.requiredSkills.split(/\s+/) : [];
    const preferredSkills = jobsData.preferredSkills ? jobsData.preferredSkills.split(/\s+/) : [];

    // Badge Color
    const statusStyle = (s) =>
        s === "Open" ? "bg-green-600" : s === "Closed" ? "bg-red-600" : "bg-yellow-600";

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-6 flex justify-center">

            {/* Back Button */}
            <button
                onClick={handleBack}
                aria-label="Go back"
                className="absolute top-3 left-3 z-20 bg-neutral-800 text-white p-2 rounded-full shadow-md hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Main Layout */}
            <div className="w-full max-w-6xl relative">
                <div className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-5 md:p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0">
                            <div className="w-14 h-14 rounded-md bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                                {jobsData.title.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()}
                            </div>
                            <div className="min-w-0">

                                {/* Title and Hading */}
                                <h1 className="text-xl md:text-3xl font-extrabold leading-tight text-white truncate">
                                    {jobsData.title}
                                </h1>
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-400">
                                    <span className="flex items-center gap-1"><Users size={14} className="text-purple-400" /> {jobsData.noOfOpening} openings</span>
                                    <span className="flex items-center gap-1"><Briefcase size={14} className="text-purple-400" /> {jobsData.jobType}</span>
                                    <span className="flex items-center gap-1"><Clock size={14} className="text-purple-400" /> {jobsData.experience}+ yr</span>
                                </div>
                                <div className="mt-3 h-0.5 w-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-400" />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="w-full md:w-auto flex justify-center md:justify-end">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle(jobsData.status)}`}>
                                {jobsData.status}
                            </div>
                        </div>

                    </div>

                    <div className="border-t border-neutral-800 my-5" />

                    {/* Other Details */}
                    <div className="space-y-5">

                        {/* Required Skills */}
                        <div>
                            <div className="text-sm font-semibold text-purple-400 mb-2">Required Skills</div>
                            <div className="flex flex-wrap gap-2">
                                {requiredSkills.map((s, i) => (
                                    <span key={i} className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-200">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Preferred Skills */}
                        <div>
                            <div className="text-sm font-semibold text-purple-400 mb-2">Preferred Skills</div>
                            <div className="flex flex-wrap gap-2">
                                {preferredSkills.map((s, i) => (
                                    <span key={i} className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-200">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold text-purple-400">Job Description</div>
                                <button
                                    onClick={() => setExpanded(prev => !prev)}
                                    className="text-xs text-neutral-400 hover:text-neutral-200"
                                    aria-expanded={expanded}>
                                    {expanded ? "Collapse" : "Expand"}
                                </button>
                            </div>
                            <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                                {expanded ? jobsData.description : `${jobsData.description.slice(0, 180)}${jobsData.description.length > 180 ? "…" : ""}`}
                            </p>
                        </div>

                        {/* Job Details */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs md:text-sm text-neutral-400">
                            <div>
                                <div className="text-purple-400 font-medium">Experience</div>
                                <div className="text-neutral-200">{jobsData.experience} year(s)</div>
                            </div>
                            <div>
                                <div className="text-purple-400 font-medium">Vacancies</div>
                                <div className="text-neutral-200">{jobsData.noOfOpening}</div>
                            </div>
                            <div>
                                <div className="text-purple-400 font-medium">Qualification</div>
                                <div className="text-neutral-200">{jobsData.qualification}</div>
                            </div>
                            <div>
                                <div className="text-purple-400 font-medium">Job Type</div>
                                <div className="text-neutral-200">{jobsData.jobType}</div>
                            </div>
                        </div>

                        {/* Job ID and Location */}
                        <div className="border-t border-neutral-800 my-4" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-neutral-400">
                            <div>
                                <div className="text-purple-400 font-medium">Job ID</div>
                                <div className="text-neutral-200 break-all">{jobsData.joId}</div>
                            </div>
                            <div>
                                <div className="text-purple-400 font-medium">Location</div>
                                <div className="flex items-center gap-2 text-neutral-200">
                                    <MapPin size={14} className="text-purple-400" />
                                    {jobsData.location}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewJobOpening;
