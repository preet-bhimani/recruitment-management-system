import React, { useMemo, useState, useEffect } from 'react';
import { CheckCircle, XCircle, FileText } from 'lucide-react';
import { CandidateProvider, useCandidates } from '../contexts/CandidateContext';
import { UIProvider, useUI } from '../contexts/UIContext';
import CommonNavbar from '../components/CommonNavbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

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
  const { candidates, updateCandidate, getLatestRound, getRoundCount } = useCandidates();
  const { getDefaultMessage } = useUI();
  const navigate = useNavigate();
  const [jobTitleFilter, setJobTitleFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [tempOverall, setTempOverall] = useState({});
  const [tempHRStatus, setTempHRStatus] = useState({});
  const [tempHRIsClear, setTempHRIsClear] = useState({});
  const [tempSelectionStatus, setTempSelectionStatus] = useState({});
  const [tempModified, setTempModified] = useState({});
  const [collapseOpen, setCollapseOpen] = useState({});
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

  const uniqueJobs = useMemo(() => [...new Set(candidates.map(c => c.jobTitle).filter(Boolean))], [candidates]);

  // Filter by Overall Status
  const filtered = useMemo(() => {
    return candidates.filter(c => {
      if (jobTitleFilter !== 'all' && c.jobTitle !== jobTitleFilter) return false;
      if (fromDate && new Date(c.appliedDate) < new Date(fromDate)) return false;
      if (toDate && new Date(c.appliedDate) > new Date(toDate)) return false;

      const overall = c.overallStatus;
      if (selectedFilter === 'All') {
        return ['HR Interview', 'Selected', 'Hold', 'Rejected'].includes(overall);
      }
      if (selectedFilter === 'HR Interview') return overall === 'HR Interview';
      if (selectedFilter === 'Selected') return overall === 'Selected';
      if (selectedFilter === 'Hold') return overall === 'Hold';
      return false;
    });
  }, [candidates, jobTitleFilter, fromDate, toDate, selectedFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
  useEffect(() => setCurrentPage(1), [jobTitleFilter, fromDate, toDate, selectedFilter]);

  // DropDown Handling
  const onOverallChange = (id, value) => { setTempOverall(p => ({ ...p, [id]: value })); setTempModified(m => ({ ...m, [id]: true })); };
  const onHRStatusChange = (id, value) => { setTempHRStatus(p => ({ ...p, [id]: value })); setTempModified(m => ({ ...m, [id]: true })); };
  const onHRIsClearChange = (id, value) => { setTempHRIsClear(p => ({ ...p, [id]: value })); setTempModified(m => ({ ...m, [id]: true })); };
  const onSelectionStatusChange = (id, value) => { setTempSelectionStatus(p => ({ ...p, [id]: value })); setTempModified(m => ({ ...m, [id]: true })); };

  // Save DropDown
  const onSave = (id) => {
    const candidate = candidates.find(c => c.id === id); if (!candidate) return;
    const latestHR = getLatestRound(candidate, 'hr');

    updateCandidate(id, c => {
      let updated = { ...c };
      if (tempOverall[id] !== undefined) updated.overallStatus = tempOverall[id];
      if (tempSelectionStatus[id] !== undefined) updated.selectionStatus = tempSelectionStatus[id];
      if (latestHR) {
        const rounds = [...(updated.hrRounds || [])];
        const last = { ...rounds[rounds.length - 1] };
        if (tempHRStatus[id] !== undefined) last.Status = tempHRStatus[id];
        if (tempHRIsClear[id] !== undefined) last.IsClear = tempHRIsClear[id];
        rounds[rounds.length - 1] = last;
        updated.hrRounds = rounds;

        const effectiveStatus = tempHRStatus[id] !== undefined ? tempHRStatus[id] : last.Status;
        if (effectiveStatus === 'Clear') {
          updated.overallStatus = 'Selected';
        }
      }
      return updated;
    });

    // Clear Temp Values
    setTempModified(m => ({ ...m, [id]: false }));
    setTempOverall(p => { const o = { ...p }; delete o[id]; return o; });
    setTempHRStatus(p => { const o = { ...p }; delete o[id]; return o; });
    setTempHRIsClear(p => { const o = { ...p }; delete o[id]; return o; });
    setTempSelectionStatus(p => { const o = { ...p }; delete o[id]; return o; });
  };

  // Message Logic
  const openMessageBox = (id, actionType) => {
    setMessages(m => ({ ...m, [id]: getDefaultMessage(actionType) ?? '' }));
    setMessageBoxOpen(m => ({ ...m, [id]: true }));
    setPendingAction(p => ({ ...p, [id]: actionType }));
    setRatingOpen(r => ({ ...r, [id]: false }));
    setRatings(r => ({ ...r, [id]: 0 }));
  };
  const closeMessageBox = (id) => {
    setMessageBoxOpen(m => ({ ...m, [id]: false }));
    setMessages(m => ({ ...m, [id]: '' }));
    setPendingAction(p => { const out = { ...p }; delete out[id]; return out; });
    setRatingOpen(r => ({ ...r, [id]: false }));
    setRatings(r => { const out = { ...r }; delete out[id]; return out; });
    setHoverRating(h => { const out = { ...h }; delete out[id]; return out; });
  };

  // Send Message
  const onSendMessage = (id) => {
    const msg = (messages[id] ?? '').trim();
    const candidate = candidates.find(c => c.id === id); if (!candidate) return;
    const latestHR = getLatestRound(candidate, 'hr');
    if (latestHR) {
      updateCandidate(id, c => {
        const rounds = [...(c.hrRounds || [])];
        rounds[rounds.length - 1] = { ...rounds[rounds.length - 1], Feedback: msg };
        return { ...c, hrRounds: rounds };
      });
    }
    setMessages(m => ({ ...m, [id]: '' }));
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
    const candidate = candidates.find(c => c.id === id); if (!candidate) return;
    const latestHR = getLatestRound(candidate, 'hr'); if (!latestHR) return;

    if (action === 'pass') {
      updateCandidate(id, c => {
        const rounds = [...(c.hrRounds || [])];
        rounds[rounds.length - 1] = { ...rounds[rounds.length - 1], Rating: r, IsClear: 'Clear' };
        const nextNo = rounds.length + 1;
        const newRound = { RoundNo: nextNo, MeetingLink: '', Date: '', Time: '', Feedback: '', Rating: 0, IsClear: 'Pending', Status: 'In Progress' };
        return { ...c, hrRounds: [...rounds, newRound] };
      });
    } else if (action === 'fail') {
      updateCandidate(id, c => {
        const rounds = [...(c.hrRounds || [])];
        rounds[rounds.length - 1] = { ...rounds[rounds.length - 1], Rating: r, IsClear: 'Not Clear', Status: 'Not Clear' };
        return { ...c, hrRounds: rounds, overallStatus: 'Rejected', jobApplicationStatus: 'Rejected' };
      });
    }

    setRatingOpen(r => ({ ...r, [id]: false }));
    setPendingAction(p => { const out = { ...p }; delete out[id]; return out; });
    setMessages(m => ({ ...m, [id]: '' }));
    setMessageBoxOpen(m => ({ ...m, [id]: false }));
    setRatings(r => { const out = { ...r }; delete out[id]; return out; });
    setHoverRating(h => { const out = { ...h }; delete out[id]; return out; });
  };

  // Schedule Meeting
  const scheduleMeeting = (id, date, time, link) => {
    updateCandidate(id, c => {
      const rounds = [...(c.hrRounds || [])];
      if (!rounds.length) return c;
      rounds[rounds.length - 1] = { ...rounds[rounds.length - 1], Date: date, Time: time, MeetingLink: link };
      return { ...c, hrRounds: rounds };
    });
  };

  const toggleCollapse = (id) => setCollapseOpen(s => ({ ...s, [id]: !s[id] }));

  const goToPage = (p) => setCurrentPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white">
      {/* Navbar */}
      <CommonNavbar />

      {/* Main Layout */}
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">HR Feedback</h1>
          <button onClick={() => navigate('/interview-meeting-details', { state: { role: 'HR' } })} className="px-3 py-2 bg-blue-600 rounded text-sm text-white">Meeting Details</button>
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

            <div className="flex gap-2 ml-auto">
              {['All', 'HR Interview', 'Selected', 'Hold'].map(s => (
                <button key={s} onClick={() => setSelectedFilter(s)} className={`px-3 py-1 rounded text-xs ${selectedFilter === s ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-white'}`}>{s}</button>
              ))}
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
            const hrStatus = tempHRStatus[c.id] ?? (latestHR?.Status ?? 'In Progress');
            const hrIsClear = tempHRIsClear[c.id] ?? (latestHR?.IsClear ?? 'In Progress');
            const overallSel = tempOverall[c.id] ?? c.overallStatus;
            const selectionStatus = tempSelectionStatus[c.id] ?? (c.selectionStatus ?? 'Document Pending');

            return (
              <div key={c.id} className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
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
                        <span className="truncate"><span className="text-purple-200">Job:</span> {c.jobTitle}</span>
                        <span className="truncate"><span className="text-purple-200">Phone:</span> {c.phone}</span>
                        <span className="truncate"><span className="text-purple-200">Applied:</span> {c.appliedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* CV */}
                    <button disabled className="px-2 py-1 bg-neutral-800 text-neutral-500 border border-neutral-700 rounded text-xs flex items-center gap-1">
                      <FileText size={14} /> CV
                    </button>

                    {/* Overall Status DropDown */}
                    <select value={overallSel} onChange={e => onOverallChange(c.id, e.target.value)} className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white">
                      <option>Applied</option>
                      <option>Exam</option>
                      <option>Technical Interview</option>
                      <option>HR Interview</option>
                      <option>Selected</option>
                      <option>Rejected</option>
                      <option>Hold</option>
                    </select>

                    {/* Selection Status DropDown */}
                    {(c.overallStatus === 'Selected' || overallSel === 'Selected') ? (
                      <select value={selectionStatus} onChange={e => onSelectionStatusChange(c.id, e.target.value)} className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white">
                        <option>Document Pending</option>
                        <option>Pending</option>
                        <option>Sent</option>
                        <option>Accepted</option>
                        <option>Declined</option>
                      </select>
                    ) : (
                      // HR Interview DropDown for IsClear and Status
                      latestHR ? (
                        <>
                          <select value={hrStatus} onChange={e => onHRStatusChange(c.id, e.target.value)} className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white">
                            <option>In Progress</option>
                            <option>Clear</option>
                            <option>Not Clear</option>
                          </select>

                          <select value={hrIsClear} onChange={e => onHRIsClearChange(c.id, e.target.value)} className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white">
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Clear</option>
                            <option>Not Clear</option>
                          </select>
                        </>
                      ) : null
                    )}

                    {/* Save DropDown Changes */}
                    {tempModified[c.id] && (
                      <button onClick={() => onSave(c.id)} className="px-2 py-1 bg-green-600 rounded text-xs text-white">Save</button>
                    )}

                    {/* Wait for Meeting Result */}
                    {c.overallStatus === 'HR Interview' && latestHR && (latestHR.IsClear === 'In Progress') && (
                      <>
                        <button onClick={() => openMessageBox(c.id, 'pass')} className="px-3 py-1 bg-emerald-700 rounded text-xs text-white flex items-center gap-1">
                          <CheckCircle size={14} /> Pass
                        </button>
                        <button onClick={() => openMessageBox(c.id, 'fail')} className="px-3 py-1 bg-red-800 rounded text-xs text-white flex items-center gap-1">
                          <XCircle size={14} /> Fail
                        </button>
                      </>
                    )}

                    {c.overallStatus === 'HR Interview' && (
                      ((!latestHR) || (latestHR.IsClear === 'Clear') || (latestHR.IsClear === 'Pending')) && (
                        <button onClick={() => navigate('/admin-add-meeting')} className="px-2 py-1 bg-blue-600 rounded text-xs text-white">Create Meeting</button>
                      )
                    )}

                    {/* Selected Status*/}
                    {(c.overallStatus === 'Selected' || overallSel === 'Selected') && (
                      <>
                        {/* If Status Pending or Sent */}
                        {(selectionStatus === 'Pending' || selectionStatus === 'Sent') && (
                          <button onClick={() => navigate(`/hr-documents-check/${c.id}`)} className="px-2 py-1 bg-yellow-600 rounded text-xs text-white">Document</button>
                        )}

                        {/* If Status Pending */}
                        {selectionStatus === 'Pending' && (
                          <button onClick={() => navigate('/')} className="px-2 py-1 bg-purple-600 rounded text-xs text-white">Send</button>
                        )}

                        {/* If Status Accepted or Decliend */}
                        {(selectionStatus === 'Accepted' || selectionStatus === 'Declined') && (
                          <button disabled className="px-2 py-1 bg-teal-600 rounded text-xs text-white">Download Offer</button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Collapsible Schedule UI  */}
                {collapseOpen[c.id] && (
                  <div className="ml-auto flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 rounded text-sm text-white">Schedule</button>
                  </div>
                )}

                {/* Message Box */}
                {messageBoxOpen[c.id] && (
                  <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-3 mt-4">
                    <textarea value={messages[c.id] ?? ''} onChange={e => setMessages(m => ({ ...m, [c.id]: e.target.value }))} className="w-full bg-neutral-700 border border-neutral-600 rounded text-white p-2 resize-none h-16" placeholder="Write feedback message..." />
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => closeMessageBox(c.id)} className="px-3 py-1 bg-neutral-600 rounded text-sm text-white">Cancel</button>
                      <button onClick={() => onSendMessage(c.id)} className="px-3 py-1 bg-amber-500 rounded text-sm text-white">Send</button>
                    </div>
                  </div>
                )}

                {/* Rating */}
                {ratingOpen[c.id] && (
                  <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 mt-4">
                    <h3 className="text-lg font-semibold">HR Interview Rating</h3>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(n => {
                          const currentHover = hoverRating[c.id] ?? 0;
                          const current = ratings[c.id] ?? 0;
                          const filled = currentHover ? n <= currentHover : n <= current;
                          return (
                            <Star key={n} filled={filled} onClick={() => onClickStar(c.id, n)} onMouseEnter={() => onStarHover(c.id, n)} onMouseLeave={() => onStarLeave(c.id)} size={22} />
                          );
                        })}
                      </div>
                      <div className="text-sm text-neutral-400">({ratings[c.id] ?? 0}/5)</div>
                      <div className="ml-auto flex gap-3">
                        <button onClick={() => closeMessageBox(c.id)} className="px-3 py-1 bg-neutral-600 rounded text-sm text-white">Cancel</button>
                        <button onClick={() => onSubmitRating(c.id)} className="px-3 py-1 bg-yellow-600 rounded text-sm text-white">Submit Rating</button>
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
