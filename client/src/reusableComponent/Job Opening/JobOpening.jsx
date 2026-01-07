import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, Filter, Download } from "lucide-react";
import CommonPagination, { paginate } from "../CommonPagination";
import axios from "axios";
import { toast } from "react-toastify";
import CommonLoader from "../../components/CommonLoader";
import * as XLSX from "xlsx";
import axiosInstance from "../../routes/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";

const JobOpening = () => {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { role } = useAuth();

  // Fetch Job Opening Data
  const fetchJobOpening = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`JobOpening`)
      setJobs(res.data || []);
    }
    catch (err) {
      toast.error("Failed to load job opening data!")
    }
    finally {
      setLoading(false);
    }
  }

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    experience: "",
    jobType: "",
    status: "",
    noOfOpening: "",
  });

  const titleOptions = useMemo(() => Array.from(new Set(jobs.map(j => j.title))).filter(Boolean).sort(), [jobs]);
  const locationOptions = useMemo(() => Array.from(new Set(jobs.map(j => j.location))).filter(Boolean).sort(), [jobs]);

  const statusOptions = ["Open", "Close", "Hold"];
  const jobTypeOptions = ["Full time job", "Internship"];
  const experienceOptions = ["0", "1+", "2+", "3+", "5+", "7+", "10+"];
  const openingOptions = ["3+", "5+", "10+", "25+", "50+"];

  // Filters Logic
  const filteredJobs = useMemo(() => {
    const expMin = filters.experience ? parseInt(String(filters.experience).replace("+", ""), 10) : null;
    const openMin = filters.noOfOpening ? parseInt(String(filters.noOfOpening).replace("+", ""), 10) : null;

    return jobs.filter((j) => {
      const byTitle = filters.title ? j.title === filters.title : true;
      const byLocation = filters.location ? j.location === filters.location : true;
      const byExperience = expMin !== null && !Number.isNaN(expMin) ? Number(j.experience) >= expMin : true;
      const byJobType = filters.jobType ? j.jobType === filters.jobType : true;
      const byStatus = filters.status ? j.status === filters.status : true;
      const byNoOfOpening = openMin !== null && !Number.isNaN(openMin) ? Number(j.noOfOpening) >= openMin : true;
      return byTitle && byLocation && byExperience && byJobType && byStatus && byNoOfOpening;
    });
  }, [jobs, filters]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalItems = filteredJobs.length;
  const pageItems = useMemo(
    () => paginate(filteredJobs, currentPage, pageSize),
    [filteredJobs, currentPage, pageSize]
  );

  const navigate = useNavigate();

  // Role Based Access
  const r = role
  const isViewer = r === "Viewer";

  const handleAddJob = () => {
    const to = r === "Recruiter" ? "/recruiter-add-jobopening" : "/admin-add-jobopening";
    navigate(to);
  };

  const handleUpdate = (id) => {
    const to = r === "Recruiter" ? `/recruiter-update-jobopening/${id}` : `/admin-update-jobopening/${id}`;
    navigate(to);
  };

  // Delete or Closed Job Opening Logic
  const handleDelete = async (joId) => {
    const confirmDelete = window.confirm("Are you sure you want to closed the job opening ?");
    if (!confirmDelete) return;
    try {
      await axiosInstance.delete(`JobOpening/delete/${joId}`)
      toast.success("Job opening closed Successfully!");
      await fetchJobOpening();
    }
    catch (err) {
      toast.error(err.response?.data || "Failed to closed job opening")
    }
  }

  useEffect(() => {
    fetchJobOpening();
  }, []);

  // Export Excel File
  const handleExport = () => {
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(filteredJobs);

    XLSX.utils.book_append_sheet(wb, ws, "Job Opening");

    XLSX.writeFile(wb, "Job Opening.xlsx");
  }

  return <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 max-w-7xl mx.auto w-full min-w-0">

    {/* Main Layout */}
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:justify-end">
      {!isViewer && (
        <button
          className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-sm w-full sm:w-auto"
          onClick={handleAddJob}>
          + Add Job Opening
        </button>
      )}
      <button
        className="flex items-center justify-center gap-1 px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm w-full sm:w-auto"
        onClick={() => setShowFilters((prev) => !prev)}>
        <Filter size={14} /> Filters
      </button>
    </div>

    {/* Filter UI */}
    {showFilters && (
      <div className="mb-4 bg-neutral-900 border border-neutral-700 rounded-md p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

          {/* Title */}
          <select
            value={filters.title}
            onChange={(e) => setFilters((f) => ({ ...f, title: e.target.value }))}
            className="bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
            <option value="">All titles</option>
            {titleOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Location */}
          <select
            value={filters.location}
            onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
            className="bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
            <option value="">All locations</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Experience */}
          <select
            value={filters.experience}
            onChange={(e) => setFilters((f) => ({ ...f, experience: e.target.value }))}
            className="bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
            <option value="">Any experience</option>
            {experienceOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          {/* Job Type */}
          <select
            value={filters.jobType}
            onChange={(e) => setFilters((f) => ({ ...f, jobType: e.target.value }))}
            className="bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
            <option value="">All types</option>
            {jobTypeOptions.map((jt) => (
              <option key={jt} value={jt}>{jt}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
            <option value="">All status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* No. of Openings */}
          <select
            value={filters.noOfOpening}
            onChange={(e) => setFilters((f) => ({ ...f, noOfOpening: e.target.value }))}
            className="bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
            <option value="">Any openings</option>
            {openingOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="mt-3 flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
            onClick={() => setFilters({
              title: "", location: "", experience: "", jobType: "", status: "", noOfOpening: ""
            })}>
            Clear
          </button>
          <button className="flex items-center gap-2 px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded text-sm" onClick={handleExport}>
            <Download size={14} /> Download
          </button>
        </div>
      </div>
    )}

    {/* Card View Data */}
    {loading ? (
      <CommonLoader />
    ) : pageItems.length === 0 ? (
      <div className="text-center text-lg font-semibold">No job openings found</div>
    ) : (
      <div className="space-y-2">
        {pageItems.map((job, idx) => (
          <div
            key={`${job.joId}-${idx}`}
            className="bg-neutral-900 border border-neutral-700 rounded-md p-3 sm:p-4 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
            <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-1 flex-1 min-w-0">
                <p className="break-all"><span className="font-medium text-purple-300">JoId:</span> {job.joId}</p>
                <p className="break-words"><span className="font-medium text-purple-300">Title:</span> {job.title}</p>
                <p className="break-words"><span className="font-medium text-purple-300">No of Openings:</span> {job.noOfOpening}</p>
                <p className="break-words"><span className="font-medium text-purple-300">Location:</span> {job.location}</p>
                <p className="break-words"><span className="font-medium text-purple-300">Experience:</span> {job.experience}</p>
                <p className="break-words">
                  <span className="font-medium text-purple-200">Status:</span>{" "}
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${job.status === "Open"
                      ? "bg-emerald-800 text-emerald-200"
                      : "bg-rose-800 text-rose-200"}`}>
                    {job.status}
                  </span>
                </p>
              </div>
            </div>

            {/* View Button */}
            <div className="flex flex-col sm:flex-row gap-2 sm:ml-4 w-full sm:w-auto">
              <button
                className="flex items-center gap-1 px-2 py-1 bg-purple-800 hover:bg-purple-700 rounded text-xs w-full sm:w-auto"
                onClick={() => navigate(`/view-jobopening/${job.joId}`)}>
                <Eye size={14} /> View
              </button>

              {/* Update & Delete Button */}
              {!isViewer && (
                <>
                  <button
                    className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs w-full sm:w-auto"
                    onClick={() => handleUpdate(job.joId)}>
                    <Edit size={14} /> Update
                  </button>
                  {job.status !== "Closed" && (
                    <button className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs w-full sm:w-auto"
                      onClick={() => handleDelete(job.joId)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
    <CommonPagination
      totalItems={totalItems}
      pageSize={pageSize}
      currentPage={currentPage}
      onPageChange={setCurrentPage} />
  </div>;
};

export default JobOpening;
