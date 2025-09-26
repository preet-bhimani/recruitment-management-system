import React, { useMemo, useState, useEffect } from 'react';
import { CheckCircle, XCircle, Calendar, Send, X } from 'lucide-react';
import { CandidateProvider, useCandidates } from '../contexts/CandidateContext';
import { UIProvider, useUI } from '../contexts/UIContext';
import CommonNavbar from '../components/CommonNavbar';
import Footer from '../components/Footer';

const ReviewerDashboardContent = () => {

    const { candidates, updateCandidate, scheduleExam } = useCandidates();
    const { showMessage, setShowMessage, message, setMessage, closeAllModals, getDefaultMessage } = useUI();
    const [jobTitleFilter, setJobTitleFilter] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const candidatesPerPage = 5;
    const [examDates, setExamDates] = useState({});

    // Status Color 
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

    // Unique Job Title
    const uniqueJobs = useMemo(() => {
        const jobs = candidates.map(c => c.jobTitle).filter(Boolean);
        return [...new Set(jobs)];
    }, [candidates]);


    // Full Filter Condition
    const applicableCandidates = useMemo(() => {
        return candidates.filter(c => {
            const status = (c.jobApplicationStatus || '').toLowerCase();
            if (!(status === 'applied' || status === 'exam')) return false;

            if (jobTitleFilter !== 'all' && c.jobTitle !== jobTitleFilter) return false;

            if (fromDate) {
                const cd = c.appliedDate ? new Date(c.appliedDate) : null;
                if (!cd || cd < new Date(fromDate)) return false;
            }
            if (toDate) {
                const cd = c.appliedDate ? new Date(c.appliedDate) : null;
                if (!cd || cd > new Date(toDate)) return false;
            }
            return true;
        });
    }, [candidates, jobTitleFilter, fromDate, toDate]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(applicableCandidates.length / candidatesPerPage));
    const startIndex = (currentPage - 1) * candidatesPerPage;
    const paginated = applicableCandidates.slice(startIndex, startIndex + candidatesPerPage);

    // Reset Page 
    useEffect(() => setCurrentPage(1), [jobTitleFilter, fromDate, toDate]);

    const openActionModal = (key, defaultMsgType = 'select') => {
        setMessage(getDefaultMessage(defaultMsgType));
        setShowMessage(key);
    };

    // Message Show for Each Satge
    const onSendMessage = () => {
        if (!message.trim()) return alert('Write a message');

        const key = showMessage || '';
        const parts = key.split('-');
        if (parts.length < 3) {
            setShowMessage(null); setMessage(''); return;
        }
        const stage = parts[0]; 
        const action = parts[1]; 
        const id = Number(parts.slice(2).join('-'));
        if (!id) { setShowMessage(null); setMessage(''); return; }

        if ((stage === 'applied' && action === 'pass') || (stage === 'exam' && action === 'pass')) {
            updateCandidate(id, c => ({ ...c, jobApplicationStatus: 'Shortlisted', overallStatus: 'Technical Interview' }));
        } else if ((stage === 'applied' && action === 'fail') || (stage === 'exam' && action === 'fail')) {
            updateCandidate(id, c => ({ ...c, jobApplicationStatus: 'Rejected', overallStatus: 'Rejected' }));
        }
        setShowMessage(null);
        setMessage('');
    };

    // Schedule Exam
    const onScheduleExamFor = (id) => {
        const date = examDates[id];
        if (!date) return alert('Pick a date to schedule exam');
        scheduleExam(id, date);
        setExamDates(prev => { const n = { ...prev }; delete n[id]; return n; });
    };

    // Pagination Controls
    const goToPage = (p) => {
        const np = Math.max(1, Math.min(totalPages, p));
        setCurrentPage(np);
    };

    return (
        <div className="min-h-screen flex flex-col bg-neutral-950 text-white">

            {/* Navbar */}
            {typeof CommonNavbar !== 'undefined' ? <CommonNavbar /> : null}

            {/* Main Layout */}
            <main className="container mx-auto px-4 py-6 flex-1">
                <h1 className="text-2xl font-semibold mb-4">Reviewer Dashboard</h1>

                {/* Filters */}
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 mb-6">
                    <div className="flex flex-wrap gap-3 items-center">

                        {/* Job Title Filter */}
                        <select
                            value={jobTitleFilter}
                            onChange={(e) => setJobTitleFilter(e.target.value)}
                            className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white">
                            <option value="all">All Jobs</option>
                            {uniqueJobs.map(j => <option key={j} value={j}>{j}</option>)}
                        </select>

                        {/* Date From */}
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white"
                            placeholder="From"/>

                        {/* Date To */}
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white"
                            placeholder="To"/>

                        <div className="ml-auto text-sm text-neutral-400">
                            Showing {applicableCandidates.length} applicable candidates
                        </div>
                    </div>
                </div>

                {/* Candidate Card */}
                <div className="space-y-4">
                    {paginated.length === 0 && (
                        <div className="text-neutral-400">No candidates (Applied/Exam) match current filters.</div>
                    )}

                    {paginated.map(c => (
                        <div key={c.id} className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                                <img src={c.photo} alt={c.fullName} className="w-12 h-12 rounded-full border border-neutral-600" />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-sm font-medium text-white truncate">{c.fullName}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${badge(c.overallStatus)}`}>{c.overallStatus}</span>
                                        {c.overallStatus === 'Technical Interview' && <span className="bg-orange-600 text-white px-2 py-0.5 rounded-full text-xs">Round: {techRounds || 0}</span>}
                                        {c.overallStatus === 'HR Interview' && <span className="bg-orange-600 text-white px-2 py-0.5 rounded-full text-xs">Round: {hrRounds || 0}</span>}
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-neutral-400">
                                        <span className="truncate"><span className="text-purple-200">Email:</span> {c.email}</span>
                                        <span className="truncate"><span className="text-purple-200">Job:</span> {c.jobTitle}</span>
                                        <span className="truncate"><span className="text-purple-200">Phone:</span> {c.phone}</span>
                                        <span className="truncate"><span className="text-purple-200">Applied:</span> {c.appliedDate}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">

                                {/* Applied Actions Buttons */}
                                {c.jobApplicationStatus?.toLowerCase() === 'applied' && (
                                    <>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openActionModal(`applied-pass-${c.id}`, 'select')}
                                                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-xs text-white flex items-center gap-1">
                                                <CheckCircle size={14} /> Right
                                            </button>
                                            <button
                                                onClick={() => openActionModal(`applied-fail-${c.id}`, 'reject')}
                                                className="px-3 py-1 bg-red-800 hover:bg-red-700 rounded text-xs text-white flex items-center gap-1">
                                                <XCircle size={14} /> Cancel
                                            </button>
                                        </div>
                                        <div className="flex gap-2 items-center mt-2">
                                            <input
                                                type="date"
                                                value={examDates[c.id] || ''}
                                                onChange={(e) => setExamDates(prev => ({ ...prev, [c.id]: e.target.value }))}
                                                className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white"/>
                                            <button
                                                onClick={() => onScheduleExamFor(c.id)}
                                                className="px-2 py-1 bg-blue-700 hover:bg-blue-600 rounded text-xs text-white flex items-center gap-1">
                                                <Calendar size={12} /> Schedule Exam
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* Exam Actions Buttons */}
                                {c.jobApplicationStatus?.toLowerCase() === 'exam' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openActionModal(`exam-pass-${c.id}`, 'pass')}
                                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-xs text-white flex items-center gap-1">
                                            <CheckCircle size={14} /> Pass
                                        </button>
                                        <button
                                            onClick={() => openActionModal(`exam-fail-${c.id}`, 'fail')}
                                            className="px-3 py-1 bg-red-800 hover:bg-red-700 rounded text-xs text-white flex items-center gap-1">
                                            <XCircle size={14} /> Fail
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                </div>

                {/* Pagination Controls */}
                <div className="mt-6 flex items-center gap-3 justify-center">
                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                        className="px-3 py-1 bg-neutral-800 rounded text-sm disabled:opacity-50">Prev</button>

                    {[...Array(totalPages)].map((_, i) => {
                        const p = i + 1;
                        return (
                            <button key={p}
                                onClick={() => goToPage(p)}
                                className={`px-3 py-1 rounded text-sm ${p === currentPage ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-white'}`}>
                                {p}
                            </button>
                        );
                    })}

                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-neutral-800 rounded text-sm disabled:opacity-50">Next</button>
                </div>
            </main>

            {/* Footer */}
            {typeof Footer !== 'undefined' ? <Footer /> : null}

            {/* Message Model */}
            {showMessage && (showMessage.startsWith('applied-') || showMessage.startsWith('exam-')) ? (
                <div className="fixed bottom-6 right-6 w-[360px] bg-neutral-800 border border-neutral-700 rounded-lg p-3 z-50">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-2 py-1 bg-neutral-700 border border-neutral-600 rounded text-white text-sm h-24 resize-none mb-2"/>
                    <div className="flex gap-2 justify-end">
                        <button onClick={closeAllModals} className="px-3 py-1 bg-neutral-600 rounded text-xs text-white flex items-center gap-1">
                            <X size={12} /> Close
                        </button>
                        <button onClick={onSendMessage} className="px-3 py-1 bg-emerald-700 rounded text-xs text-white flex items-center gap-1">
                            <Send size={12} /> Send
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

const ReviewerDashboard = () => {
    return (
        <CandidateProvider>
            <UIProvider>
                <ReviewerDashboardContent />
            </UIProvider>
        </CandidateProvider>
    );
};

export default ReviewerDashboard;
