import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Download, Eye, Edit, Trash2 } from "lucide-react";
import CommonPagination, { paginate } from "../CommonPagination";
import axios from "axios";
import { toast } from "react-toastify";
import CommonLoader from "../../components/CommonLoader";

const TechnicalInterview = ({ role = "admin" }) => {

  const navigate = useNavigate();

  const [techin, setTechin] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTechin = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://localhost:7119/api/TechnicalInterview`);
      setTechin(res.data || []);
    }
    catch (err) {
      toast.error("Error fetching data!");
    }
    finally {
      setLoading(false);
    }
  }

  // Filters Data
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    jobTitle: "",
    noOfRoundMin: "",
    techIsClear: "",
    techStatus: "",
    dateFrom: "",
    dateTo: "",
    minRating: "",
  });

  const jobTitles = useMemo(() => Array.from(new Set(techin.map((t) => t.title))).sort(), [techin]);
  const techIsClearOptions = ["In Progress", "Clear", "Not Clear"];
  const statusOptions = ["In Progress", "Clear", "Not Clear"];

  // Filter Logic
  const filtered = useMemo(() => {
    return techin.filter((t) => {
      if (filters.jobTitle && t.title !== filters.jobTitle) return false;
      if (filters.noOfRoundMin && Number(t.noofRound) < Number(filters.noOfRoundMin)) return false;
      if (filters.techIsClear && t.techIsClear !== filters.techIsClear) return false;
      if (filters.techStatus && t.techStatus !== filters.techStatus) return false;
      if (filters.minRating && Number(t.rating) < Number(filters.minRating)) return false;
      if (filters.dateFrom) {
        const from = new Date(filters.dateFrom);
        const d = new Date(t.techDate);
        if (d < from) return false;
      }
      if (filters.dateTo) {
        const to = new Date(filters.dateTo);
        const d = new Date(t.techDate);
        if (d > to) return false;
      }
      return true;
    });
  }, [techin, filters]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const pageItems = useMemo(() => paginate(filtered, currentPage, pageSize), [filtered, currentPage, pageSize]);
  useEffect(() => {
    fetchTechin();
    setCurrentPage(1);
  }, [filters]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-end gap-3 mb-4">
        {role === "admin" && (
          <button
            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-sm"
            onClick={() => navigate("/admin-add-techinterview")}>
            + Add Tech Interview
          </button>
        )}

        {/* Filter Button */}
        <button
          className="flex items-center gap-2 px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm"
          onClick={() => setShowFilters((s) => !s)}>
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* Filters UI */}
      {showFilters && (
        <div className="mb-4 bg-neutral-900 border border-neutral-700 rounded-md p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

            {/* Job Title */}
            <div>
              <label className="block text-xs text-neutral-300 mb-1">Job Title</label>
              <select
                value={filters.jobTitle}
                onChange={(e) => setFilters((f) => ({ ...f, jobTitle: e.target.value }))}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                <option value="">All</option>
                {jobTitles.map((jt) => (
                  <option key={jt} value={jt}>
                    {jt}
                  </option>
                ))}
              </select>
            </div>

            {/* No of Rounds */}
            <div>
              <label className="block text-xs text-neutral-300 mb-1">No. of Rounds</label>
              <input
                type="number"
                min="0"
                value={filters.noOfRoundMin}
                onChange={(e) => setFilters((f) => ({ ...f, noOfRoundMin: e.target.value }))}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm" />
            </div>

            {/* TechIsClear */}
            <div>
              <label className="block text-xs text-neutral-300 mb-1">TechIsClear</label>
              <select
                value={filters.techIsClear}
                onChange={(e) => setFilters((f) => ({ ...f, techIsClear: e.target.value }))}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                <option value="">All</option>
                {techIsClearOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* TechStatus */}
            <div>
              <label className="block text-xs text-neutral-300 mb-1">techStatus</label>
              <select
                value={filters.techStatus}
                onChange={(e) => setFilters((f) => ({ ...f, techStatus: e.target.value }))}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                <option value="">All</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-xs text-neutral-300 mb-1">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm" />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-xs text-neutral-300 mb-1">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm" />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-xs text-neutral-300 mb-1">Min Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters((f) => ({ ...f, minRating: e.target.value }))}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>

          {/* Clear Button */}
          <div className="mt-3 flex gap-2 justify-end">
            <button
              className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
              onClick={() =>
                setFilters({
                  jobTitle: "",
                  noOfRoundMin: "",
                  techIsClear: "",
                  techStatus: "",
                  dateFrom: "",
                  dateTo: "",
                  minRating: "",
                })}>
              Clear
            </button>

            <button className="flex items-center gap-2 px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded text-sm">
              <Download size={14} /> Download
            </button>
          </div>
        </div>
      )}

      {/* Candidate Details */}
      {loading ? (<CommonLoader />) : (
        <div className="space-y-3">
          {pageItems.length === 0 && (
            <div className="text-center py-6 text-neutral-400">No technical interviews found.</div>
          )}

          {pageItems.map((tech) => (
            <div
              key={tech.tiId}
              className="bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">

              {/* Interview Details */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img src={tech.photo} alt={tech.fullName} className="w-14 h-14 rounded-full border border-neutral-600 flex-shrink-0" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-1 flex-1 min-w-0">
                  <p className="break-all"><span className="font-medium text-purple-300">TiId:</span> {tech.tiId}</p>
                  <p className="break-words"><span className="font-medium text-purple-300">Full Name:</span> {tech.fullName}</p>
                  <p className="break-words"><span className="font-medium text-purple-300">Title:</span> {tech.title}</p>
                  <p className="break-words"><span className="font-medium text-purple-300">Email:</span> {tech.email}</p>
                  <p className="break-words"><span className="font-medium text-purple-300">Date:</span> {tech.techDate}</p>
                  <p className="truncate"><span className="font-medium text-purple-300">No. of Rounds:</span> {tech.noOfRound}</p>

                  {/* techIsClear */}
                  <p>
                    <span className="font-medium text-purple-300">TechIsClear:</span>{" "}
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${tech.techIsClear === "Clear"
                        ? "bg-emerald-800 text-emerald-200"
                        : tech.techIsClear === "In Progress"
                          ? "bg-yellow-800 text-yellow-200"
                          : "bg-rose-800 text-rose-200"}`}>
                      {tech.techIsClear}
                    </span>
                  </p>

                  {/* TechStatus */}
                  <p>
                    <span className="font-medium text-purple-300">TechStatus:</span>{" "}
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${tech.techStatus === "Clear"
                        ? "bg-emerald-800 text-emerald-200"
                        : tech.techStatus === "In Progress"
                          ? "bg-yellow-800 text-yellow-200"
                          : "bg-rose-800 text-rose-200"}`}>
                      {tech.techStatus}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button className="flex items-center gap-1 px-2 py-1 bg-purple-800 hover:bg-purple-700 rounded text-xs" onClick={() => navigate(`/view-techinterview/${tech.tiId}`)}>
                  <Eye size={14} /> View
                </button>

                {role === "admin" && (
                  <>
                    <button className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs"
                      onClick={() => navigate(`/admin-update-techinterview/${tech.tiId}`)}>
                      <Edit size={14} /> Update
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs">
                      <Trash2 size={14} /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4">
        <CommonPagination
          totalItems={filtered.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default TechnicalInterview;
