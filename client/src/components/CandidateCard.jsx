import React, { useMemo, useState } from 'react';
import { Calendar, CheckCircle, XCircle, Video, Star, X, Send, FileDown } from 'lucide-react';
import { useCandidates } from '../contexts/CandidateContext';
import { useUI } from '../contexts/UIContext';
import { useNavigate } from 'react-router-dom';

const CandidateCard = ({ candidate }) => {
  const {
    getLatestRound, getRoundCount,
    createRound, passRound, failRound,
    scheduleExam,
    tempStatuses, updateTemp, saveTempChanges, updateCandidate
  } = useCandidates();

  const navigate = useNavigate();

  const {
    showExamCalendar, setShowExamCalendar,
    showMessage, setShowMessage,
    showRating, setShowRating,
    selectedDate, setSelectedDate,
    message, setMessage,
    rating, setRating,
    closeAllModals, getDefaultMessage
  } = useUI();

  const [meetingInputs, setMeetingInputs] = useState({ link: '', date: '', time: '' });

  // Tech/HR Round State
  const latestTech = useMemo(() => getLatestRound(candidate, 'tech'), [candidate]);
  const latestHr = useMemo(() => getLatestRound(candidate, 'hr'), [candidate]);
  const techRounds = useMemo(() => getRoundCount(candidate, 'tech'), [candidate]);
  const hrRounds = useMemo(() => getRoundCount(candidate, 'hr'), [candidate]);

  // Badge For Overall Status 
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

  //Pass or Fail Message and Rating
  const passFailFlowActive = () => {
    const m = showMessage || '';
    const r = showRating || '';
    return m.includes(`tech-`) || m.includes(`hr-`) || r.includes(`tech-`) || r.includes(`hr-`);
  };

  // Meeting
  const shouldShowMeetingTech = () => {
    if (candidate.overallStatus !== 'Technical Interview') return false;
    if (passFailFlowActive()) return false;
    if (!latestTech) return true;
    if (latestTech.Status === 'Not Clear') return false;
    if (latestTech.IsClear === 'In Progress' && latestTech.Status === 'In Progress') return false;
    if (latestTech.IsClear === 'Clear' && latestTech.Status === 'In Progress') return true;
    return false;
  };

  // Status Change After Pass or Fail
  const shouldShowPassFailTech = () => {
    if (candidate.overallStatus !== 'Technical Interview') return false;
    if (!latestTech) return false;
    return latestTech.IsClear === 'In Progress' && latestTech.Status === 'In Progress';
  };

  // HR Meeting
  const shouldShowMeetingHR = () => {
    if (candidate.overallStatus !== 'HR Interview') return false;
    if (passFailFlowActive()) return false;
    if (!latestHr) return true;
    if (latestHr.Status === 'Not Clear') return false;
    if (latestHr.IsClear === 'In Progress' && latestHr.Status === 'In Progress') return false;
    if (latestHr.IsClear === 'Clear' && latestHr.Status === 'In Progress') return true;
    return false;
  };

  // Pass or Fail for HR Change Status
  const shouldShowPassFailHR = () => {
    if (candidate.overallStatus !== 'HR Interview') return false;
    if (!latestHr) return false;
    return latestHr.IsClear === 'In Progress' && latestHr.Status === 'In Progress';
  };

  // Exam Scheduling 
  const onScheduleExam = () => {
    if (!selectedDate) return alert('Pick a date');
    scheduleExam(candidate.id, selectedDate);
    closeAllModals();
  };

  // Meeting Create 
  const onCreateRound = (type) => {
    if (!meetingInputs.date || !meetingInputs.time) return alert('Pick date & time');
    createRound(candidate.id, type, { link: meetingInputs.link, date: meetingInputs.date, time: meetingInputs.time });
    setMeetingInputs({ link: '', date: '', time: '' });
    setShowMessage(null);
  };

  // Show Meeting Button Condition
  const openMeeting = (type) => { navigate('/admin-add-meeting', { state: { candidateId: candidate.id, type } });}; 
  const openPass = (type) => { closeAllModals(); setShowMessage(type === 'tech' ? `tech-pass-${candidate.id}` : `hr-pass-${candidate.id}`); setMessage(getDefaultMessage(type === 'tech' ? 'tech-clear' : 'hr-clear')); };
  const openFail = (type) => { closeAllModals(); setShowMessage(type === 'tech' ? `tech-fail-${candidate.id}` : `hr-fail-${candidate.id}`); setMessage(getDefaultMessage(type === 'tech' ? 'tech-not-clear' : 'hr-not-clear')); };

  // Exam Pass or Fail Status
  const openAppliedPass = () => { closeAllModals(); setMessage(getDefaultMessage('select')); setShowMessage(`applied-pass-${candidate.id}`); };
  const openAppliedFail = () => { closeAllModals(); setMessage(getDefaultMessage('reject')); setShowMessage(`applied-fail-${candidate.id}`); };
  const openExamPass = () => { closeAllModals(); setMessage(getDefaultMessage('pass')); setShowMessage(`exam-pass-${candidate.id}`); };
  const openExamFail = () => { closeAllModals(); setMessage(getDefaultMessage('fail')); setShowMessage(`exam-fail-${candidate.id}`); };

  const onSendMessage = () => {
    if (!message.trim()) return alert('Write a message');
    const key = showMessage || '';

    // Direct Shortlist Candidate Without Exam
    if (key === `applied-pass-${candidate.id}`) {
      updateCandidate(candidate.id, c => ({
        ...c,
        jobApplicationStatus: 'Shortlisted',
        overallStatus: 'Technical Interview'
      }));
      setShowMessage(null); setMessage('');
      return;
    }
    if (key === `applied-fail-${candidate.id}`) {
      updateCandidate(candidate.id, c => ({
        ...c,
        jobApplicationStatus: 'Rejected',
        overallStatus: 'Rejected'
      }));
      setShowMessage(null); setMessage('');
      return;
    }

    // Exam Pass or Fail Change Status
    if (key === `exam-pass-${candidate.id}`) {
      updateCandidate(candidate.id, c => ({
        ...c,
        jobApplicationStatus: 'Shortlisted',
        overallStatus: 'Technical Interview'
      }));
      setShowMessage(null); setMessage('');
      return;
    }
    if (key === `exam-fail-${candidate.id}`) {
      updateCandidate(candidate.id, c => ({
        ...c,
        jobApplicationStatus: 'Rejected',
        overallStatus: 'Rejected'
      }));
      setShowMessage(null); setMessage('');
      return;
    }

    // Tech/HR Existing State
    if (key === `tech-pass-${candidate.id}`) { setShowMessage(null); setShowRating(`tech-${candidate.id}`); return; }
    if (key === `tech-fail-${candidate.id}`) { setShowMessage(null); setShowRating(`tech-fail-${candidate.id}`); return; }
    if (key === `hr-pass-${candidate.id}`) { setShowMessage(null); setShowRating(`hr-${candidate.id}`); return; }
    if (key === `hr-fail-${candidate.id}`) { setShowMessage(null); setShowRating(`hr-fail-${candidate.id}`); return; }

    setShowMessage(null);
  };

  // Rating Submit 
  const onSubmitRating = () => {
    if (!rating) return alert('Pick 1-5');
    const r = showRating || '';
    if (r.startsWith('tech-fail-')) failRound(candidate.id, 'tech', { rating, feedback: message });
    else if (r.startsWith('tech-')) passRound(candidate.id, 'tech', { rating, feedback: message });
    else if (r.startsWith('hr-fail-')) failRound(candidate.id, 'hr', { rating, feedback: message });
    else if (r.startsWith('hr-')) passRound(candidate.id, 'hr', { rating, feedback: message });
    setShowRating(null); setRating(0); setMessage('');
  };

  // Chnages Save
  const hasAnyChange = useMemo(() => {
    const keys = Object.keys(tempStatuses).filter(k => k.startsWith(`${candidate.id}-`));
    return keys.length > 0;
  }, [tempStatuses, candidate.id]);

  const onSaveAll = () => saveTempChanges(candidate.id);

  const ControlBar = () => {
    const latest = candidate.overallStatus === 'Technical Interview' ? latestTech : latestHr;
    return (
      <div className="flex items-center justify-end gap-2 flex-wrap sm:flex-nowrap">
        {/* CV Disable Currenlty */}
        <button disabled title="CV (coming soon)" className="px-2 py-1 bg-neutral-800 text-neutral-500 border border-neutral-700 rounded text-xs flex items-center gap-1">
          <FileDown size={12} /> CV
        </button>

        {/* JobApplication.Status*/}
        {(candidate.jobApplicationStatus === 'Applied' || candidate.jobApplicationStatus === 'Exam') && (
          <select
            value={tempStatuses[`${candidate.id}-jobApplicationStatus`] ?? candidate.jobApplicationStatus}
            onChange={(e) => updateTemp(candidate.id, 'jobApplicationStatus', e.target.value)}
            className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white"
          >
            <option value="Applied">Applied</option>
            <option value="Exam">Exam</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
          </select>
        )}

        {/* TechnicalInterview.IsClear */}
        {candidate.overallStatus === 'Technical Interview' && (
          <>
            <select
              value={tempStatuses[`${candidate.id}-techIsClear`] ?? (latest?.IsClear ?? 'Pending')}
              onChange={(e) => updateTemp(candidate.id, 'techIsClear', e.target.value)}
              className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white">
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Clear">Clear</option>
              <option value="Not Clear">Not Clear</option>
            </select>

            {/* TechnicalInterview.Status */}
            <select
              value={tempStatuses[`${candidate.id}-techStatus`] ?? (latest?.Status ?? 'In Progress')}
              onChange={(e) => updateTemp(candidate.id, 'techStatus', e.target.value)}
              className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white">
              <option value="In Progress">In Progress</option>
              <option value="Clear">Clear</option>
              <option value="Not Clear">Not Clear</option>
            </select>
          </>
        )}

        {/* HRInterview.IsClear */}
        {candidate.overallStatus === 'HR Interview' && (
          <>
            <select
              value={tempStatuses[`${candidate.id}-hrIsClear`] ?? (latest?.IsClear ?? 'Pending')}
              onChange={(e) => updateTemp(candidate.id, 'hrIsClear', e.target.value)}
              className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white">
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Clear">Clear</option>
              <option value="Not Clear">Not Clear</option>
            </select>

            {/* HRInterview.Status  */}
            <select
              value={tempStatuses[`${candidate.id}-hrStatus`] ?? (latest?.Status ?? 'In Progress')}
              onChange={(e) => updateTemp(candidate.id, 'hrStatus', e.target.value)}
              className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white">
              <option value="In Progress">In Progress</option>
              <option value="Clear">Clear</option>
              <option value="Not Clear">Not Clear</option>
            </select>
          </>
        )}

        {/* Overall Status */}
        <select
          value={tempStatuses[`${candidate.id}-overallStatus`] ?? candidate.overallStatus}
          onChange={(e) => updateTemp(candidate.id, 'overallStatus', e.target.value)}
          className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white"
        >
          <option value="Applied">Applied</option>
          <option value="Exam">Exam</option>
          <option value="Technical Interview">Tech Interview</option>
          <option value="HR Interview">HR Interview</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
          <option value="Hold">Hold</option>
        </select>

        {/* Save When Changed Button */}
        {hasAnyChange && (
          <button onClick={onSaveAll} className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs text-white">
            ✓ Save
          </button>
        )}

        {/* Applied Status */}
        {candidate.jobApplicationStatus === 'Applied' && (
          <>
            {/* Right Button for Applied Candidates */}
            <button onClick={openAppliedPass} className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-xs text-white" title="Direct Shortlist">
              ✓
            </button>
            {/* Cancel Button for Applied Candidates */}
            <button onClick={openAppliedFail} className="px-2 py-1 bg-red-800 hover:bg-red-700 rounded text-xs text-white" title="Direct Reject">
              ✗
            </button>
            {/* Exam Schedule */}
            <button
              onClick={() => { closeAllModals(); setShowExamCalendar(showExamCalendar === candidate.id ? null : candidate.id); }}
              className="px-2 py-1 bg-blue-700 hover:bg-blue-600 rounded text-xs text-white" title="Schedule Exam">
              <Calendar size={12} />
            </button>
          </>
        )}

        {/* Exam Status */}
        {candidate.jobApplicationStatus === 'Exam' && (
          <>
            {/* Pass Button */}
            <button onClick={openExamPass} className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-xs text-white">
              <CheckCircle size={12} /> Pass
            </button>

            {/* Fail Button */}
            <button onClick={openExamFail} className="px-2 py-1 bg-red-800 hover:bg-red-700 rounded text-xs text-white">
              <XCircle size={12} /> Fail
            </button>
          </>
        )}

        {/* Technical Interview Status */}
        {candidate.overallStatus === 'Technical Interview' && (
          <>
            {/* Meeting Button */}
            {shouldShowMeetingTech() && (
              <button onClick={() => openMeeting('tech')} className="px-2 py-1 bg-indigo-700 hover:bg-indigo-600 rounded text-xs text-white">
                <Video size={12} /> Meeting
              </button>
            )}

            {/* Pass/Fail Buttons */}
            {shouldShowPassFailTech() && (
              <>
                <button onClick={() => openPass('tech')} className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-xs text-white">
                  <CheckCircle size={12} /> Pass
                </button>
                <button onClick={() => openFail('tech')} className="px-2 py-1 bg-red-800 hover:bg-red-700 rounded text-xs text-white">
                  <XCircle size={12} /> Fail
                </button>
              </>
            )}
          </>
        )}

        {/* HR Interview Status */}
        {candidate.overallStatus === 'HR Interview' && (
          <>
            {/* Meeting Button  */}
            {shouldShowMeetingHR() && (
              <button onClick={() => openMeeting('hr')} className="px-2 py-1 bg-pink-700 hover:bg-pink-600 rounded text-xs text-white">
                <Video size={12} /> HR Meeting
              </button>
            )}

            {/* Pass/Fail Buttons */}
            {shouldShowPassFailHR() && (
              <>
                <button onClick={() => openPass('hr')} className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-xs text-white">
                  <CheckCircle size={12} /> Pass
                </button>
                <button onClick={() => openFail('hr')} className="px-2 py-1 bg-red-800 hover:bg-red-700 rounded text-xs text-white">
                  <XCircle size={12} /> Fail
                </button>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 mb-4">

      {/* Main Layout */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 relative z-10">

        {/* Card View */}
        <div className="flex items-center gap-4 min-w-0">
          <img src={candidate.photo} alt={candidate.fullName} className="w-12 h-12 rounded-full border border-neutral-600" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-medium text-white truncate">{candidate.fullName}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${badge(candidate.overallStatus)}`}>{candidate.overallStatus}</span>
              {candidate.overallStatus === 'Technical Interview' && <span className="bg-orange-600 text-white px-2 py-0.5 rounded-full text-xs">Round: {techRounds || 0}</span>}
              {candidate.overallStatus === 'HR Interview' && <span className="bg-orange-600 text-white px-2 py-0.5 rounded-full text-xs">Round: {hrRounds || 0}</span>}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-neutral-400">
              <span className="truncate"><span className="text-purple-200">Email:</span> {candidate.email}</span>
              <span className="truncate"><span className="text-purple-200">Job:</span> {candidate.jobTitle}</span>
              <span className="truncate"><span className="text-purple-200">Phone:</span> {candidate.phone}</span>
              <span className="truncate"><span className="text-purple-200">Applied:</span> {candidate.appliedDate}</span>
            </div>
          </div>
        </div>
        <ControlBar />
      </div>

      {/* Schedule Exam UI*/}
      {showExamCalendar === candidate.id && (
        <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-3 mt-3 relative z-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-white text-sm">Exam Date:</span>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-2 py-1 bg-neutral-700 border border-neutral-600 rounded text-white text-sm" />
            <span className="text-neutral-400 text-xs">11:00 AM</span>

            {/* Cahnge Status And Message Show */}
            <button
              onClick={() => {
                const key = showMessage || '';
                if (key.includes('applied-pass') || key.includes('exam-pass') || key.includes('tech-pass') || key.includes('hr-pass')) {
                  updateTemp(candidate.id, 'jobApplicationStatus', 'Rejected');
                  updateTemp(candidate.id, 'overallStatus', 'Rejected');
                  saveTempChanges(candidate.id);
                }
                setShowMessage(null);
                setMessage('');
              }}
              className="px-3 py-1 bg-neutral-600 rounded text-white text-xs flex items-center gap-1">
              <X size={12} /> Cancel
            </button>
            <button onClick={onScheduleExam} className="px-3 py-1 bg-blue-700 rounded text-white text-xs">Schedule</button>
          </div>
        </div>
      )}

      {/* Message for All Requirnments */}
      {(showMessage === `applied-pass-${candidate.id}` ||
        showMessage === `applied-fail-${candidate.id}` ||
        showMessage === `exam-pass-${candidate.id}` ||
        showMessage === `exam-fail-${candidate.id}` ||
        showMessage === `tech-pass-${candidate.id}` ||
        showMessage === `tech-fail-${candidate.id}` ||
        showMessage === `hr-pass-${candidate.id}` ||
        showMessage === `hr-fail-${candidate.id}`) && (
          <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-3 mt-3 relative z-0">
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-2 py-1 bg-neutral-700 border border-neutral-600 rounded text-white text-sm h-16 resize-none mb-2" />
            <div className="flex gap-2">
              <button onClick={closeAllModals} className="px-3 py-1 bg-neutral-600 rounded text-white text-xs flex items-center gap-1"><X size={12} />Cancel</button>
              <button onClick={onSendMessage} className="px-3 py-1 bg-emerald-700 rounded text-white text-xs flex items-center gap-1"><Send size={12} />Send</button>
            </div>
          </div>
        )}

      {/* Tech/HR Ratings */}
      {(showRating === `tech-${candidate.id}` ||
        showRating === `hr-${candidate.id}` ||
        showRating === `tech-fail-${candidate.id}` ||
        showRating === `hr-fail-${candidate.id}`) && (
          <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-4 mt-3 relative z-0">
            <div className="mb-3">
              <h4 className="text-white text-sm font-medium mb-2">
                {`${showRating}`.includes('tech') ? 'Technical Interview Rating' : 'HR Interview Rating'}
                {`${showRating}`.includes('fail') ? ' (Failed)' : ' (Passed)'}
              </h4>
              <div className="flex items-center gap-3">
                <span className="text-neutral-400 text-sm">Rate out of 5:</span>
                <div className="flex gap-1 items-center">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setRating(n)} className="hover:scale-110 transition">
                      <Star size={16} className={n <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-500'} />
                    </button>
                  ))}
                  <span className="text-white text-sm ml-2">({rating || 0}/5)</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={closeAllModals} className="px-3 py-1 bg-neutral-600 rounded text-white text-xs">Cancel</button>
              <button onClick={onSubmitRating} className="px-3 py-1 bg-yellow-600 rounded text-white text-xs">Submit Rating</button>
            </div>
          </div>
        )}
    </div>
  );
};

export default CandidateCard;
