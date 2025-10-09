import React, { useState } from "react";
import { ArrowLeft, Mail, Link, Star, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewTechnicalInterview = () => {

    const navigate = useNavigate();
    const handleBack = () => navigate(-1);

    const [interview] = useState({
        tiId: "0192R489-HFB7-83B4-DJ67-10URDK2QLZ75",
        fullName: "Rutvik Dollar",
        title: "Quality Analyst",
        email: "rutvik@gamil.com",
        date: "2025-07-14",
        isClear: "Not Clear",
        status: "Not Clear",
        rating: 2,
        meetingLink: "https://teams.live.com/",
        interviewerName: "Nirav Bhatt",
        interviewerEmail: "nirav@gmail.com",
        photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        noofRound: 2,
        feedback: "Unfortunately, we cannot move forward your application. You have to work on your fundamentals. Thank you for applying!!",
        meetingSubject: "Technical Interview Round 2",
    });

    const safe = (v) => (v === null || v === undefined || v === "" ? "-" : v);

    const statusBadge = (s) =>
        s === "Clear"
            ? "bg-emerald-600"
            : s === "In Progress"
                ? "bg-yellow-600"
                : s === "Not Clear"
                    ? "bg-rose-600"
                    : "bg-gray-600";

    const roundBadge = (n) =>
        n >= 3 ? "bg-indigo-600" : "bg-sky-600";

    // Star Rating Logic
    const renderStars = (r) => {
        const stars = [];
        const n = Number(r) || 0;
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star
                    key={i}
                    size={14}
                    className={`inline-block ${i < n ? "text-yellow-400" : "text-neutral-500"}`} />
            );
        }
        return stars;
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-6 flex justify-center">

            {/* Back Button */}
            <button
                onClick={handleBack}
                aria-label="Go back"
                className="absolute top-3 left-3 z-20 bg-neutral-800 text-white p-2 rounded-full shadow-md hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="w-full max-w-4xl">
                <div className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-5 md:p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                        {/* Photo and Other Details */}
                        <div className="flex items-start gap-4 min-w-0">

                            {/* Photo */}
                            <div className="w-14 h-14 rounded-md bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 overflow-hidden">
                                {interview.photo ? (
                                    <img
                                        src={interview.photo}
                                        alt={safe(interview.fullName)}
                                        className="w-full h-full object-cover" />
                                ) : (
                                    <span>{interview.fullName.slice(0, 2).toUpperCase()}</span>
                                )}
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl md:text-2xl font-extrabold leading-tight text-white truncate">
                                    {safe(interview.fullName)}
                                </h1>

                                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-400">
                                    <div className="flex items-center gap-2">
                                        <span className="text-purple-400 font-medium">{safe(interview.title)}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Mail size={14} className="text-purple-400" />
                                        <span className="truncate">{safe(interview.email)}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-purple-400" />
                                        <span className="truncate">{safe(interview.date)}</span>
                                    </div>
                                </div>

                                <div className="mt-3 h-0.5 w-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-400" />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-3">
                            <div className="flex items-center gap-2">
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(interview.status)}`}>
                                    {safe(interview.status)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-neutral-800 my-5" />

                    {/* Interview Details */}
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm md:text-base">
                            <div>
                                <div className="text-purple-400 font-medium">Interviewer</div>
                                <div className="text-neutral-200">{safe(interview.interviewerName)}</div>
                                <div className="mt-1 text-xs text-neutral-200 flex items-center gap-2">
                                    <Mail size={13} className="text-purple-400" /> <span>{safe(interview.interviewerEmail)}</span>
                                </div>
                            </div>

                            <div>
                                <div className="text-purple-400 font-medium">Meeting Subject</div>
                                <div className="text-neutral-200">{safe(interview.meetingSubject)}</div>

                                <div className="mt-3 text-purple-400 font-medium">Meeting Link</div>
                                <div className="text-neutral-200">{safe(<a
                                    href={interview.meetingLink || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sky-400 hover:underline text-sm">
                                    <Link size={14} className="inline-block mr-1" />
                                    {safe(interview.meetingLink)}
                                </a>
                                )}
                                </div>

                                <div className="mt-3 text-purple-400 font-medium">TI ID</div>
                                <div className="text-neutral-200 break-all">{safe(interview.tiId)}</div>
                            </div>

                            <div>
                                <div className="mt-3 text-purple-400 font-medium">No. of Round</div>
                                <div className="text-neutral-200 break-all">{safe(interview.noofRound)}</div>

                                <div className="mt-3 text-purple-400 font-medium">Rating</div>
                                <div className="text-neutral-200 break-all">{renderStars(interview.rating)}</div>

                                <div className="mt-3 text-purple-400 font-medium">Interview Result</div>
                                <div className="text-neutral-200">{safe(interview.isClear)}</div>
                            </div>
                        </div>

                        {/* Feedback */}
                        <div>
                            <div className="text-purple-400 font-semibold text-sm md:text-base mb-2">Feedback</div>
                            <div className="bg-neutral-800 border border-neutral-700 p-4 rounded text-neutral-200 text-sm md:text-base">
                                {safe(interview.feedback)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTechnicalInterview;
