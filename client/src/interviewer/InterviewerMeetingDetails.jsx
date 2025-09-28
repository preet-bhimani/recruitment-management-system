import React, { useMemo, useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { CandidateProvider, useCandidates } from '../contexts/CandidateContext';
import { UIProvider } from '../contexts/UIContext';
import CommonNavbar from '../components/CommonNavbar';
import Footer from '../components/Footer';

const ITEMS_PER_PAGE = 5;

const InterviewerMeetingDetailsContent = () => {
    const { candidates, getRoundCount } = useCandidates();
    const [jobTitleFilter, setJobTitleFilter] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Parse Date String to Date Object
    const parseDate = (d) => {
        if (!d) return null;
        const t = new Date(d);
        t.setHours(0, 0, 0, 0);
        return t;
    };

    // Today Time
    const todayStart = useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
    }, []);

    // Unique Job Title Filter
    const uniqueJobs = useMemo(() => [...new Set(candidates.map(c => c.jobTitle).filter(Boolean))], [candidates]);

    // Make Sure That Meeitng Show Today and Future and If Candidate have Multiple Round Then Only Show Newest Round Link
    const upcomingMeetings = useMemo(() => {
        const out = [];
        candidates.forEach(c => {
            if (c.overallStatus !== 'Technical Interview') return;
            const rounds = (c.techRounds || []).filter(r => r && r.Date);

            if (!rounds.length) return;
            const roundsWithDate = rounds.map(r => {
                const d = new Date(r.Date);
                d.setHours(0, 0, 0, 0);
                return { ...r, __dateObj: d };
            });

            const futureRounds = roundsWithDate.filter(r => r.__dateObj >= todayStart);

            if (!futureRounds.length) return;
            futureRounds.sort((a, b) => a.__dateObj - b.__dateObj);
            const nextRound = futureRounds[0];
            out.push({ candidate: c, nextRound });
        });
        out.sort((a, b) => new Date(a.nextRound.Date) - new Date(b.nextRound.Date));
        return out;
    }, [candidates, todayStart]);

    // All Fiters
    const filtered = useMemo(() => {
        const from = parseDate(fromDate);
        const to = parseDate(toDate);

        return upcomingMeetings.filter(item => {
            const { candidate: c, nextRound: r } = item;
            if (jobTitleFilter !== 'all' && c.jobTitle !== jobTitleFilter) return false;

            if (from) {
                const rd = new Date(r.Date);
                rd.setHours(0, 0, 0, 0);
                if (rd < from) return false;
            }
            if (to) {
                const rd = new Date(r.Date);
                rd.setHours(0, 0, 0, 0);
                if (rd > to) return false;
            }
            return true;
        });
    }, [upcomingMeetings, jobTitleFilter, fromDate, toDate]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

    useEffect(() => setCurrentPage(1), [jobTitleFilter, fromDate, toDate, upcomingMeetings]);

    const goToPage = (p) => setCurrentPage(Math.min(Math.max(1, p), totalPages));

    // MeetingLink Button
    const MeetingButton = ({ link }) => (
        <button
            type="button"
            title="Open meeting (placeholder)"
            className="px-3 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" className="inline-block" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8" />
                <rect x="3" y="16" width="18" height="6" rx="2" ry="2" />
            </svg>
            Meeting Link
        </button>
    );

    return (
        <div className="min-h-screen flex flex-col bg-neutral-950 text-white">
            {/* Navbar */}
            <CommonNavbar />

            {/* Main Layout */}
            <main className="container mx-auto px-4 py-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold">Interviewer — Meeting Details</h1>
                </div>

                {/* Filters */}
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 mb-6">
                    <div className="flex flex-wrap gap-3 items-center">

                        {/* Job Title */}
                        <select
                            value={jobTitleFilter}
                            onChange={e => setJobTitleFilter(e.target.value)}
                            className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white">
                            <option value="all">All Jobs</option>
                            {uniqueJobs.map(j => <option key={j} value={j}>{j}</option>)}
                        </select>

                        {/* Date Form */}
                        <input
                            type="date"
                            value={fromDate}
                            onChange={e => setFromDate(e.target.value)}
                            className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white" />

                        {/* Date To */}
                        <input
                            type="date"
                            value={toDate}
                            onChange={e => setToDate(e.target.value)}
                            className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-white" />
                    </div>
                </div>

                {/* Meeting Cards */}
                <div className="space-y-4">

                    {/* If No Candidate Found */}
                    {paginated.length === 0 ? (
                        <div className="text-neutral-400">No upcoming meetings match the selected filters.</div>
                    ) : paginated.map(({ candidate: c, nextRound: r }) => (
                        <div key={c.id} className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                                <img src={c.photo} alt={c.fullName} className="w-12 h-12 rounded-full border border-neutral-600" />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-sm font-medium text-white truncate">{c.fullName}</h3>
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-purple-600 font-medium text-white ">{c.overallStatus}</span>

                                        <span className="bg-orange-600 text-white px-2 py-0.5 rounded-full text-xs">Round: {r.RoundNo ?? '-'}</span>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-neutral-400">
                                        <span className="truncate"><span className="text-purple-200">Email:</span> {c.email}</span>
                                        <span className="truncate"><span className="text-purple-200">Job:</span> {c.jobTitle}</span>
                                        <span className="truncate"><span className="text-purple-200">Phone:</span> {c.phone}</span>
                                        <span className="truncate"><span className="text-purple-200">Applied:</span> {c.appliedDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Date Time for Meeting */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-end">
                                <div className="flex gap-4 items-center mt-2 text-white">
                                    <span className="flex items-center gap-1 text-green-300">
                                        Date: <strong>{r.Date}</strong>
                                    </span>
                                    <span className="flex items-center gap-1 text-green-300">
                                        Time: <strong>{r.Time}</strong>
                                    </span>
                                </div>

                                {/* Meeting and CV Buttons */}
                                <div className="flex items-center gap-2">
                                    <MeetingButton link={r.MeetingLink} />
                                    <button
                                        className="px-2 py-1 bg-neutral-800 text-neutral-300 border border-neutral-700 rounded text-xs flex items-center gap-1"
                                        disabled
                                        title="CV (disabled)">
                                        <FileText size={14} /> CV
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination UI*/}
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

const InterviewerMeetingDetails = () => (
    <CandidateProvider>
        <UIProvider>
            <InterviewerMeetingDetailsContent />
        </UIProvider>
    </CandidateProvider>
);

export default InterviewerMeetingDetails;
