import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { Eye, Edit, Trash2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminCampusDrive = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const campusdrive = [
        {
            cdId: "9834B398-CCC4-57D0-CE34-19EEBF3GFD46",
            joId: "8723B287-CCC3-46D9-CE23-08EEBF2GFD35",
            universityName: "RK University",
            DriveDate: "2025-07-16",
        },
        {
            cdId: "9834C398-DDD4-57E0-BF34-19FFCE3HGE46",
            joId: "8723C287-DDD3-46E9-BF23-08FFCE2HGE35",
            universityName: "MS University",
            DriveDate: "2025-04-20",
        }
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
                <h1 className="text-2xl font-semibold mb-4 text-blue-400">Admin Campus Drive</h1>

                {/* Add New Campus Drive */}
                <div className="flex gap-3 mb-4 justify-end">
                    <button className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-sm" onClick={() => navigate("/admin-add-campusdrive")}>
                        + Add Campus Drive
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 bg-violet-700 hover:bg-violet-600 rounded text-sm" >
                        <Filter size={14} /> Filters
                    </button>
                </div>

                <div className="space-y-2">
                    {campusdrive.map((cd) => (
                        <div
                            key={cd.cdId}
                            className="bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-sm hover:shadow-md transition flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="grid grid-cols-4 gap-x-6 gap-y-1 flex-1">
                                    <p><span className="font-medium text-amber-200">CDId:</span> {cd.cdId}</p>
                                    <p><span className="font-medium text-amber-200">JoId:</span> {cd.joId}</p>
                                    <p><span className="font-medium text-amber-200">University Name:</span> {cd.universityName}</p>
                                    <p><span className="font-medium text-amber-200">Drive Date:</span> {cd.DriveDate}</p>
                                </div>
                            </div>
                            {/* Bottons */}
                            <div className="flex gap-2 ml-4">
                                <button className="flex items-center gap-1 px-2 py-1 bg-sky-800 hover:bg-sky-700 rounded text-xs" onClick={() => navigate('/admin-update-campusdrive')}>
                                    <Eye size={14} /> View
                                </button>
                                <button className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs" onClick={() => navigate('/admin-update-campusdrive')}>
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

export default AdminCampusDrive;
