import React, { useMemo, useState, useEffect } from 'react';
import { CheckCircle, XCircle, FileText, X } from 'lucide-react';
import { CandidateProvider, useCandidates } from '../contexts/CandidateContext';
import { UIProvider, useUI } from '../contexts/UIContext';
import CommonNavbar from '../components/CommonNavbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 5;

// Make UI Code Simpler No more Lines of Code Needed
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


// All States
const InterviewerFeedbackContent = () => {
    const { candidates, getLatestRound, getRoundCount, updateCandidate } = useCandidates();
    const { getDefaultMessage } = useUI();
    const navigate = useNavigate();
    const [jobTitleFilter, setJobTitleFilter] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [tempOverall, setTempOverall] = useState({});
    const [tempTechStatus, setTempTechStatus] = useState({});
    const [tempTechIsClear, setTempTechIsClear] = useState({});
    const [tempModified, setTempModified] = useState({});
    const [messageBoxOpen, setMessageBoxOpen] = useState({});
    const [messages, setMessages] = useState({});
    const [pendingAction, setPendingAction] = useState({});
    const [ratingOpen, setRatingOpen] = useState({});
    const [ratings, setRatings] = useState({});
    const [hoverRating, setHoverRating] = useState({});

    // Back Ground Colors
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

    // Whole Filter State
    const filtered = useMemo(() => {
        return candidates.filter(c => {
            if (jobTitleFilter !== 'all' && c.jobTitle !== jobTitleFilter) return false;
            if (fromDate && new Date(c.appliedDate) < new Date(fromDate)) return false;
            if (toDate && new Date(c.appliedDate) > new Date(toDate)) return false;
            if (c.overallStatus !== 'Technical Interview') return false;
            const latest = getLatestRound(c, 'tech');
            if (!latest) return false;
            return (latest.Status ?? '') === 'In Progress' && (latest.IsClear ?? '') === 'In Progress';
        });
    }, [candidates, jobTitleFilter, fromDate, toDate, getLatestRound]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
    useEffect(() => setCurrentPage(1), [jobTitleFilter, fromDate, toDate]);

    const onOverallChange = (id, value) => { setTempOverall(s => ({ ...s, [id]: value })); setTempModified(s => ({ ...s, [id]: true })); };
    const onTechStatusChange = (id, value) => { setTempTechStatus(s => ({ ...s, [id]: value })); setTempModified(s => ({ ...s, [id]: true })); };
    const onTechIsClearChange = (id, value) => { setTempTechIsClear(s => ({ ...s, [id]: value })); setTempModified(s => ({ ...s, [id]: true })); };

    // Save DropDown Status
    const onSave = (id) => {
        const candidate = candidates.find(c => c.id === id);
        if (!candidate) return;
        const latest = getLatestRound(candidate, 'tech');
        updateCandidate(id, c => {
            let updated = { ...c };
            if (tempOverall[id] !== undefined) updated.overallStatus = tempOverall[id];
            if (latest) {
                const rounds = [...(updated.techRounds || [])];
                const last = { ...rounds[rounds.length - 1] };
                if (tempTechStatus[id] !== undefined) last.Status = tempTechStatus[id];
                if (tempTechIsClear[id] !== undefined) last.IsClear = tempTechIsClear[id];
                rounds[rounds.length - 1] = last;
                updated.techRounds = rounds;
            }
            return updated;
        });
        setTempModified(s => ({ ...s, [id]: false }));
        setTempOverall(p => { const out = { ...p }; delete out[id]; return out; });
        setTempTechStatus(p => { const out = { ...p }; delete out[id]; return out; });
        setTempTechIsClear(p => { const out = { ...p }; delete out[id]; return out; });
    };

    // MessageBox
    const openMessageBox = (id, actionType) => {
        setMessages(m => ({ ...m, [id]: getDefaultMessage(actionType) }));
        setMessageBoxOpen(m => ({ ...m, [id]: true }));
        setPendingAction(p => ({ ...p, [id]: actionType }));
        setRatingOpen(r => ({ ...r, [id]: false }));
        setRatings(r => ({ ...r, [id]: 0 }));
    };

    // Close MessageBox
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
        const candidate = candidates.find(c => c.id === id);
        if (!candidate) return;

        const latest = getLatestRound(candidate, 'tech');
        if (latest) {
            updateCandidate(id, c => {
                const rounds = [...(c.techRounds || [])];
                const last = { ...rounds[rounds.length - 1], Feedback: msg };
                rounds[rounds.length - 1] = last;
                return { ...c, techRounds: rounds };
            });
        }
        setMessages(prev => ({ ...prev, [id]: '' }));
        setMessageBoxOpen(prev => ({ ...prev, [id]: false }));
        setRatingOpen(prev => ({ ...prev, [id]: true }));
    };

    const onStarHover = (id, num) => setHoverRating(h => ({ ...h, [id]: num }));
    const onStarLeave = (id) => setHoverRating(h => ({ ...h, [id]: 0 }));
    const onClickStar = (id, num) => setRatings(r => ({ ...r, [id]: num }));

    // Submit Rating
    const onSubmitRating = (id) => {
        const r = ratings[id] ?? 0;
        const action = pendingAction[id];
        const candidate = candidates.find(c => c.id === id);
        if (!candidate) return;
        const latest = getLatestRound(candidate, 'tech');
        if (!latest) return;

        if (action === 'pass') {
            updateCandidate(id, c => {
                const rounds = [...(c.techRounds || [])];
                rounds[rounds.length - 1] = { ...rounds[rounds.length - 1], Rating: r, IsClear: 'Clear' };
                return { ...c, techRounds: rounds };
            });
        } else if (action === 'fail') {
            updateCandidate(id, c => {
                const rounds = [...(c.techRounds || [])];
                rounds[rounds.length - 1] = { ...rounds[rounds.length - 1], Rating: r, IsClear: 'Not Clear', Status: 'Not Clear' };
                return { ...c, techRounds: rounds, overallStatus: 'Rejected', jobApplicationStatus: 'Rejected' };
            });
        }
        setRatingOpen(r => ({ ...r, [id]: false }));
        setPendingAction(p => { const out = { ...p }; delete out[id]; return out; });
        setMessages(m => ({ ...m, [id]: '' }));
        setMessageBoxOpen(m => ({ ...m, [id]: false }));
        setRatings(r => { const out = { ...r }; delete out[id]; return out; });
        setHoverRating(h => { const out = { ...h }; delete out[id]; return out; });
    };

    const goToPage = (p) => setCurrentPage(Math.min(Math.max(1, p), totalPages));
    const goToMeetings = () => navigate('/interviewer-meeting-details');

    return (
        <div className="min-h-screen flex flex-col bg-neutral-950 text-white">
            {/* Navbar */}
            <CommonNavbar isLoggedIn={true} role="Interviewer" />

            {/* Main Layout */}
            <main className="container mx-auto px-4 py-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold">Interviewer Feedback</h1>
                    <button onClick={goToMeetings} className="px-3 py-2 bg-blue-600 rounded text-sm text-white">View Meetings</button>
                </div>

                {/* Filter UI */}
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 mb-6">
                    <div className="flex flex-wrap gap-3 items-center">
                        <select value={jobTitleFilter} onChange={e => setJobTitleFilter(e.target.value)} className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white">
                            <option value="all">All Jobs</option>
                            {uniqueJobs.map(j => <option key={j} value={j}>{j}</option>)}
                        </select>
                        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white" />
                        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white" />
                    </div>
                </div>

                {/* If No Candidate Found */}
                <div className="space-y-4">
                    {paginated.length === 0 ? (
                        <div className="text-neutral-400">No technical-interview candidates waiting for review.</div>
                    ) : paginated.map(c => {
                        const latest = getLatestRound(c, 'tech');
                        const roundCount = getRoundCount(c, 'tech');
                        const techStatus = tempTechStatus[c.id] ?? (latest?.Status ?? 'In Progress');
                        const techIsClear = tempTechIsClear[c.id] ?? (latest?.IsClear ?? 'In Progress');
                        const overallSel = tempOverall[c.id] ?? c.overallStatus;

                        return (
                            <div key={c.id} className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <img src={c.photo} alt={c.fullName} className="w-12 h-12 rounded-full border border-neutral-600" />
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-sm font-medium text-white truncate">{c.fullName}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${badge(c.overallStatus)}`}>{c.overallStatus}</span>
                                                <span className="bg-orange-600 text-white px-2 py-0.5 rounded-full text-xs">Round: {roundCount}</span>
                                            </div>

                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-neutral-400">
                                                <span className="truncate"><span className="text-purple-200">Email:</span> {c.email}</span>
                                                <span className="truncate"><span className="text-purple-200">Job:</span> {c.jobTitle}</span>
                                                <span className="truncate"><span className="text-purple-200">Phone:</span> {c.phone}</span>
                                                <span className="truncate"><span className="text-purple-200">Applied:</span> {c.appliedDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
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

                                        {latest ? (
                                            <>
                                                {/* Technical Interview Status */}
                                                <select value={techStatus} onChange={e => onTechStatusChange(c.id, e.target.value)} className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white">
                                                    <option>In Progress</option>
                                                    <option>Clear</option>
                                                    <option>Not Clear</option>
                                                </select>

                                                {/* Technical Interview IsClear */}
                                                <select value={techIsClear} onChange={e => onTechIsClearChange(c.id, e.target.value)} className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white">
                                                    <option>Pending</option>
                                                    <option>In Progress</option>
                                                    <option>Clear</option>
                                                    <option>Not Clear</option>
                                                </select>
                                            </>
                                        ) : (
                                            <div className="text-xs text-neutral-400 px-2">No tech rounds</div>
                                        )}

                                        {tempModified[c.id] && (
                                            <button onClick={() => onSave(c.id)} className="px-2 py-1 bg-green-600 rounded text-xs text-white">Save</button>
                                        )}

                                        <button onClick={() => openMessageBox(c.id, 'pass')} className="px-3 py-1 bg-emerald-700 rounded text-xs text-white flex items-center gap-1">
                                            <CheckCircle size={14} /> Pass
                                        </button>
                                        <button onClick={() => openMessageBox(c.id, 'fail')} className="px-3 py-1 bg-red-800 rounded text-xs text-white flex items-center gap-1">
                                            <XCircle size={14} /> Fail
                                        </button>
                                    </div>
                                </div>

                                {/* Messagebox UI */}
                                {messageBoxOpen[c.id] && (
                                    <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-3 mt-4">
                                        <textarea
                                            value={messages[c.id] ?? ''}
                                            onChange={e => setMessages(m => ({ ...m, [c.id]: e.target.value }))}
                                            className="w-full bg-neutral-700 border border-neutral-600 rounded text-white p-2 resize-none h-12"
                                            placeholder="Write feedback message..." />
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button
                                                onClick={() => closeMessageBox(c.id)}
                                                className="px-3 py-1 bg-neutral-600 rounded text-sm text-white">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => onSendMessage(c.id)}
                                                className="px-3 py-1 bg-amber-500 rounded text-sm text-white">
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Rating */}
                                {ratingOpen[c.id] && (
                                    <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 mt-4">
                                        <h3 className="text-lg font-semibold">Technical Interview Rating {pendingAction[c.id] === 'pass' ? '(Passed)' : '(Failed)'}</h3>
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

                {/* Pagination UI */}
                <div className="mt-6 flex justify-center gap-3 items-center">
                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-neutral-800 rounded text-sm disabled:opacity-50 text-white">Prev</button>
                    {[...Array(totalPages)].map((_, i) => {
                        const p = i + 1;
                        return (
                            <button key={p} onClick={() => goToPage(p)} className={`px-3 py-1 rounded text-sm ${p === currentPage ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-white'}`}>{p}</button>
                        );
                    })}
                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-neutral-800 rounded text-sm disabled:opacity-50 text-white">Next</button>
                </div>
            </main>
            {/* Footer */}
            <Footer />
        </div>
    );
};

const InterviewerFeedback = () => (
    <CandidateProvider>
        <UIProvider>
            <InterviewerFeedbackContent />
        </UIProvider>
    </CandidateProvider>
);

export default InterviewerFeedback;
