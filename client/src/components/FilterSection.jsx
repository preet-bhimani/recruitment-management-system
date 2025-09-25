import React from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useFilters } from '../contexts/FilterContext';

const FilterSection = () => {
  const {
    filters, setFilters,
    advancedFilters, setAdvancedFilters,
    showAdvancedFilters, setShowAdvancedFilters,
    uniqueJobs, getStatusCount, clearAllFilters
  } = useFilters();

  const statusOptions = [
    { key: 'all', label: 'All' },
    { key: 'applied', label: 'Applied' },
    { key: 'exam', label: 'Exam' },
    { key: 'technical interview', label: 'Tech Interview' },
    { key: 'hr interview', label: 'HR Interview' },
    { key: 'selected', label: 'Selected' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'hold', label: 'Hold' }
  ];

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {statusOptions.map(s => (
          <button key={s.key}
            onClick={() => setFilters({ ...filters, overallStatus: s.key })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filters.overallStatus === s.key
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
            }`}>
            {s.label} ({getStatusCount(s.key)})
          </button>
        ))}
      </div>

      {/* Job Title Filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={filters.jobTitle}
          onChange={(e) => setFilters({ ...filters, jobTitle: e.target.value })}
          className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white">
          <option value="all">All Jobs</option>
          {uniqueJobs.map(j => <option key={j} value={j}>{j}</option>)}
        </select>

        {/* Date Range Filter */}
        <select
          value={filters.dateType}
          onChange={(e) => setFilters({ ...filters, dateType: e.target.value })}
          className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white">
          <option value="applied">Applied Date</option>
          <option value="exam">Exam Date</option>
          <option value="tech-interview">Tech Interview Date</option>
          <option value="hr-interview">HR Interview Date</option>
        </select>

        {/* From Dates */}
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
          className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white"
          placeholder="From"/>

        {/* To Dates */}
        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
          className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white"
          placeholder="To"/>

        {/* Filter Button */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-sm text-white transition-colors">
          <Filter size={16} /> Advanced Filters {showAdvancedFilters ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
        </button>

        {/* Clear All */}
        <button onClick={clearAllFilters} className="px-3 py-2 bg-red-700 hover:bg-red-600 rounded text-sm text-white">
          Clear All
        </button>
      </div>

      {/* Advanced Filter */}
      {showAdvancedFilters && (
        <div className="mt-4 pt-4 border-t border-neutral-700">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            
            {/* OverallStatus */}
            <select
              value={advancedFilters.jobApplicationStatus}
              onChange={(e) => setAdvancedFilters({ ...advancedFilters, jobApplicationStatus: e.target.value })}
              className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white">
              <option value="all">All App Status</option>
              <option value="Applied">Applied</option>
              <option value="Exam">Exam</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Fail">Fail</option>
            </select>

            {/* Technical Interview Status */}
            <select
              value={advancedFilters.techInterviewStatus}
              onChange={(e) => setAdvancedFilters({ ...advancedFilters, techInterviewStatus: e.target.value })}
              className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white">
              <option value="all">All Tech Status</option>
              <option value="Clear">Clear</option>
              <option value="Not Clear">Not Clear</option>
              <option value="In Progress">In Progress</option>
            </select>

            {/* Techincal Interview IsClear */}
            <select
              value={advancedFilters.techInterviewIsClear}
              onChange={(e) => setAdvancedFilters({ ...advancedFilters, techInterviewIsClear: e.target.value })}
              className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white">
              <option value="all">All Tech Clear</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Clear">Clear</option>
              <option value="Not Clear">Not Clear</option>
            </select>

            {/* HR Interview Status */}
            <select
              value={advancedFilters.hrInterviewStatus}
              onChange={(e) => setAdvancedFilters({ ...advancedFilters, hrInterviewStatus: e.target.value })}
              className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white">
              <option value="all">All HR Status</option>
              <option value="Clear">Clear</option>
              <option value="Not Clear">Not Clear</option>
              <option value="In Progress">In Progress</option>
            </select>

            {/* HR Interview IsClear */}
            <select
              value={advancedFilters.hrInterviewIsClear}
              onChange={(e) => setAdvancedFilters({ ...advancedFilters, hrInterviewIsClear: e.target.value })}
              className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white">
              <option value="all">All HR Clear</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Clear">Clear</option>
              <option value="Not Clear">Not Clear</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
