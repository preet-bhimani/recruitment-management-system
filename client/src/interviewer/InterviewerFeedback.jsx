import React, { useMemo, useState, useEffect } from 'react';
import { CheckCircle, XCircle, FileText, X } from 'lucide-react';
import { CandidateProvider, useCandidates } from '../contexts/CandidateContext';
import { UIProvider, useUI } from '../contexts/UIContext';
import CommonNavbar from '../components/CommonNavbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 5;

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
    const { candidates, getLatestRound, getRoundCount, updateTechnicalResult, loadInterviewerData } = useCandidates();
    const { getDefaultMessage } = useUI();
    const navigate = useNavigate();
    const [jobTitleFilter, setJobTitleFilter] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
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

    const uniqueJobs = useMemo(() => [...new Set(candidates.map(c => c.title).filter(Boolean))], [candidates]);

    // Filter Logic
    const filtered = useMemo(() => {
        return candidates.filter(c => {

            // Only Show Assigned Candidates
            if (!c.isAssignedToInterviewer) return false;

            // OverallStatus is Technical Interview
            if (c.overallStatus !== "Technical Interview") return false;

            const latest = getLatestRound(c, "tech");
            if (!latest) return false;

            // Check Latest Round Status
            if (latest.Status !== "In Progress") return false;
            if (latest.IsClear !== "In Progress") return false;

            // Job filter
            if (jobTitleFilter !== "all" && c.title !== jobTitleFilter) return false;

            // Date filter
            if (fromDate && new Date(c.appliedDate) < new Date(fromDate)) return false;
            if (toDate && new Date(c.appliedDate) > new Date(toDate)) return false;

            return true;
        });
    }, [candidates, jobTitleFilter, fromDate, toDate]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
    useEffect(() => setCurrentPage(1), [jobTitleFilter, fromDate, toDate]);

    const onTechStatusChange = (id, value) => {
        setTempTechStatus(s => ({ ...s, [id]: value }));
        setTempModified(m => ({ ...m, [id]: true }));
    };

    const onTechIsClearChange = (id, value) => {
        setTempTechIsClear(s => ({ ...s, [id]: value }));
        setTempModified(m => ({ ...m, [id]: true }));
    };

    // Save DropDown Status
    const onSave = async (id) => {
        const candidate = candidates.find(c => c.jaId === id);
        if (!candidate) return;

        const latest = getLatestRound(candidate, 'tech');
        if (!latest) return;

        const tiId = latest?.tiId || latest?.TIId;

        const payload = {
            TechStatus: tempTechStatus[id] ?? latest.Status,
            TechIsClear: tempTechIsClear[id] ?? latest.IsClear
        };

        await updateTechnicalResult(tiId, payload);

        // Clear temp
        setTempTechStatus(s => { const o = { ...s }; delete o[id]; return o; });
        setTempTechIsClear(s => { const o = { ...s }; delete o[id]; return o; });
        setTempModified(m => ({ ...m, [id]: false }));
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
    const onSendMessage = async (id) => {
        const msg = (messages[id] ?? '').trim();
        if (!msg) {
            toast.error("Please write feedback first!");
            return;
        }

        // Store Temporary Feedback
        setMessageBoxOpen(prev => ({ ...prev, [id]: false }));
        setRatingOpen(prev => ({ ...prev, [id]: true }));
    };

    const onStarHover = (id, num) => setHoverRating(h => ({ ...h, [id]: num }));
    const onStarLeave = (id) => setHoverRating(h => ({ ...h, [id]: 0 }));
    const onClickStar = (id, num) => setRatings(r => ({ ...r, [id]: num }));

    // Submit Rating
    const onSubmitRating = async (id) => {
        const r = ratings[id] ?? 0;
        const action = pendingAction[id];
        const feedback = (messages[id] ?? '').trim();

        if (!feedback) {
            toast.error("Please send feedback first!");
            return;
        }

        const candidate = candidates.find(c => c.jaId === id);
        if (!candidate) return;

        const latest = getLatestRound(candidate, 'tech');
        if (!latest) return;

        const tiId = latest.tiId || latest.TIId;

        // Payload
        const payload = {
            TIId: tiId,
            JAId: candidate.jaId,
            TechDate: latest.techDate,
            TechTime: latest.techTime,
            MeetingSubject: latest.meetingSubject || '',
            InterviewerName: latest.interviewerName || '',
            InterviewerEmail: latest.interviewerEmail || '',
            TechRating: r > 0 ? r : null,
            TechFeedback: feedback,
            TechStatus: latest.Status,
            TechIsClear: action === "pass" ? "Clear" : "Not Clear"
        };

        try {
            await updateTechnicalResult(tiId, payload);
        }
        catch (err) {
            return;
        }

        setRatingOpen(r => ({ ...r, [id]: false }));
        setPendingAction(p => { const o = { ...p }; delete o[id]; return o; });
        setMessages(m => ({ ...m, [id]: "" }));
        setMessageBoxOpen(m => ({ ...m, [id]: false }));
        setRatings(r => { const o = { ...r }; delete o[id]; return o; });
        setHoverRating(h => { const o = { ...h }; delete o[id]; return o; });
    };

    // Reusme Viewing
    const openResume = (candidates) => {
        if (!candidates.resume) {
            toast.error("No resume found for this candidate!");
            return;
        }

        window.open(candidates.resume, "_blank", "noopener,noreferrer");
    }

    const goToPage = (p) => setCurrentPage(Math.min(Math.max(1, p), totalPages));
    const goToMeetings = () => navigate('/interview-meeting-details', { state: { role: 'Interviewer' } });

    useEffect(() => {
        if (typeof loadInterviewerData === "function") {
            loadInterviewerData();
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-neutral-950 text-white">
            {/* Navbar */}
            <CommonNavbar isLoggedIn={true} role="Interviewer" />

            {/* Main Layout */}
            <main className="container mx-auto px-4 py-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold">Interviewer Feedback</h1>
                    <button onClick={goToMeetings} className="px-3 py-2 bg-purple-600 rounded text-sm text-white">View Meetings</button>
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
                        const techStatus = tempTechStatus[c.jaId] ?? (latest?.Status ?? 'In Progress');
                        const techIsClear = tempTechIsClear[c.jaId] ?? (latest?.IsClear ?? 'In Progress');

                        return (
                            <div key={c.jaId} className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
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
                                                <span className="truncate"><span className="text-purple-200">Job:</span> {c.title}</span>
                                                <span className="truncate"><span className="text-purple-200">Phone:</span> {c.phoneNumber}</span>
                                                <span className="truncate"><span className="text-purple-200">Applied:</span> {c.appliedDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            onClick={() => openResume(c)}
                                            className="px-2 py-1 bg-neutral-800 text-white border border-neutral-700 rounded text-xs flex items-center gap-1">
                                            <FileText size={14} /> CV
                                        </button>

                                        {latest ? (
                                            <>
                                                {/* Technical Interview Status */}
                                                <select value={techStatus} onChange={e => onTechStatusChange(c.jaId, e.target.value)} className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white">
                                                    <option>In Progress</option>
                                                    <option>Clear</option>
                                                    <option>Not Clear</option>
                                                </select>

                                                {/* Technical Interview IsClear */}
                                                <select value={techIsClear} onChange={e => onTechIsClearChange(c.jaId, e.target.value)} className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white">
                                                    <option>Pending</option>
                                                    <option>In Progress</option>
                                                    <option>Clear</option>
                                                    <option>Not Clear</option>
                                                </select>
                                            </>
                                        ) : (
                                            <div className="text-xs text-neutral-400 px-2">No tech rounds</div>
                                        )}

                                        {tempModified[c.jaId] && (
                                            <button onClick={() => onSave(c.jaId)} className="px-2 py-1 bg-green-600 rounded text-xs text-white">Save</button>
                                        )}

                                        <button onClick={() => openMessageBox(c.jaId, 'pass')} className="px-3 py-1 bg-emerald-700 rounded text-xs text-white flex items-center gap-1">
                                            <CheckCircle size={14} /> Pass
                                        </button>
                                        <button onClick={() => openMessageBox(c.jaId, 'fail')} className="px-3 py-1 bg-red-800 rounded text-xs text-white flex items-center gap-1">
                                            <XCircle size={14} /> Fail
                                        </button>
                                    </div>
                                </div>

                                {/* Messagebox UI */}
                                {messageBoxOpen[c.jaId] && (
                                    <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-3 mt-4">
                                        <textarea
                                            value={messages[c.jaId] ?? ''}
                                            onChange={e => setMessages(m => ({ ...m, [c.jaId]: e.target.value }))}
                                            className="w-full bg-neutral-700 border border-neutral-600 rounded text-white p-2 resize-none h-12"
                                            placeholder="Write feedback message..." />
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button
                                                onClick={() => closeMessageBox(c.jaId)}
                                                className="px-3 py-1 bg-neutral-600 rounded text-sm text-white">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => onSendMessage(c.jaId)}
                                                className="px-3 py-1 bg-amber-500 rounded text-sm text-white">
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Rating */}
                                {ratingOpen[c.jaId] && (
                                    <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 mt-4">
                                        <h3 className="text-lg font-semibold">Technical Interview Rating {pendingAction[c.jaId] === 'pass' ? '(Passed)' : '(Failed)'}</h3>
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
