import React, { useEffect, useState, useMemo } from "react";
import CommonNavbar from "../components/CommonNavbar";
import Footer from "../components/Footer";
import { MapPin, Briefcase, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";
import UploadDocumentPopup from "./UploadDocumentPopup ";

const CandidateDashboard = () => {

  const [jobs, setJobs] = useState([]);
  const [hasPendingDocuments, setHasPendingDocuments] = useState(false);
  const [pendingJAId, setPendingJAId] = useState(null);
  const [pendingList, setPendingList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
      const res = await axios.get(`https://localhost:7119/api/JobOpening/jobopen`)
      setJobs(res.data || []);
    }
    catch (err) {
      toast.error("Error to fectch jobs!")
    }
  }

  // Fetch Pending Documents
  const fetchPendingDocuments = async () => {
    try {
      const res = await axios.get(`https://localhost:7119/api/Candidate/pending`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (res.data && res.data.length > 0) {
        setHasPendingDocuments(true);
        setPendingList(res.data);

        if (res.data.length === 1) {
          setPendingJAId(res.data[0].jaId);
        } else {
          setPendingJAId(null);
        }
      }
    } catch (err) {
      toast.error("Error fetching pending documents!");
    }
  };

  const [filters, setFilters] = useState({
    city: "",
    experience: "",
    jobType: "",
  });

  // Static Options
  const uniqueLocations = ["Location", ...Array.from(new Set(jobs.map(job => job.location).filter(Boolean)))];

  const jobTypeOptions = ["Full time job", "Internship"];
  const experienceLevels = ["Experience", "0", "1+", "2+", "3+", "5+", "7+", "10+"];

  // Filters Logic
  const filteredJobs = useMemo(() => {
    const expMin = filters.experience && filters.experience !== "Experience"
      ? parseInt(String(filters.experience).replace("+", ""), 10)
      : null;

    return jobs.filter((job) => {
      const byLocation =
        filters.city && filters.city !== "Location" ? job.location === filters.city : true;

      const byExperience =
        expMin !== null && !Number.isNaN(expMin) ? Number(job.experience) >= expMin : true;

      const byJobType =
        filters.jobType ? job.jobType === filters.jobType : true;

      return byLocation && byExperience && byJobType;
    });
  }, [jobs, filters]);

  useEffect(() => {
    fetchJobs();
    fetchPendingDocuments();
  }, [])

  const navigate = useNavigate();

  return <div className="min-h-screen flex flex-col bg-neutral-950">
    {/* Navbar */}
    <CommonNavbar hasPendingDocuments={hasPendingDocuments} pendingJAId={pendingJAId} openUploadPopup={() => setShowPopup(true)} />


    {/* Main Layout */}
    <main className="flex-1 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Wanna Join Us</h1>
          <p className="text-neutral-400">Find Your Next Opportuinty</p>
        </div>

        {/* Filters */}
        <div className="bg-neutral-900 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Location</label>
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white">
                {uniqueLocations.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Experience Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Experience</label>
              <select
                value={filters.experience}
                onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white">
                {experienceLevels.map(exp => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Job Type</label>
              <select
                value={filters.jobType}
                onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white">
                <option value="">Job Type</option>
                {jobTypeOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-600 transition">

              {/* Job Details */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{job.title}</h2>
                  <div className="flex items-center gap-4 text-neutral-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <span className="text-sm">{job.jobType}</span>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">Experience: {job.experience}+ years</span>
                    </div>
                  </div>
                </div>

                {/* View Job Button */}
                <button
                  onClick={() => navigate(`/job-description/${job.joId}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium transition ml-4">
                  <Plus className="w-4 h-4" />
                  View Job
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>

    {/* Show Pop up */}
    {showPopup && (
      <UploadDocumentPopup
        pendingList={pendingList}
        onClose={() => setShowPopup(false)}
        onSelect={(item) => {
          setShowPopup(false);
          navigate(`/upload-documents/${item.jaId}`);
        }} />
    )}

    {/* Footer */}
    <Footer />
  </div>;
};

export default CandidateDashboard;
