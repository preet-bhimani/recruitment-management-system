import React, { useState } from "react";
import CommonNavbar from "../components/CommonNavbar";
import Footer from "../components/Footer";
import { Calendar, Briefcase, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const MyJobs = () => {
    const [statusFilter, setStatusFilter] = useState("");

    const statusOptions = [
        "All Status",
        "Under Review",
        "Selected",
        "Rejected"
    ];


    const appliedJobs = [
        {
            joid: "8723A287-BBB3-46C9-BD23-08DDAE2FEC35",
            title: "Sr. Software Engineer",
            dateApplied: "2025-09-15",
            status: "Selected",
            city: "Ahmedabad",
            jobType: "Full time"
        },
        {
            joid: "9CF256C4-7ECA-4469-8CCE-08DD70ACE5C1",
            title: "Jr. AI Developer",
            dateApplied: "2025-09-10",
            status: "Under Review",
            city: "Mumbai",
            jobType: "Full time"
        },
        {
            joid: "4091FDD1-2D1F-44F5-00BB-08DDB922600D",
            title: "Data Scientist",
            dateApplied: "2025-09-08",
            status: "Under Review",
            city: "Mumbai",
            jobType: "Full time"
        },
        {
            joid: "8723C287-DDD3-46E9-BF23-08FFCE2HGE35",
            title: "Frontend Developer",
            dateApplied: "2025-09-05",
            status: "Rejected",
            city: "Ahmedabad",
            jobType: "Full time"
        },
        {
            joid: "5091GDD1-3D1F-55F5-11BB-08DDB933700E",
            title: "Full Stack Developer",
            dateApplied: "2025-08-28",
            status: "Under Review",
            city: "Ahmedabad",
            jobType: "Full time"
        }
    ];

    const navigate = useNavigate();

    const getStatusIcon = (status) => {
        switch (status) {
            case "Selected":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "Rejected":
                return <XCircle className="w-5 h-5 text-red-500" />;
            case "Under Review":
                return <Clock className="w-5 h-5 text-yellow-500" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-500" />;
        }
    };


    const getStatusColor = (status) => {
        switch (status) {
            case "Selected":
                return "text-green-500 bg-green-500/10 border-green-500/20";
            case "Rejected":
                return "text-red-500 bg-red-500/10 border-red-500/20";
            case "Under Review":
                return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
            default:
                return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
        }
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-neutral-950">
            {/* Navbar */}
            <CommonNavbar isLoggedIn />

            {/* Main Layout */}
            <main className="flex-1 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-4">My Jobs</h1>
                        <p className="text-neutral-400">Track job applications and their status</p>
                    </div>

                    {/* Status Filter */}
                    <div className="bg-neutral-900 rounded-lg p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-neutral-300 mb-2">Filter by Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-neutral-600 transition">
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button className="w-full px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium transition shadow-lg">
                                    Apply Filter
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Applied Jobs List */}
                    <div className="space-y-6">
                        {appliedJobs.map(job => (
                            <div key={job.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-600 transition">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                                    {/* Job Information */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4 mb-3">
                                            <div className="flex-1">
                                                <h2 className="text-2xl font-bold text-white mb-1">{job.title}</h2>
                                                <p className="text-neutral-400 mb-2">{job.company}</p>

                                                <div className="flex flex-wrap items-center gap-4 text-neutral-400">
                                                    <div className="flex items-center gap-1">
                                                        <Briefcase className="w-4 h-4" />
                                                        <span className="text-sm">{job.city}</span>
                                                    </div>
                                                    <span className="text-sm">{job.jobType}</span>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span className="text-sm">Applied: {formatDate(job.dateApplied)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status and Actions */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor(job.status)}`}>
                                            {getStatusIcon(job.status)}
                                            <span className="text-sm font-medium">{job.status}</span>
                                        </div>

                                        <button
                                            onClick={() => navigate('/job-description')}
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium transition">
                                            <Eye className="w-4 h-4" />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {appliedJobs.length === 0 && (
                        <div className="text-center py-12">
                            <Briefcase className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">You haven't applied to any jobs Yet</h3>
                            <p className="text-neutral-400 mb-6">Start applying to jobs</p>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium transition">
                                Browse Jobs
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default MyJobs;
