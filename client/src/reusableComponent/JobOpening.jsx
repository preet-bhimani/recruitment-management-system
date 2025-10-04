import React, { useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, Filter } from "lucide-react";
import CommonPagination, { paginate } from "./CommonPagination";

const JobOpening = ({ role = "admin" }) => {

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
        },
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
        },
        {
            joId: "8723B287-CCC3-46D9-CE23-08EEBF2GFD35",
            title: "Jr. Software Engineer",
            noOfOpening: 4,
            requiredSkills: "Asp.Net ReactJS",
            location: "Ahmedabad",
            experience: "1",
            status: "Open"
        },
    ];

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const totalItems = jobs.length;
    const pageItems = useMemo(
        () => paginate(jobs, currentPage, pageSize),
        [jobs, currentPage, pageSize]
    );

    const navigate = useNavigate();

    // Handle Roles for Add New Job Opening
    const handleAddJob = () => {
        const r = (role || "").toLowerCase();
        const to = r === "recruiter" ? "/recruiter-add-jobopening" : "/admin-add-jobopening";
        navigate(to);
    };

    return <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto w-full min-w-0">

        {/* Add New Job Opening */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:justify-end">
            <button
                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-sm w-full sm:w-auto"
                onClick={handleAddJob}>
                + Add Job Opening
            </button>
            <button className="flex items-center justify-center gap-1 px-3 py-1 bg-violet-700 hover:bg-violet-600 rounded text-sm w-full sm:w-auto">
                <Filter size={14} /> Filters
            </button>
        </div>

        <div className="space-y-2">
            {pageItems.map((job, idx) => (
                <div
                    key={`${job.joId}-${idx}`}
                    className="bg-neutral-900 border border-neutral-700 rounded-md p-3 sm:p-4 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                    <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-1 flex-1 min-w-0">
                            <p className="break-all"><span className="font-medium text-amber-200">JoId:</span> {job.joId}</p>
                            <p className="break-words"><span className="font-medium text-amber-200">Title:</span> {job.title}</p>
                            <p className="break-words"><span className="font-medium text-amber-200">No of Openings:</span> {job.noOfOpening}</p>
                            <p className="break-words"><span className="font-medium text-amber-200">Required Skills:</span> {job.requiredSkills}</p>
                            <p className="break-words"><span className="font-medium text-amber-200">Location:</span> {job.location}</p>
                            <p className="break-words"><span className="font-medium text-amber-200">Experience:</span> {job.experience}</p>
                            <p className="break-words">
                                <span className="font-medium text-amber-200">Status:</span>{" "}
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
                    <div className="flex flex-col sm:flex-row gap-2 sm:ml-4 w-full sm:w-auto">
                        <button
                            className="flex items-center gap-1 px-2 py-1 bg-sky-800 hover:bg-sky-700 rounded text-xs w-full sm:w-auto"
                            onClick={() => navigate('/admin-update-jobopening/8723B287-CCC3-46D9-CE23-08EEBF2GFD35')}>
                            <Eye size={14} /> View
                        </button>
                        <button
                            className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs w-full sm:w-auto"
                            onClick={() => navigate('/admin-update-jobopening/8723B287-CCC3-46D9-CE23-08EEBF2GFD35')}>
                            <Edit size={14} /> Update
                        </button>
                        <button className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs w-full sm:w-auto">
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>

        <CommonPagination
            totalItems={totalItems}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage} />
    </div>;
};

export default JobOpening;
