import React, { useMemo, useState, useEffect } from 'react';
import { CheckCircle, XCircle, Calendar, Send, X, FileText } from 'lucide-react';
import { CandidateProvider, useCandidates } from '../contexts/CandidateContext';
import { UIProvider, useUI } from '../contexts/UIContext';
import CommonNavbar from '../components/CommonNavbar';
import Footer from '../components/Footer';

const ReviewerDashboardContent = () => {
  const { candidates, updateCandidate, scheduleExam } = useCandidates();
  const { getDefaultMessage } = useUI();
  const [jobTitleFilter, setJobTitleFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 5;
  const [tempStatus, setTempStatus] = useState({});
  const [tempModified, setTempModified] = useState({});
  const [messageBoxOpen, setMessageBoxOpen] = useState({});
  const [messages, setMessages] = useState({});
  const [pendingAction, setPendingAction] = useState({});
  const [examScheduleOpen, setExamScheduleOpen] = useState({});
  const [examDates, setExamDates] = useState({});
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Badge for BG Color
  const badge = (s) =>
  ({
    Applied: 'bg-yellow-600',
    Exam: 'bg-blue-600',
    'Technical Interview': 'bg-purple-600',
    'HR Interview': 'bg-pink-600',
    Selected: 'bg-green-600',
    Rejected: 'bg-red-600',
    Hold: 'bg-gray-600'
  }[s] || 'bg-yellow-600');

  // Filter Job Title
  const uniqueJobs = useMemo(() => {
    const jobs = candidates.map(c => c.title).filter(Boolean);
    return [...new Set(jobs)];
  }, [candidates]);

  // Filter Job Title Date To From
  const applicableCandidates = useMemo(() => {
    return candidates.filter(c => {
      if (jobTitleFilter !== 'all' && c.title !== jobTitleFilter) return false;
      if (fromDate && new Date(c.appliedDate) < new Date(fromDate)) return false;
      if (toDate && new Date(c.appliedDate) > new Date(toDate)) return false;

      const sf = selectedFilter;
      const overall = c.overallStatus;

      if (sf === 'All') {
        return ['Applied', 'Exam', 'Rejected', 'Hold'].includes(overall);
      }
      if (sf === 'Applied') {
        return overall === 'Applied';
      }
      if (sf === 'Exam') {
        return overall === 'Exam';
      }
      if (sf === 'Rejected') {
        return overall === 'Rejected';
      }
      if (sf === 'Hold') {
        return overall === 'Hold';
      }
      return false;
    });
  }, [candidates, jobTitleFilter, fromDate, toDate, selectedFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(applicableCandidates.length / candidatesPerPage));
  const startIndex = (currentPage - 1) * candidatesPerPage;
  const paginated = applicableCandidates.slice(startIndex, startIndex + candidatesPerPage);

  useEffect(() => setCurrentPage(1), [jobTitleFilter, fromDate, toDate, selectedFilter]);

  // Status Change Handling
  const onStatusChange = (id, value) => {
    setTempStatus(s => ({ ...s, [id]: value }));
    setTempModified(m => ({ ...m, [id]: true }));
  };

  // DropDown Change
  const onSaveStatus = (id) => {
    const candidate = candidates.find(c => c.jaId === id);
    if (!candidate) return;
    updateCandidate(id, {
      status: tempStatus[id] ?? candidate.status
    });
    setTempModified(m => ({ ...m, [id]: false }));
  };

  // So Action After Message
  const openActionModalFor = (id, actionType) => {
    setMessages(m => ({ ...m, [id]: getDefaultMessage(actionType) }));
    setMessageBoxOpen(mb => ({ ...mb, [id]: true }));
    setPendingAction(pa => ({ ...pa, [id]: actionType }));
  };

  // Cancel Action Message
  const closeActionModal = (id) => {
    setMessageBoxOpen(mb => ({ ...mb, [id]: false }));
    setMessages(m => ({ ...m, [id]: '' }));
    setPendingAction(pa => {
      const out = { ...pa };
      delete out[id];
      return out;
    });
  };

  // Send Message According to Different Buttons
  const onSendMessage = (id) => {
    const msg = (messages[id] ?? '').trim();
    const candidate = candidates.find(c => c.jaId === id);
    if (!candidate) return;
    const action = pendingAction[id];

    if (action === 'select') {
      updateCandidate(id, {
        status: 'Shortlisted',
        examDate: null,
        examResult: null,
        feedback: msg
      });
    }
    else if (action === 'reject') {
      updateCandidate(id, {
        status: 'Rejected',
        examDate: null,
        examResult: null,
        feedback: msg
      });
    }
    else if (action === 'pass') {
      updateCandidate(id, {
        status: 'Shortlisted',
        examResult: 'Pass',
        feedback: msg
      });
    }
    else if (action === 'fail') {
      updateCandidate(id, {
        status: 'Rejected',
        examResult: 'Fail',
        feedback: msg
      });
    }
    else if (action === 'hold') {
      updateCandidate(id, {
        status: 'Hold',
        feedback: msg
      });
    }
    else {
      let newStatus = candidate.status;
      let newOverall = candidate.overallStatus;

      // Change Status After Message Sent
      const m = msg.toLowerCase();
      if (newStatus === 'Applied' && m.includes('shortlist')) {
        newStatus = 'Shortlisted';
        newOverall = 'Technical Interview';
      } else if (newStatus === 'Applied' && (m.includes('not shortlisted') || m.includes('not selected') || m.includes('rejected'))) {
        newStatus = 'Rejected';
        newOverall = 'Rejected';
      } else if (newStatus === 'Exam' && m.includes('shortlist')) {
        newStatus = 'Shortlisted';
        newOverall = 'Technical Interview';
      } else if (newStatus === 'Exam' && (m.includes('not cleared') || m.includes('fail') || m.includes('not passed'))) {
        newStatus = 'Rejected';
        newOverall = 'Rejected';
      }
      updateCandidate(id, { status: newStatus, feedback: msg });
    }
    closeActionModal(id);
  };

  // Exam Schedule
  const toggleExamScheduling = (id) => {
    setExamScheduleOpen(es => ({ ...es, [id]: !es[id] }));
    const candidate = candidates.find(c => c.jaId === id);
    setExamDates(ed => ({ ...ed, [id]: candidate?.examDate ?? '' }));
  };
  const setExamDateForCandidate = (id, date) => {
    setExamDates(ed => ({ ...ed, [id]: date }));
  };
  const confirmScheduleExamForCandidate = (id) => {
    const date = examDates[id];
    if (!date) return alert('Pick a date');
    const time = '11:00 AM';
    scheduleExam(id, date);
    setExamScheduleOpen(es => ({ ...es, [id]: false }));
    setExamDates(ed => ({ ...ed, [id]: '' }));
  };

  const goToPage = (p) => {
    const np = Math.min(Math.max(1, p), totalPages);
    setCurrentPage(np);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white">

      {/* Navbar */}
      <CommonNavbar isLoggedIn={true} role="Reviewer" />

      {/* Main Layout */}
      <main className="container mx-auto px-4 py-6 flex-1">
        <h1 className="text-2xl font-semibold mb-4">Reviewer Dashboard</h1>

        {/* Filters */}
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">

            {/* Job Title */}
            <select
              className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white"
              value={jobTitleFilter}
              onChange={e => setJobTitleFilter(e.target.value)}>
              <option value="all">All Jobs</option>
              {uniqueJobs.map(j => <option key={j} value={j}>{j}</option>)}
            </select>

            {/* Date From */}
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white"
              placeholder="From" />

            {/* Date To */}
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white"
              placeholder="To" />

            {/* Overall Status Filter */}
            <div className="flex gap-2 ml-auto">
              {['All', 'Applied', 'Exam', 'Rejected', 'Hold'].map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedFilter(status)}
                  className={`px-3 py-1 rounded text-xs ${selectedFilter === status ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-white'}`}>
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Candidate Card */}
        <div className="space-y-4">
          {paginated.length === 0 ? (
            <div className="text-neutral-400">No candidates match for current filters.</div>
          ) : paginated.map(c => (
            <div key={c.jaId} className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <img src={c.photo} alt={c.fullName} className="w-12 h-12 rounded-full border border-neutral-600" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-white truncate">{c.fullName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${badge(c.overallStatus)}`}>{c.overallStatus}</span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-neutral-400">
                      <span className="truncate"><span className="text-purple-200">Email:</span> {c.email}</span>
                      <span className="truncate"><span className="text-purple-200">Job:</span> {c.title}</span>
                      <span className="truncate"><span className="text-purple-200">Phone:</span> {c.phoneNumber}</span>
                      <span className="truncate"><span className="text-purple-200">Applied:</span> {c.appliedDate}</span>
                      {c.rejectionStage && (
                        <div className="col-span-full">
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-red-900/70 text-red-200 border border-red-700">
                            Failed At: {c.rejectionStage}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons and Dropdowns */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* CV Button */}
                  <button
                    onClick={() => { }}
                    className="px-2 py-1 bg-neutral-800 text-neutral-300 border border-neutral-700 rounded text-xs flex items-center gap-1"
                    title="View CV">
                    <FileText size={14} /> CV
                  </button>

                  {/* Status */}
                  <select
                    value={tempStatus[c.jaId] ?? c.status}
                    onChange={e => onStatusChange(c.jaId, e.target.value)}
                    className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white">
                    <option>Applied</option>
                    <option>Exam</option>
                    <option>Shortlisted</option>
                    <option>Rejected</option>
                    <option>Hold</option>
                  </select>

                  {/* Save Changes After DropDown */}
                  {tempModified[c.jaId] && (
                    <button
                      onClick={() => {
                        const candidate = candidates.find(x => x.jaId === c.jaId);
                        const value = tempStatus[c.jaId] ?? candidate.status;

                        if (value === 'Hold') {
                          openActionModalFor(c.jaId, 'hold');
                        }
                        else {
                          onSaveStatus(c.jaId);
                        }
                      }}
                      className="px-2 py-1 bg-green-600 rounded text-xs text-white">
                      Save
                    </button>
                  )}

                  {/* Applied Status Candidate */}
                  {c.status.toLowerCase() === 'applied' && (
                    <>
                      <button
                        onClick={() => openActionModalFor(c.jaId, 'select')}
                        className="px-3 py-1 bg-emerald-700 rounded text-xs text-white flex items-center gap-1">
                        <CheckCircle size={14} /> Right
                      </button>
                      <button
                        onClick={() => openActionModalFor(c.jaId, 'reject')}
                        className="px-3 py-1 bg-red-800 rounded text-xs text-white flex items-center gap-1">
                        <XCircle size={14} /> Cancel
                      </button>
                      <button
                        onClick={() => toggleExamScheduling(c.jaId)}
                        className={`px-2 py-1 rounded text-xs bg-neutral-800 border border-neutral-600 flex items-center gap-1`}
                        aria-expanded={!!examScheduleOpen[c.jaId]}
                        title="Schedule exam">
                        <Calendar size={16} />
                      </button>
                    </>
                  )}

                  {/* Exam Status Candidate */}
                  {c.status.toLowerCase() === 'exam' && (
                    <>
                      <button
                        onClick={() => openActionModalFor(c.jaId, 'pass')}
                        className="px-3 py-1 bg-emerald-700 rounded text-xs text-white flex items-center gap-1">
                        <CheckCircle size={14} /> Pass
                      </button>
                      <button
                        onClick={() => openActionModalFor(c.jaId, 'fail')}
                        className="px-3 py-1 bg-red-800 rounded text-xs text-white flex items-center gap-1">
                        <XCircle size={14} /> Fail
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Schedule Pannel for Exam */}
              {examScheduleOpen[c.jaId] && (
                <div className="mt-4 bg-neutral-800 border border-neutral-700 rounded-lg p-3 flex flex-wrap items-center gap-3">
                  <label className="text-sm text-neutral-300 whitespace-nowrap">Exam Date:</label>
                  <input
                    type="date"
                    value={examDates[c.jaId] ?? ''}
                    onChange={e => setExamDateForCandidate(c.jaId, e.target.value)}
                    className="px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-sm text-white" />
                  <div className="px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-sm text-white whitespace-nowrap">
                    11:00 AM
                  </div>

                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={() => toggleExamScheduling(c.jaId)}
                      className="px-3 py-1 bg-neutral-600 rounded text-sm text-white flex items-center gap-2">
                      <X size={14} /> Cancel
                    </button>
                    <button
                      onClick={() => confirmScheduleExamForCandidate(c.jaId)}
                      className="px-3 py-1 bg-blue-600 rounded text-sm text-white">
                      Schedule
                    </button>
                  </div>
                </div>
              )}

              {/* Message Box */}
              {messageBoxOpen[c.jaId] && (
                <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-4 mt-4 w-full">
                  <textarea
                    value={messages[c.jaId] ?? ''}
                    onChange={e => setMessages(m => ({ ...m, [c.jaId]: e.target.value }))}
                    className="w-full bg-neutral-700 border border-neutral-600 rounded text-white p-3 resize-none h-20"
                    placeholder="Write message..." />
                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      onClick={() => closeActionModal(c.jaId)}
                      className="px-4 py-2 bg-neutral-600 rounded text-sm text-white flex items-center gap-2">
                      <X size={14} /> Cancel
                    </button>
                    <button
                      onClick={() => onSendMessage(c.jaId)}
                      className="px-4 py-2 bg-emerald-700 rounded text-sm text-white flex items-center gap-2">
                      <Send size={14} /> Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination UI */}
        <div className="mt-6 flex justify-center gap-3 items-center">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-neutral-800 rounded text-sm disabled:opacity-50 text-white">
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`px-3 py-1 rounded text-sm ${p === currentPage ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-white'}`}>
                {p}
              </button>
            );
          })}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-neutral-800 rounded text-sm disabled:opacity-50 text-white">
            Next
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const ReviewerDashboard = () => (
  <CandidateProvider>
    <UIProvider>
      <ReviewerDashboardContent />
    </UIProvider>
  </CandidateProvider>
);

export default ReviewerDashboard;
