import React, { useState } from "react";
import { MapPin, ArrowLeft, Mail, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewJobApplication = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  const [jobApp] = useState({
    jaId: "9834C398-DDD4-57E0-BF34-19FFCE3HGE46",
    photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
    candidateName: "Paras Bhut",
    email: "paras@gmail.com",
    jobTitle: "Sr. AI Engineer",
    appliedDate: "2025-02-27",
    examDate: "2025-03-04",
    examResult: "Fail",
    comment: "Your Exam Date is 16/07/2025. You will receive mail regarding ID and password with exam portal link.",
    feedback: "Congratulations!!! You are now shortlisted for the interview. The other information will be shared with you soon.",
    status: "Rejected",
    overallStatus: "Rejected",
  });

  const [expanded, setExpanded] = useState(false);
  const [feedbackexpand, setFeedbackexpand] = useState(false);

  const badgeColor = (overallStatus) =>
  ({
    Applied: "bg-yellow-600",
    Exam: "bg-blue-600",
    "Technical Interview": "bg-purple-600",
    "HR Interview": "bg-pink-600",
    Selected: "bg-green-600",
    Rejected: "bg-red-600",
    Hold: "bg-gray-600",
    Shortlisted: "bg-indigo-600",
  }[overallStatus] || "bg-gray-600");

  const safe = (value) => (value ? value : "-");

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
      <div className="w-full max-w-4xl relative">
        <div className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-5 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            
            {/* Candidate Photo and Name */}
            <div className="flex items-start gap-4 min-w-0">
              <img
                src={safe(jobApp.photo)}
                alt={safe(jobApp.candidateName)}
                className="w-14 h-14 md:w-18 md:h-18 w-18 rounded-md object-cover border border-neutral-700 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-extrabold leading-tight text-white truncate">
                  {safe(jobApp.candidateName)}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-400">
                  <span className="flex items-center gap-1 ">
                    <Mail size={14} className="text-purple-400" /> {safe(jobApp.email)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} className="text-purple-400" />
                    Applied: {safe(jobApp.appliedDate)}
                  </span>
                  Exam Date: {safe(jobApp.examDate)}
                </div>
                <div className="mt-3 h-0.5 w-20 rounded-full bg-gradient-to-r from-purple-500 to-indigo-400" />
              </div>
            </div>

            {/* Overall Status */}
            <div className="w-full md:w-auto flex justify-center md:justify-end">
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor(jobApp.overallStatus)}`}>
                {safe(jobApp.overallStatus)}
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-800 my-5" />

          {/* Job Application Details */}
          <div className="space-y-5">

            {/* Job Title and Result */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm md:text-base">
              <div>
                <div className="text-purple-400 font-medium">Job Title</div>
                <div className="text-neutral-200">{safe(jobApp.jobTitle)}</div>
              </div>
              <div>
                <div className="text-purple-400 font-medium">Exam Result</div>
                <div className="text-neutral-200">{safe(jobApp.examResult)}</div>
              </div>
              <div>
                <div className="text-purple-400 font-medium">Status</div>
                <div className="text-neutral-200">{safe(jobApp.status)}</div>
              </div>
            </div>

            {/* Comment */}
            <div>
              <div className="flex items-center justify-between">
                <div className="text-purple-400 font-semibold text-sm md:text-base">Comment</div>
                <button
                  onClick={() => setExpanded((prev) => !prev)}
                  className="text-xs text-neutral-400 hover:text-neutral-200"
                  aria-expanded={expanded}>
                  {expanded ? "Collapse" : "Expand"}
                </button>
              </div>
              <p className="mt-2 text-sm md:text-base text-neutral-300 leading-relaxed">
                {jobApp.comment
                  ? expanded
                    ? jobApp.comment
                    : `${jobApp.comment.slice(0, 150)}${jobApp.comment.length > 150 ? "…" : ""}`
                  : "-"}
              </p>
            </div>

            {/* Feedback */}
            <div>
              <div className="flex items-center justify-between">
                <div className="text-purple-400 font-semibold text-sm md:text-base">Feedback</div>
                <button
                  onClick={() => setFeedbackexpand((prev) => !prev)}
                  className="text-xs text-neutral-400 hover:text-neutral-200"
                  aria-expanded={feedbackexpand}>
                  {feedbackexpand ? "Collapse" : "Expand"}
                </button>
              </div>
              <p className="mt-2 text-sm md:text-base text-neutral-300 leading-relaxed">
                {jobApp.feedback
                  ? feedbackexpand
                    ? jobApp.feedback
                    : `${jobApp.feedback.slice(0, 150)}${jobApp.feedback.length > 150 ? "…" : ""}`
                  : "-"}
              </p>
            </div>

            {/* Job Application ID */}
            <div className="border-t border-neutral-800 my-4" />
            <div className="text-xs md:text-sm text-neutral-400">
              <div className="text-purple-400 font-medium">Job Application ID</div>
              <div className="text-neutral-200 break-all">{safe(jobApp.jaId)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewJobApplication;
