import React, { useState } from "react";
import CommonNavbar from "../components/CommonNavbar";
import RecruiterSidebar from "./RecruiterSidebar";
import Footer from "../components/Footer";
import { Eye, Edit, Trash2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecruiterCandidate = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();

    const candidates = [
        {
            userId: "8723A287-BBB3-46C9-BD23-08DDAE2FEC35",
            fullName: "Preet Bhimani",
            email: "preet@gmail.com",
            phone: "9377382731",
            city: "Rajkot",
            dob: "2003-05-13",
            overallStatus: "Selected",
            isActive: "Active",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
        {
            userId: "9CF256C4-7ECA-4469-8CCE-08DD70ACE5C1",
            fullName: "Umang Paneri",
            email: "umang@gmail.com",
            phone: "9273899119",
            city: "Vadodara",
            dob: "2003-12-21",
            overallStatus: "Exam Failed",
            isActive: "Active",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
        {
            userId: "4091FDD1-2D1F-44F5-00BB-08DDB922600D",
            fullName: "Visva Antala",
            email: "visva@gmail.com",
            phone: "9102938270",
            city: "Surat",
            dob: "2003-03-15",
            overallStatus: "HR Interview Pending ",
            isActive: "Active",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
    ];

    return <div className="min-h-screen flex flex-col bg-neutral-950">
        {/* Navbar */}
        <CommonNavbar isLoggedIn={true} role="Recruiter" />

        <div className="flex flex-1">
            {/* Sidebar */}
            <RecruiterSidebar
                isCollapsed={sidebarCollapsed}
                setIsCollapsed={setSidebarCollapsed} />

            {/* Main Layout */}
            <main className={`flex-1 transition-all duration-300 text-neutral-300 ${sidebarCollapsed ? 'ml-0' : 'ml-0'}`}>
                <div className="p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-white mb-4">Manage Candidate</h1>
                        </div>

                        {/* Filter Button */}
                        <div className="flex mb-4 justify-end">
                            <button className="flex items-center gap-1 px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded text-sm">
                                <Filter size={14} /> Filters
                            </button>
                        </div>

                        {/* Candidate List */}
                        <div className="space-y-2">
                            {candidates.map((candidate) => (
                                <div
                                    key={candidate.userId}
                                    className="bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-sm hover:shadow-md transition">
                                    {/* Mobile Layout */}
                                    <div className="block md:hidden">
                                        <div className="flex items-center gap-3 mb-3">
                                            <img
                                                src={candidate.photo}
                                                alt={candidate.fullName}
                                                className="w-12 h-12 rounded-full border border-neutral-600"/>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-white text-sm">{candidate.fullName}</h3>
                                                <p className="text-xs text-neutral-400">{candidate.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-1 text-xs mb-3">
                                            <p><span className="font-medium text-purple-200">Phone:</span> {candidate.phone}</p>
                                            <p><span className="font-medium text-purple-200">City:</span> {candidate.city}</p>
                                            <p><span className="font-medium text-purple-200">DOB:</span> {candidate.dob}</p>
                                            <p><span className="font-medium text-purple-200">Over all Status:</span> {candidate.overallStatus}</p>
                                            <p>
                                                <span className="font-medium text-purple-200">Status:</span>{" "}
                                                <span className={`px-2 py-0.5 rounded text-xs ${candidate.isActive === "Active" ? "bg-emerald-800 text-emerald-200" : "bg-rose-800 text-rose-200"}`}>
                                                    {candidate.isActive}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button className="flex items-center gap-1 px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-xs flex-1 justify-center">
                                                <Eye size={14} /> View
                                            </button>
                                            <button className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs flex-1 justify-center">
                                                <Edit size={14} /> Update
                                            </button>
                                            <button className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs flex-1 justify-center">
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tablet & Desktop Layout */}
                                    <div className="hidden md:flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3 flex-1">
                                            <img
                                                src={candidate.photo}
                                                alt={candidate.fullName}
                                                className="w-10 h-10 rounded-full border border-neutral-600"/>
                                            
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-1 flex-1">
                                                <p className="lg:col-span-1"><span className="font-medium text-purple-200">Name:</span> {candidate.fullName}</p>
                                                <p className="lg:col-span-1"><span className="font-medium text-purple-200">Email:</span> {candidate.email}</p>
                                                <p className="lg:col-span-1"><span className="font-medium text-purple-200">Phone:</span> {candidate.phone}</p>
                                                <p className="lg:col-span-1"><span className="font-medium text-purple-200">City:</span> {candidate.city}</p>
                                                <p className="lg:col-span-1"><span className="font-medium text-purple-200">DOB:</span> {candidate.dob}</p>
                                                <p className="lg:col-span-1"><span className="font-medium text-purple-200">Over all Status:</span> {candidate.overallStatus}</p>
                                                <p className="lg:col-span-2">
                                                    <span className="font-medium text-purple-200">Status:</span>{" "}
                                                    <span className={`px-2 py-0.5 rounded text-xs ${candidate.isActive === "Active" ? "bg-emerald-800 text-emerald-200" : "bg-rose-800 text-rose-200"}`}>
                                                        {candidate.isActive}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 ml-4">
                                            <button className="flex items-center gap-1 px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-xs">
                                                <Eye size={14} /> View
                                            </button>
                                            <button className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs">
                                                <Edit size={14} /> Update
                                            </button>
                                            <button className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs">
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>

        {/* Footer */}
        <Footer />
    </div>;
};

export default RecruiterCandidate;
