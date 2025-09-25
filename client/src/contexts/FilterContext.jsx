import React, { createContext, useContext, useState, useMemo } from 'react';
import { useCandidates } from './CandidateContext';

const FilterContext = createContext();

export const useFilters = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
};

export const FilterProvider = ({ children }) => {
  const { candidates } = useCandidates();
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 5;

  // Filters
  const [filters, setFilters] = useState({
    overallStatus: 'all',
    jobTitle: 'all',
    dateType: 'applied',
    fromDate: '',
    toDate: ''
  });

  // Advanced Filters
  const [advancedFilters, setAdvancedFilters] = useState({
    jobApplicationStatus: 'all',
    techInterviewStatus: 'all',
    techInterviewIsClear: 'all',
    hrInterviewStatus: 'all',
    hrInterviewIsClear: 'all'
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Retrive All candidates
  const getCandidateDate = (c, type) => ({
    applied: c.appliedDate,
    exam: c.examDate,
    'tech-interview': c.techInterviewDate,
    'hr-interview': c.hrInterviewDate
  }[type]);

  // Date Range
  const checkDateRange = (d, f, t) => {
    if (!d) return true;
    const cd = new Date(d);
    const from = f ? new Date(f) : null;
    const to = t ? new Date(t) : null;
    if (from && cd < from) return false;
    if (to && cd > to) return false;
    return true;
  };

  // Filter Candiate According to Filters
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const statusMatch = filters.overallStatus === 'all' || c.overallStatus.toLowerCase() === filters.overallStatus;
      const jobMatch = filters.jobTitle === 'all' || c.jobTitle === filters.jobTitle;
      const cd = getCandidateDate(c, filters.dateType);
      const dateMatch = checkDateRange(cd, filters.fromDate, filters.toDate);

      let adv = true;
      if (showAdvancedFilters) {
        adv =
          (advancedFilters.jobApplicationStatus === 'all' || c.jobApplicationStatus === advancedFilters.jobApplicationStatus) &&
          (advancedFilters.techInterviewStatus === 'all' || c.techInterviewStatus === advancedFilters.techInterviewStatus) &&
          (advancedFilters.techInterviewIsClear === 'all' || c.techInterviewIsClear === advancedFilters.techInterviewIsClear) &&
          (advancedFilters.hrInterviewStatus === 'all' || c.hrInterviewStatus === advancedFilters.hrInterviewStatus) &&
          (advancedFilters.hrInterviewIsClear === 'all' || c.hrInterviewIsClear === advancedFilters.hrInterviewIsClear);
      }

      return statusMatch && jobMatch && dateMatch && adv;
    });
  }, [candidates, filters, advancedFilters, showAdvancedFilters]);

  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);
  const start = (currentPage - 1) * candidatesPerPage;
  const paginatedCandidates = filteredCandidates.slice(start, start + candidatesPerPage);

  const goToPage = (p) => setCurrentPage(p);

  // Clear All Filters
  const clearAllFilters = () => {
    setFilters({ overallStatus: 'all', jobTitle: 'all', dateType: 'applied', fromDate: '', toDate: '' });
    setAdvancedFilters({ jobApplicationStatus: 'all', techInterviewStatus: 'all', techInterviewIsClear: 'all', hrInterviewStatus: 'all', hrInterviewIsClear: 'all' });
    setShowAdvancedFilters(false);
    setCurrentPage(1);
  };

  const uniqueJobs = [...new Set(candidates.map((c) => c.jobTitle))];

  // Count Status Wise Candidates
  const getStatusCount = (status) => {
    if (status === 'all') return candidates.filter(c => !c.originalId).length;
    return candidates.filter(c => !c.originalId && c.overallStatus.toLowerCase() === status).length;
  };

  const value = {
    filters, setFilters,
    advancedFilters, setAdvancedFilters,
    showAdvancedFilters, setShowAdvancedFilters,
    currentPage, totalPages, goToPage, candidatesPerPage,
    filteredCandidates, paginatedCandidates, uniqueJobs,
    clearAllFilters, getStatusCount
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};
