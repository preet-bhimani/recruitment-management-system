import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { Plus } from "lucide-react";
import CommonLoader from "../../components/CommonLoader";

function ShowAddCampusDrive() {

    const [jobs, SetJobs] = useState([]);
    const navigate = useNavigate();
    const { role } = useAuth();
    const [loading, setLoading] = useState(false);

    // Fetch Jobs Pending for Campus Drive
    const fetchJobsPendingForCampusDrive = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`https://localhost:7119/api/CampusDrive/add-campus`)
            SetJobs(res.data || []);
        }
        catch (err) {
            toast.error("Failed to fetch jobs data!");
        }
        finally {
            setLoading(false);
        }
    }

    // Navigation
    const handleAddCampusDrive = (joId) => {
        if (role == "Admin") {
            navigate(`/admin-add-campusdrive/${joId}`)
        }
        else if (role == "Recruiter") {
            navigate(`/recruiter-add-campusdrive/${joId}`)
        }
    }

    useEffect(() => {
        fetchJobsPendingForCampusDrive();
    }, []);

    return <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100">

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Schedule Campus Drive</h1>
            </div>

            {/* Candidates Details */}
            {loading ? (<CommonLoader />) : (
                <div className="space-y-4">
                    {jobs.length === 0 && (
                        <div className="text-center py-6 text-neutral-300 border border-neutral-700 rounded-md bg-neutral-900">
                            No Jobs found.
                        </div>
                    )}
                    {jobs.map((job) => (
                        <div
                            key={job.joId}
                            className="bg-neutral-900 border border-neutral-700 rounded-md p-3 md:p-4 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center md:justify-between text-sm gap-4">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 flex-1">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 flex-1 text-xs md:text-sm">
                                    <p><span className="font-medium text-purple-300">JOID:</span> {job.joId}</p>
                                    <p><span className="font-medium text-purple-300">Title:</span> {job.title}</p>
                                    <p><span className="font-medium text-purple-300">Location:</span> {job.location}</p>
                                    <p><span className="font-medium text-purple-300">Experience:</span> {job.experience}</p>
                                </div>
                            </div>

                            {/* Schedule Button */}
                            <div className="flex gap-2 mt-3 md:mt-0 md:ml-4 flex-shrink-0">
                                <button
                                    className="flex items-center gap-1 px-2 py-1 bg-purple-800 hover:bg-purple-700 rounded text-xs w-full md:w-auto justify-center"
                                    onClick={() => handleAddCampusDrive(job.joId)}>
                                    <Plus size={14} /> Add Campus Drive
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>;
}

export default ShowAddCampusDrive;
