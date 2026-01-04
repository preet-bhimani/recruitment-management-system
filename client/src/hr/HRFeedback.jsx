import React, { useMemo, useState, useEffect } from 'react';
import { CheckCircle, XCircle, FileText, Download } from 'lucide-react';
import { CandidateProvider, useCandidates } from '../contexts/CandidateContext';
import { UIProvider, useUI } from '../contexts/UIContext';
import CommonNavbar from '../components/CommonNavbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as XLSX from "xlsx";

const ITEMS_PER_PAGE = 5;

// Star Button UI Style
const Star = ({ filled, onClick, onMouseEnter, onMouseLeave, size = 20 }) => (
  <button
    type="button"
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className="inline-block"
    aria-label={filled ? 'filled star' : 'empty star'}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-yellow-400">
      <path d="M12 .587l3.668 7.431L23.6 9.75l-5.6 5.456L19.335 24 12 19.897 4.665 24 6 15.206 0.4 9.75l7.932-1.732z" />
    </svg>
  </button>
);

const HRFeedbackContent = () => {
  const { candidates, getLatestRound, getRoundCount, updateHRInterview } = useCandidates();
  const { getDefaultMessage } = useUI();
  const navigate = useNavigate();
  const [jobTitleFilter, setJobTitleFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [messageBoxOpen, setMessageBoxOpen] = useState({});
  const [messages, setMessages] = useState({});
  const [pendingAction, setPendingAction] = useState({});
  const [ratingOpen, setRatingOpen] = useState({});
  const [ratings, setRatings] = useState({});
  const [hoverRating, setHoverRating] = useState({});

  // Badge Colors
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

  const uniqueJobs = useMemo(() => [...new Set(candidates.map(c => c.title).filter(Boolean))], [candidates]);

  // Filter by Overall Status
  const filtered = useMemo(() => {
    return candidates.filter(c => {
      if (jobTitleFilter !== 'all' && c.title !== jobTitleFilter) return false;
      if (fromDate && new Date(c.appliedDate) < new Date(fromDate)) return false;
      if (toDate && new Date(c.appliedDate) > new Date(toDate)) return false;

      const latestHR = getLatestRound(c, 'hr');
      const overall = c.overallStatus;
      if (selectedFilter === 'All') {
        return [
          'HR Interview',
          'Selected',
          'Hold',
          'Rejected',
          'Document Pending',
          'Document Verification',
          "Rejected Background Verification",
          'Clear',
          'HR Reject'
        ].includes(overall);
      }

      if (selectedFilter === 'HR Interview')
        return latestHR?.IsClear === "In Progress" && overall === 'HR Interview';

      if (selectedFilter === 'Clear')
        return latestHR?.IsClear === "Clear" && latestHR?.Status === "In Progress";

      if (selectedFilter === 'HR Reject')
        return latestHR?.Status === "Not Clear";

      if (selectedFilter === 'Document Pending')
        return overall === "Document Pending";

      if (selectedFilter === 'Document Verification')
        return overall === "Document Verification";

      if (selectedFilter === 'Rejected Background Verification')
        return overall === "Rejected" && c.rejectionStage === "Background Verification";

      if (selectedFilter === 'Hold')
        return overall === "Hold";

      return false;
    });
  }, [candidates, jobTitleFilter, fromDate, toDate, selectedFilter]);

  // Clear Filter
  const handleClearFilter = () => {
    setJobTitleFilter("all");
    setFromDate("");
    setToDate("");
    setSelectedFilter("All");
    setCurrentPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
  useEffect(() => setCurrentPage(1), [jobTitleFilter, fromDate, toDate, selectedFilter]);

  // Message Logic
  const openMessageBox = (id, actionType) => {
    setPendingAction(p => ({ ...p, [id]: actionType }));
    setMessageBoxOpen(m => ({ ...m, [id]: true }));
    setMessages(m => ({ ...m, [id]: getDefaultMessage(actionType) ?? '' }));
    setRatings(r => ({ ...r, [id]: 0 }));
  };

  const closeMessageBox = (id) => {
    setMessageBoxOpen(m => ({ ...m, [id]: false }));
    setMessages(m => ({ ...m, [id]: '' }));
    setRatingOpen(r => ({ ...r, [id]: false }));
    setRatings(r => { const out = { ...r }; delete out[id]; return out; });
    setHoverRating(h => { const out = { ...h }; delete out[id]; return out; });
  };

  const cleanup = (id) => {
    setPendingAction(p => {
      const out = { ...p };
      delete out[id];
      return out;
    });

    setMessages(m => {
      const out = { ...m };
      delete out[id];
      return out;
    });

    setRatingOpen(r => ({ ...r, [id]: false }));
    setHoverRating(h => ({ ...h, [id]: 0 }));
  };

  // Send Message
  const onSendMessage = (id) => {
    setMessageBoxOpen(m => ({ ...m, [id]: false }));
    setRatingOpen(r => ({ ...r, [id]: true }));
  };

  const onStarHover = (id, num) => setHoverRating(h => ({ ...h, [id]: num }));
  const onStarLeave = (id) => setHoverRating(h => ({ ...h, [id]: 0 }));
  const onClickStar = (id, num) => setRatings(r => ({ ...r, [id]: num }));

  // Overall Status Changes on Pass Fail
  const onSubmitRating = (id) => {
    const r = ratings[id] ?? 0;
    const action = pendingAction[id];
    const candidate = candidates.find(c => c.jaId === id);
    if (!candidate) return;

    const latestHR = getLatestRound(candidate, "hr");
    if (!latestHR) return;

    const hiId = latestHR.hiId;
    const feedback = messages[id] ?? "";

    const payload = {
      HIId: hiId,
      JAId: candidate.jaId,
      HRDate: latestHR.hrDate,
      HRTime: latestHR.hrTime,
      MeetingSubject: latestHR.meetingSubject || "",
      InterviewerName: latestHR.interviewerName || "",
      InterviewerEmail: latestHR.interviewerEmail || "",
      HRRating: r > 0 ? r : null,
      HRFeedback: feedback,
      HRStatus: latestHR.Status,
      HRIsClear: action === "pass" ? "Clear" : "Not Clear"
    };

    updateHRInterview(hiId, payload).then(() => {
      cleanup(id);
    });
  };

  // Resume Viewing
  const openResume = (candidates) => {
    if (!candidates.resume) {
      toast.error("No resume found for this candidate!");
      return;
    }

    window.open(candidates.resume, "_blank", "noopener,noreferrer");
  }

  const goToPage = (p) => setCurrentPage(Math.min(Math.max(1, p), totalPages));

  // Export Excel File
  const handleExport = () => {
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(filtered);

    XLSX.utils.book_append_sheet(wb, ws, "HR View");

    XLSX.writeFile(wb, "HR View.xlsx");
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white">
      {/* Navbar */}
      <CommonNavbar />

      {/* Main Layout */}
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">HR Feedback</h1>
          <button onClick={() => navigate('/interview-meeting-details', { state: { role: 'HR' } })} className="px-3 py-2 bg-purple-600 rounded text-sm text-white">Meeting Details</button>
        </div>

        {/* Filters */}
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">

            {/* All Jobs */}
            <select value={jobTitleFilter} onChange={e => setJobTitleFilter(e.target.value)} className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white">
              <option value="all">All Jobs</option>
              {uniqueJobs.map(j => <option key={j} value={j}>{j}</option>)}
            </select>

            {/* Date From and To */}
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white" />
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white" />

            {/* Status */}
            <div className="w-full flex items-center justify-start gap-2 mt-2 overflow-x-auto no-scrollbar py-1">
              {[
                'All',
                'HR Interview',
                'Clear',
                'HR Reject',
                'Document Pending',
                'Document Verification',
                'Rejected Background Verification',
                'Hold'
              ].map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedFilter(s)}
                  className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all flex items-center justify-center ${selectedFilter === s
                    ? "bg-purple-600 text-white shadow-md scale-105"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"}`}
                  style={{
                    minHeight: "34px",
                    display: "flex"
                  }}>
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-2 flex gap-2 ml-auto">
              <button
                className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
                onClick={handleClearFilter}>
                Clear
              </button>

              <button className="flex items-center gap-2 px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded text-sm" onClick={handleExport}>  
                <Download size={14} /> Download
              </button>
            </div>
          </div>
        </div>

        {/* Candidate list */}
        <div className="space-y-4">

          {/* If No Candidates Found */}
          {paginated.length === 0 ? (
            <div className="text-neutral-400">No candidates match current filters.</div>
          ) : paginated.map(c => {
            const latestHR = getLatestRound(c, 'hr');
            const hrRoundsCount = getRoundCount(c, 'hr');
            const hrStatus = latestHR?.Status ?? "In Progress";
            const hrIsClear = latestHR?.IsClear ?? "In Progress";

            return (
              <div key={c.jaId} className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <img src={c.photo} alt={c.fullName} className="w-12 h-12 rounded-full border border-neutral-600" />
                    <div className="min-w-0">
                      {/* Canddidate Details */}
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-sm font-medium text-white truncate">{c.fullName}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${badge(c.overallStatus)}`}>{c.overallStatus}</span>

                        {c.overallStatus === 'HR Interview' && (
                          <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs">HR Round: {hrRoundsCount}</span>
                        )}
                        {c.overallStatus === 'Selected' && (
                          <span className="bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs">{(c.selectionStatus ?? 'Document Pending')}</span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-neutral-400">
                        <span className="truncate"><span className="text-purple-200">Email:</span> {c.email}</span>
                        <span className="truncate"><span className="text-purple-200">Job:</span> {c.title}</span>
                        <span className="truncate"><span className="text-purple-200">Phone:</span> {c.phoneNumber}</span>
                        <span className="truncate"><span className="text-purple-200">Applied:</span> {c.appliedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* CV */}
                    <button
                      onClick={() => openResume(c)}
                      className="px-2 py-1 bg-neutral-800 text-white border border-neutral-700 rounded text-xs flex items-center gap-1">
                      <FileText size={14} /> CV
                    </button>

                    {/* HR Interview Dropdowns */}
                    {c.overallStatus === "HR Interview" && latestHR && (
                      <>
                        <select
                          value={hrStatus}
                          disabled
                          className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white">
                          <option>In Progress</option>
                          <option>Clear</option>
                          <option>Not Clear</option>
                          <option>Hold</option>
                        </select>

                        <select
                          value={hrIsClear}
                          disabled
                          className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white">
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Clear</option>
                          <option>Not Clear</option>
                        </select>
                      </>
                    )}

                    {/* Wait for Meeting Result */}
                    {c.overallStatus === "HR Interview" &&
                      latestHR &&
                      latestHR.IsClear === "In Progress" && (
                        <>
                          <button
                            onClick={() => openMessageBox(c.jaId, "pass")}
                            className="px-3 py-1 bg-emerald-700 rounded text-xs text-white flex items-center gap-1">
                            <CheckCircle size={14} /> Pass
                          </button>

                          <button
                            onClick={() => openMessageBox(c.jaId, "fail")}
                            className="px-3 py-1 bg-red-800 rounded text-xs text-white flex items-center gap-1">
                            <XCircle size={14} /> Fail
                          </button>
                        </>
                      )}

                    {/* Documents Verification */}
                    {c.overallStatus === "Document Verification" && (
                      <button
                        onClick={() => navigate(`/hr-documents-check/${c.jaId}`)}
                        className="px-2 py-1 bg-yellow-600 rounded text-xs text-white">
                        Document Review
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Box */}
                {messageBoxOpen[c.jaId] && (
                  <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-3 mt-4">
                    <textarea value={messages[c.jaId] ?? ''} onChange={e => setMessages(m => ({ ...m, [c.jaId]: e.target.value }))} className="w-full bg-neutral-700 border border-neutral-600 rounded text-white p-2 resize-none h-16" placeholder="Write feedback message..." />
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => closeMessageBox(c.jaId)} className="px-3 py-1 bg-neutral-600 rounded text-sm text-white">Cancel</button>
                      <button onClick={() => onSendMessage(c.jaId)} className="px-3 py-1 bg-amber-500 rounded text-sm text-white">Send</button>
                    </div>
                  </div>
                )}

                {/* Rating */}
                {ratingOpen[c.jaId] && (
                  <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 mt-4">
                    <h3 className="text-lg font-semibold">HR Interview Rating</h3>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(n => {
                          const currentHover = hoverRating[c.jaId] ?? 0;
                          const current = ratings[c.jaId] ?? 0;
                          const filled = currentHover ? n <= currentHover : n <= current;
                          return (
                            <Star key={n} filled={filled} onClick={() => onClickStar(c.jaId, n)} onMouseEnter={() => onStarHover(c.jaId, n)} onMouseLeave={() => onStarLeave(c.jaId)} size={22} />
                          );
                        })}
                      </div>
                      <div className="text-sm text-neutral-400">({ratings[c.jaId] ?? 0}/5)</div>
                      <div className="ml-auto flex gap-3">
                        <button onClick={() => closeMessageBox(c.jaId)} className="px-3 py-1 bg-neutral-600 rounded text-sm text-white">Cancel</button>
                        <button onClick={() => onSubmitRating(c.jaId)} className="px-3 py-1 bg-yellow-600 rounded text-sm text-white">Submit Rating</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* pagination */}
        <div className="mt-6 flex justify-center gap-3 items-center">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-neutral-800 rounded text-sm disabled:opacity-50 text-white">Prev</button>
          {[...Array(totalPages)].map((_, i) => {
            const p = i + 1;
            return <button key={p} onClick={() => goToPage(p)} className={`px-3 py-1 rounded text-sm ${p === currentPage ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-white'}`}>{p}</button>;
          })}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-neutral-800 rounded text-sm disabled:opacity-50 text-white">Next</button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const HRFeedback = () => (
  <CandidateProvider>
    <UIProvider>
      <HRFeedbackContent />
    </UIProvider>
  </CandidateProvider>
);

export default HRFeedback;
