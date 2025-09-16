import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Plus, Filter } from "lucide-react";

const AdminDocuments = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const document = [
        {
            DLId: "9282A458-JBC1-42D9-E158-30FGHI1JKL59",
            fullName: "Preet Bhimani",
            title: "Jr. Software Developer",
            email: "preet@gmail.com",
            status: "Completed",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
        {
            DLId: "1203M590-NOB8-94P5-QR78-21STUV3QWX86",
            fullName: "Kush Vadodariya",
            title: " Jr. Data Analyst",
            email: "kush@gamil.com",
            status: "Pending",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
        {
            DLId: "3021Y095-ZAB9-49B6-CD87-12EFGH4IJZ68",
            fullName: "Aadil Parmar",
            title: " Sr. Quality Analyst",
            email: "aadil@gamil.com",
            status: "Pending",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
        {
            DLId: "2103K580-LMB4-38N6-OP08-01QRST3UVZ01",
            fullName: "Nehal Padhiyar",
            title: " Jr. HR",
            email: "nehal@gamil.com",
            status: "Completed",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
    ]

    const navigate = useNavigate();

    return <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100">
        {/* Navbar */}
        <Navbar />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            <div className="flex-1 overflow-y-auto p-4">
                <h1 className="text-2xl font-semibold mb-4 text-blue-400">Admin Document List</h1>

                {/* Filter */}
                <div className="flex gap-3 mb-4 justify-end">
                    <button className="flex items-center gap-1 px-3 py-1 bg-violet-700 hover:bg-violet-600 rounded text-sm" >
                        <Filter size={14} /> Filters
                    </button>
                </div>
                
                <div className="space-y-2">
                    {document.map((sel) => (
                        <div
                            key={sel.DLId}
                            className="bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-sm hover:shadow-md transition flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3 flex-1">
                                <img
                                    src={sel.photo}
                                    alt={sel.fullName}
                                    className="w-10 h-10 rounded-full border border-neutral-600" />
                                <div className="grid grid-cols-4 gap-x-6 gap-y-1 flex-1">
                                    <p><span className="font-medium text-amber-200">Document Id:</span> {sel.DLId}</p>
                                    <p><span className="font-medium text-amber-200">Full Name:</span> {sel.fullName}</p>
                                    <p><span className="font-medium text-amber-200">Title:</span> {sel.title}</p>
                                    <p><span className="font-medium text-amber-200">Email:</span> {sel.email}</p>
                                    <p>
                                        <span className="font-medium text-amber-200">Status:</span>{" "}
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs ${sel.status === "Completed"
                                                ? "bg-emerald-800 text-emerald-200"
                                                : "bg-yellow-800 text-yellow-200"
                                                }`}>
                                            {sel.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            {/* Bottons */}
                            <div className="flex gap-2 ml-4">
                                {sel.status === "Pending" && (
                                    <button className="flex items-center gap-1 px-2 py-1 bg-green-800 hover:bg-green-700 rounded text-xs" onClick={() => navigate('/admin-add-document')}>
                                        <Plus size={14} /> Add
                                    </button>
                                )}
                                <button className="flex items-center gap-1 px-2 py-1 bg-sky-800 hover:bg-sky-700 rounded text-xs" onClick={() => navigate('/admin-update-document')}>
                                    <Eye size={14} /> View
                                </button>
                                <button className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs" onClick={() => navigate('/admin-update-document')}>
                                    <Edit size={14} /> Update
                                </button>
                                <button className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>;
};

export default AdminDocuments;
