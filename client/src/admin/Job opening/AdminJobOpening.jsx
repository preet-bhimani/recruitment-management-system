import Reac, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../Sidebar";
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2 } from "lucide-react";

const AdminJobOpening = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const jobs = [
        {
            joId: "8723B287-CCC3-46D9-CE23-08EEBF2GFD35",
            title: "Jr. Software Engineer",
            noOfOpening: 4,
            requiredSkills: "Asp.Net ReactJS",
            location: "Ahmedabad",
            experience: "1",
            status: "Open"
        },
        {
            joId: "8723C287-DDD3-46E9-BF23-08FFCE2HGE35",
            title: "Sr. AI Engineer",
            noOfOpening: 2,
            requiredSkills: "Pyhton Sklearn GenAI PyTorch",
            location: "Ahmedabad",
            experience: "7",
            status: "Open"
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
                <h1 className="text-xl font-semibold mb-4">Admin Job Opening</h1>

                {/* Add New Job Opening */}
                <div className="flex gap-3 mb-4 justify-end">
                    <button className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-sm" onClick={() => navigate("/admin-add-jobopening")}>
                        + Add Job Opening
                    </button>
                </div>

                <div className="space-y-2">
                    {jobs.map((job) => (
                        <div
                            key={job.joId}
                            className="bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-sm hover:shadow-md transition flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="grid grid-cols-4 gap-x-6 gap-y-1 flex-1">
                                    <p><span className="font-medium">ID:</span> {job.joId}</p>
                                    <p><span className="font-medium">Title:</span> {job.title}</p>
                                    <p><span className="font-medium">No of Openings:</span> {job.noOfOpening}</p>
                                    <p><span className="font-medium">Required Skills:</span> {job.requiredSkills}</p>
                                    <p><span className="font-medium">Location:</span> {job.location}</p>
                                    <p><span className="font-medium">Experience:</span> {job.experience}</p>
                                    <p>
                                        <span className="font-medium">Status:</span>{" "}
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs ${job.status === "Open"
                                                ? "bg-emerald-800 text-emerald-200"
                                                : "bg-rose-800 text-rose-200"}`}>
                                            {job.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            {/* Bottons */}
                            <div className="flex gap-2 ml-4">
                                <button className="flex items-center gap-1 px-2 py-1 bg-sky-800 hover:bg-sky-700 rounded text-xs" onClick={() => navigate('/admin-user-update/8723A287-BBB3-46C9-BD23-08DDAE2FEC35')}>
                                    <Eye size={14} /> View
                                </button>
                                <button className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs" onClick={() => navigate('/admin-user-update/8723A287-BBB3-46C9-BD23-08DDAE2FEC35')}>
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

export default AdminJobOpening;
