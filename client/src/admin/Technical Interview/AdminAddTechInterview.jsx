import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const AdminAddTechInterview = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const navigate = useNavigate();

    const techin = [
        {
            jaId: "9282H458-JAK1-42N9-WO58-30KZMN1EPL589",
            fullName: "Preet Bhimani",
            title: "Jr. Software Developer",
            email: "preet@gmail.com",
            isClear: "Clear",
            interviewerName: "Paresh Tanna",
            date: "2024-09-14",
            feedback: "Congratulation!!! You completed first round. Now prepare for next round",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
        {
            jaId: "0192R489-HFB7-83B4-DJ67-10URDK2QLZ75",
            fullName: "Ronak Jalalji",
            title: "Sr. Cloud Engineer",
            email: "ronak@gamil.com",
            isClear: null,
            interviewerName: null,
            date: null,
            feedback: null,
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
    ];

    return <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100">

        {/* Navbar */}
        <Navbar />
        <div className="flex flex-1 overflow-hidden">

            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Schedule Technical Interview</h1>
                </div>

                {/* Candidates Details */}
                <div className="space-y-4">
                    {techin.map((tech) => (
                        <div
                            key={tech.jaId}
                            className="bg-neutral-900 border border-neutral-700 rounded-md p-3 md:p-4 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center md:justify-between text-sm gap-4">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 flex-1">
                                <img
                                    src={tech.photo}
                                    alt={tech.fullName}
                                    className="w-14 h-14 rounded-full border border-neutral-600 flex-shrink-0" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 flex-1 text-xs md:text-sm">
                                    <p><span className="font-medium text-purple-300">JaId:</span> {tech.jaId}</p>
                                    <p><span className="font-medium text-purple-300">Full Name:</span> {tech.fullName}</p>
                                    <p><span className="font-medium text-purple-300">Title:</span> {tech.title}</p>
                                    <p><span className="font-medium text-purple-300">Email:</span> {tech.email}</p>
                                    <p><span className="font-medium text-purple-300">Interviewer Name:</span> {tech.interviewerName || "-"}</p>
                                    <p><span className="font-medium text-purple-300">Date:</span> {tech.date || "-"}</p>
                                    <p>
                                        <span className="font-medium text-purple-300">IsClear:</span>{" "}
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs ${tech.isClear === "clear"
                                                ? "bg-emerald-800 text-emerald-200"
                                                : tech.isClear === "In Progress"
                                                    ? "bg-yellow-800 text-yellow-200"
                                                    : "bg-rose-800 text-rose-200"}`}>
                                            {tech.isClear || "-"}
                                        </span>
                                    </p>
                                    <div className="col-span-1 sm:col-span-2 md:col-span-4">
                                        <div className="font-medium text-purple-300">Feedback:</div>
                                        <div className="text-neutral-200">{tech.feedback || "-"}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Button */}
                            <div className="flex gap-2 mt-3 md:mt-0 md:ml-4 flex-shrink-0">
                                <button
                                    className="flex items-center gap-1 px-2 py-1 bg-purple-800 hover:bg-purple-700 rounded text-xs w-full md:w-auto justify-center"
                                    onClick={() => navigate("/admin-add-meeting")}>
                                    <Plus size={14} /> Schedule Meeting
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>;
};

export default AdminAddTechInterview;
