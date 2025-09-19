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
            isClear: "Pass",
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
        }
    ]

    return <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100">
        {/* Navbar */}
        <Navbar />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            <div className="flex-1 overflow-y-auto p-4">
                <h1 className="text-2xl font-semibold mb-4 text-blue-400">Schedule Technical Interview for Candidates</h1>

                <div className="space-y-2">
                    {techin.map((tech) => (
                        <div
                            key={tech.jaId}
                            className="bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-sm hover:shadow-md transition flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3 flex-1">
                                <img
                                    src={tech.photo}
                                    alt={tech.fullName}
                                    className="w-10 h-10 rounded-full border border-neutral-600" />
                                <div className="grid grid-cols-4 gap-x-6 gap-y-1 flex-1">
                                    <p><span className="font-medium text-amber-200">JaId:</span> {tech.jaId}</p>
                                    <p><span className="font-medium text-amber-200">Full Name:</span> {tech.fullName}</p>
                                    <p><span className="font-medium text-amber-200">Title:</span> {tech.title}</p>
                                    <p><span className="font-medium text-amber-200">Email:</span> {tech.email}</p>
                                    <p><span className="font-medium text-amber-200">Interviewer Name:</span> {tech.interviewerName}</p>
                                    <p><span className="font-medium text-amber-200">Date:</span> {tech.date}</p>
                                    <p>
                                        <span className="font-medium text-amber-200">IsClear:</span>{" "}
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs ${tech.isClear === "Pass"
                                                ? "bg-emerald-800 text-emerald-200"
                                                : tech.isClear === "Wait"
                                                    ? "bg-yellow-800 text-yellow-200"
                                                    : tech.isClear === "Fail"
                                                        ? "bg-rose-800 text-rose-200"
                                                        : ""}`}>
                                            {tech.isClear}
                                        </span>
                                    </p>
                                    <div className="col-span-4">
                                        <div className="font-medium text-amber-200">Feedback:</div>                            
                                            {tech.feedback}
                                    </div>
                                </div>
                            </div>
                            {/* Bottons */}
                            <div className="flex gap-2 ml-4">
                                <button className="flex items-center gap-1 px-2 py-1 bg-sky-800 hover:bg-sky-700 rounded text-xs" onClick={() => navigate('/admin-add-meeting')}>
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
