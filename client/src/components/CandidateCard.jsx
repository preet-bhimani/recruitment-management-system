import React, { useMemo, useState } from 'react';
import { Calendar, CheckCircle, XCircle, Video, Star, X, Send, FileDown } from 'lucide-react';
import { useCandidates } from '../contexts/CandidateContext';
import { useUI } from '../contexts/UIContext';
import { useNavigate } from 'react-router-dom';

const CandidateCard = ({ candidate }) => {
  const {
    getLatestRound, getRoundCount,
    passRound, failRound,
    scheduleExam,
    tempStatuses, updateTemp, saveTempChanges, updateCandidate
  } = useCandidates();

  const {
    showExamCalendar, setShowExamCalendar,
    showMessage, setShowMessage,
    showRating, setShowRating,
    selectedDate, setSelectedDate,
    message, setMessage,
    rating, setRating,
    closeAllModals, getDefaultMessage
  } = useUI();

  const navigate = useNavigate();

  // latest rounds (only latest shown)
  const latestTech = useMemo(() => getLatestRound(candidate, 'tech'), [candidate, getLatestRound]);
  const latestHr = useMemo(() => getLatestRound(candidate, 'hr'), [candidate, getLatestRound]);
  const techRounds = useMemo(() => getRoundCount(candidate, 'tech'), [candidate, getRoundCount]);
  const hrRounds = useMemo(() => getRoundCount(candidate, 'hr'), [candidate, getRoundCount]);

  // Badge For BackGround Color
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

  const effectiveOverall = () => tempStatuses?.[`${candidate.id}-overallStatus`] ?? candidate.overallStatus;

  // After Pass or Fail Flow
  const passFailFlowActive = () => {
    const m = showMessage || '';
    const r = showRating || '';
    return (m && (m.endsWith(`-${candidate.id}`) && (m.startsWith('tech-') || m.startsWith('hr-')))) ||
      (r && r.endsWith(`-${candidate.id}`) && (r.startsWith('tech-') || r.startsWith('hr-')));
  };

  // show Meeting for Tech
  const shouldShowMeetingTech = () => {
    if (effectiveOverall() !== 'Technical Interview') return false;
    if (passFailFlowActive()) return false;
    if (!latestTech) return true;
    if (latestTech.Status === 'Not Clear') return false;
    if (latestTech.IsClear === 'In Progress' && latestTech.Status === 'In Progress') return false;
    if (latestTech.IsClear === 'Clear' && latestTech.Status === 'In Progress') return true;
    return false;
  };

  // Show Pass or Fail for Techn Condition
  const shouldShowPassFailTech = () => {
    if (effectiveOverall() !== 'Technical Interview') return false;
    if (!latestTech) return false;
    return latestTech.IsClear === 'In Progress' && latestTech.Status === 'In Progress';
  };

  // Show Meeting HR Meeting Condition
  const shouldShowMeetingHR = () => {
    if (effectiveOverall() !== 'HR Interview') return false;
    if (passFailFlowActive()) return false;
    if (!latestHr) return true;
    if (latestHr.Status === 'Not Clear') return false;
    if (latestHr.IsClear === 'In Progress' && latestHr.Status === 'In Progress') return false;
    if (latestHr.IsClear === 'Clear' && latestHr.Status === 'In Progress') return true;
    return false;
  };

  // Show Pass or Fail for HR Condition
  const shouldShowPassFailHR = () => {
    if (effectiveOverall() !== 'HR Interview') return false;
    if (!latestHr) return false;
    return latestHr.IsClear === 'In Progress' && latestHr.Status === 'In Progress';
  };

  // Overall Status Change Value
  const handleOverallChange = (val) => {
    updateTemp(candidate.id, 'overallStatus', val);
  };

  // JobApplication Status Change Value
  const handleJobStatusChange = (val) => {
    updateTemp(candidate.id, 'jobApplicationStatus', val);
  };

  // Technical IsClear Change Value
  const handleTechIsClearChange = (val) => {
    updateTemp(candidate.id, 'techIsClear', val);
  };

  // Technical Status Change Value
  const handleTechStatusChange = (val) => {
    updateTemp(candidate.id, 'techStatus', val);
  };

  // HR IsClear Change Value
  const handleHrIsClearChange = (val) => {
    updateTemp(candidate.id, 'hrIsClear', val);
  };

  // HR Status Change Value
  const handleHrStatusChange = (val) => {
    updateTemp(candidate.id, 'hrStatus', val);
  };

  const toggleExamCalendar = () => setShowExamCalendar(showExamCalendar === candidate.id ? null : candidate.id);

  // Schdeule Exam Logic
  const onScheduleExamInline = () => {
    if (!selectedDate) return alert('Pick a date');
    scheduleExam(candidate.id, selectedDate);
    setSelectedDate('');
    setShowExamCalendar(null);
  };

  const openAppliedPass = () => { setMessage(getDefaultMessage('select')); setShowMessage(`applied-pass-${candidate.id}`); };
  const openAppliedFail = () => { setMessage(getDefaultMessage('reject')); setShowMessage(`applied-fail-${candidate.id}`); };
  const openExamPass = () => { setMessage(getDefaultMessage('pass')); setShowMessage(`exam-pass-${candidate.id}`); };
  const openExamFail = () => { setMessage(getDefaultMessage('fail')); setShowMessage(`exam-fail-${candidate.id}`); };
  const openPass = (type) => { setMessage(getDefaultMessage(type === 'tech' ? 'tech-clear' : 'hr-clear')); setShowMessage(type === 'tech' ? `tech-pass-${candidate.id}` : `hr-pass-${candidate.id}`); };
  const openFail = (type) => { setMessage(getDefaultMessage(type === 'tech' ? 'tech-not-clear' : 'hr-not-clear')); setShowMessage(type === 'tech' ? `tech-fail-${candidate.id}` : `hr-fail-${candidate.id}`); };

  // Message Logic
  const onSendMessage = () => {
    if (!message.trim()) return alert('Write a message');
    const key = showMessage || '';

    if (key === `applied-pass-${candidate.id}`) {
      updateCandidate(candidate.id, c => ({ ...c, jobApplicationStatus: 'Shortlisted', overallStatus: 'Technical Interview' }));
      setShowMessage(null); setMessage('');
      return;
    }
    if (key === `applied-fail-${candidate.id}`) {
      updateCandidate(candidate.id, c => ({ ...c, jobApplicationStatus: 'Rejected', overallStatus: 'Rejected' }));
      setShowMessage(null); setMessage('');
      return;
    }
    if (key === `exam-pass-${candidate.id}`) {
      updateCandidate(candidate.id, c => ({ ...c, jobApplicationStatus: 'Shortlisted', overallStatus: 'Technical Interview' }));
      setShowMessage(null); setMessage('');
      return;
    }
    if (key === `exam-fail-${candidate.id}`) {
      updateCandidate(candidate.id, c => ({ ...c, jobApplicationStatus: 'Rejected', overallStatus: 'Rejected' }));
      setShowMessage(null); setMessage('');
      return;
    }
    if (key === `tech-pass-${candidate.id}`) { setShowMessage(null); setShowRating(`tech-${candidate.id}`); return; }
    if (key === `tech-fail-${candidate.id}`) { setShowMessage(null); setShowRating(`tech-fail-${candidate.id}`); return; }
    if (key === `hr-pass-${candidate.id}`) { setShowMessage(null); setShowRating(`hr-${candidate.id}`); return; }
    if (key === `hr-fail-${candidate.id}`) { setShowMessage(null); setShowRating(`hr-fail-${candidate.id}`); return; }

    setShowMessage(null);
  };

  // Rating Logic
  const onSubmitRating = () => {
    if (!rating) return alert('Pick 1-5');
    const r = showRating || '';
    if (r === `tech-fail-${candidate.id}`) { failRound(candidate.id, 'tech', { rating, feedback: message }); setShowRating(null); setRating(0); setMessage(''); return; }
    if (r === `tech-${candidate.id}`) { passRound(candidate.id, 'tech', { rating, feedback: message }); setShowRating(null); setRating(0); setMessage(''); return; }
    if (r === `hr-fail-${candidate.id}`) { failRound(candidate.id, 'hr', { rating, feedback: message }); setShowRating(null); setRating(0); setMessage(''); return; }
    if (r === `hr-${candidate.id}`) { passRound(candidate.id, 'hr', { rating, feedback: message }); setShowRating(null); setRating(0); setMessage(''); return; }
  };

  // This Help to Save Changes After Save Button Clicked
  const applyTempToCandidate = () => {
    // Collect Values
    const t = tempStatuses || {};
    const keyOverall = `${candidate.id}-overallStatus`;
    const keyJob = `${candidate.id}-jobApplicationStatus`;
    const keyTechIsClear = `${candidate.id}-techIsClear`;
    const keyTechStatus = `${candidate.id}-techStatus`;
    const keyHrIsClear = `${candidate.id}-hrIsClear`;
    const keyHrStatus = `${candidate.id}-hrStatus`;

    const overallTemp = t[keyOverall];
    const jobTemp = t[keyJob];
    const techIsClearTemp = t[keyTechIsClear];
    const techStatusTemp = t[keyTechStatus];
    const hrIsClearTemp = t[keyHrIsClear];
    const hrStatusTemp = t[keyHrStatus];

    updateCandidate(candidate.id, c => {
      let next = { ...c };

      // JobApplication Status Change
      if (overallTemp) {
        if (overallTemp === 'Exam') {
          next.overallStatus = 'Exam';
          next.jobApplicationStatus = 'Exam';
        } else if (overallTemp === 'Technical Interview') {
          next.overallStatus = 'Technical Interview';
          next.jobApplicationStatus = 'Shortlisted';
        } else if (overallTemp === 'Rejected') {
          next.overallStatus = 'Rejected';
          next.jobApplicationStatus = 'Rejected';
        } else {
          next.overallStatus = overallTemp;
        }
      }

      if (jobTemp) {
        if (jobTemp === 'Shortlisted') {
          next.jobApplicationStatus = 'Shortlisted';
          next.overallStatus = 'Technical Interview';
        } else if (jobTemp === 'Rejected') {
          next.jobApplicationStatus = 'Rejected';
          next.overallStatus = 'Rejected';
        } else if (jobTemp === 'Exam') {
          next.jobApplicationStatus = 'Exam';
          next.overallStatus = 'Exam';
        } else {
          next.jobApplicationStatus = jobTemp;
        }
      }

      // Technical Status Round Change
      if ((techIsClearTemp || techStatusTemp) && (next.techRounds && next.techRounds.length)) {
        const rounds = [...next.techRounds];
        const last = { ...rounds[rounds.length - 1] };
        if (techIsClearTemp) {
          if (techIsClearTemp === 'Not Clear') {
            last.IsClear = 'Not Clear';
            last.Status = 'Not Clear';
            next.overallStatus = 'Rejected';
            next.jobApplicationStatus = 'Rejected';
          } else if (techIsClearTemp === 'Clear') {
            last.IsClear = 'Clear';
          } else {
            last.IsClear = techIsClearTemp;
          }
        }
        if (techStatusTemp) {
          if (techStatusTemp === 'Not Clear') {
            last.Status = 'Not Clear';
            last.IsClear = 'Not Clear';
            next.overallStatus = 'Rejected';
            next.jobApplicationStatus = 'Rejected';
          } else if (techStatusTemp === 'Clear') {
            last.Status = 'Clear';
            next.overallStatus = 'HR Interview';
            next.jobApplicationStatus = 'Shortlisted';
          } else {
            last.Status = techStatusTemp;
          }
        }
        rounds[rounds.length - 1] = last;
        next.techRounds = rounds;
      }

      // HR Round Staus Change
      if ((hrIsClearTemp || hrStatusTemp) && (next.hrRounds && next.hrRounds.length)) {
        const rounds = [...next.hrRounds];
        const last = { ...rounds[rounds.length - 1] };
        if (hrIsClearTemp) {
          if (hrIsClearTemp === 'Not Clear') {
            last.IsClear = 'Not Clear';
            last.Status = 'Not Clear';
            next.overallStatus = 'Rejected';
            next.jobApplicationStatus = 'Rejected';
          } else if (hrIsClearTemp === 'Clear') {
            last.IsClear = 'Clear';
          } else {
            last.IsClear = hrIsClearTemp;
          }
        }
        if (hrStatusTemp) {
          if (hrStatusTemp === 'Not Clear') {
            last.Status = 'Not Clear';
            last.IsClear = 'Not Clear';
            next.overallStatus = 'Rejected';
            next.jobApplicationStatus = 'Rejected';
          } else if (hrStatusTemp === 'Clear') {
            last.Status = 'Clear';
            next.overallStatus = 'Selected';
            next.jobApplicationStatus = 'Selected';
          } else {
            last.Status = hrStatusTemp;
          }
        }
        rounds[rounds.length - 1] = last;
        next.hrRounds = rounds;
      }
      return next;
    });
    saveTempChanges(candidate.id);
  };

  const onSaveAll = () => applyTempToCandidate();

  const openMeeting = (type) => {
    navigate('/recruiter-meeting-scheduling', { state: { candidateId: candidate.id, type } });
  };

  // Control Bar
  const ControlBar = () => {
    return (
      <div className="flex items-center justify-end gap-2 flex-wrap sm:flex-nowrap">
        <button disabled title="CV (coming soon)" className="px-2 py-1 bg-neutral-800 text-neutral-500 border border-neutral-700 rounded text-xs flex items-center gap-1">
          <FileDown size={12} />
        </button>

        {/* Show JobApplication Status DropDown */}
        {(effectiveOverall() === 'Applied' || effectiveOverall() === 'Exam') && (
          <select
            value={tempStatuses[`${candidate.id}-jobApplicationStatus`] ?? candidate.jobApplicationStatus}
            onChange={(e) => handleJobStatusChange(e.target.value)}
            className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white appearance-none focus:outline-none">
            <option value="Applied">Applied</option>
            <option value="Exam">Exam</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
          </select>
        )}

        {/* Show Technical DropDowns */}
        {effectiveOverall() === 'Technical Interview' && latestTech && (
          <>
            <select
              value={tempStatuses[`${candidate.id}-techIsClear`] ?? (latestTech?.IsClear ?? 'In Progress')}
              onChange={(e) => handleTechIsClearChange(e.target.value)}
              className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white appearance-none focus:outline-none">
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Clear">Clear</option>
              <option value="Not Clear">Not Clear</option>
            </select>

            <select
              value={tempStatuses[`${candidate.id}-techStatus`] ?? (latestTech?.Status ?? 'In Progress')}
              onChange={(e) => handleTechStatusChange(e.target.value)}
              className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white appearance-none focus:outline-none">
              <option value="In Progress">In Progress</option>
              <option value="Clear">Clear</option>
              <option value="Not Clear">Not Clear</option>
            </select>
          </>
        )}

        {/* Show HR DropDowns */}
        {effectiveOverall() === 'HR Interview' && latestHr && (
          <>
            <select
              value={tempStatuses[`${candidate.id}-hrIsClear`] ?? (latestHr?.IsClear ?? 'In Progress')}
              onChange={(e) => handleHrIsClearChange(e.target.value)}
              className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white appearance-none focus:outline-none">
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Clear">Clear</option>
              <option value="Not Clear">Not Clear</option>
            </select>

            <select
              value={tempStatuses[`${candidate.id}-hrStatus`] ?? (latestHr?.Status ?? 'In Progress')}
              onChange={(e) => handleHrStatusChange(e.target.value)}
              className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white appearance-none focus:outline-none">
              <option value="In Progress">In Progress</option>
              <option value="Clear">Clear</option>
              <option value="Not Clear">Not Clear</option>
            </select>
          </>
        )}

        {/* OverallStatus DropDown */}
        <select
          value={tempStatuses[`${candidate.id}-overallStatus`] ?? candidate.overallStatus}
          onChange={(e) => handleOverallChange(e.target.value)}
          className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white appearance-none focus:outline-none">
          <option value="Applied">Applied</option>
          <option value="Exam">Exam</option>
          <option value="Technical Interview">Technical Interview</option>
          <option value="HR Interview">HR Interview</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
          <option value="Hold">Hold</option>
        </select>

        {/* Save Button Logic */}
        {Object.keys(tempStatuses || {}).some(k => k.startsWith(`${candidate.id}-`)) && (
          <button onClick={onSaveAll} className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs text-white">✓ Save</button>
        )}

        {/* Selected or Rejected When Applied */}
        {effectiveOverall() === 'Applied' && (
          <>
            <button onClick={openAppliedPass} className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-xs text-white" title="Shortlist">
              <CheckCircle size={14} />
            </button>
            <button onClick={openAppliedFail} className="px-2 py-1 bg-red-800 hover:bg-red-700 rounded text-xs text-white" title="Reject">
              <XCircle size={14} />
            </button>

            <button onClick={() => toggleExamCalendar()} className="px-2 py-1 bg-blue-700 hover:bg-blue-600 rounded text-xs text-white" title="Schedule Exam">
              <Calendar size={14} />
            </button>
          </>
        )}

        {/* Exam Action */}
        {effectiveOverall() === 'Exam' && (
          <>
            <button onClick={openExamPass} className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-xs text-white" title="Pass">
              <CheckCircle size={14} />
            </button>
            <button onClick={openExamFail} className="px-2 py-1 bg-red-800 hover:bg-red-700 rounded text-xs text-white" title="Fail">
              <XCircle size={14} />
            </button>
          </>
        )}

        {/* Meeting Icon Condition */}
        {effectiveOverall() === 'Technical Interview' && shouldShowMeetingTech() && (
          <button onClick={() => openMeeting('tech')} className="px-2 py-1 bg-indigo-700 hover:bg-indigo-600 rounded text-xs text-white" title="Schedule Tech Meeting">
            <Video size={14} />
          </button>
        )}
        {effectiveOverall() === 'HR Interview' && shouldShowMeetingHR() && (
          <button onClick={() => openMeeting('hr')} className="px-2 py-1 bg-pink-700 hover:bg-pink-600 rounded text-xs text-white" title="Schedule HR Meeting">
            <Video size={14} />
          </button>
        )}

        {/* Tech Pass or Fail */}
        {effectiveOverall() === 'Technical Interview' && shouldShowPassFailTech() && (
          <>
            <button onClick={() => openPass('tech')} className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-xs text-white">Pass</button>
            <button onClick={() => openFail('tech')} className="px-2 py-1 bg-red-800 hover:bg-red-700 rounded text-xs text-white">Fail</button>
          </>
        )}

        {/* HR Pass or Fail */}
        {effectiveOverall() === 'HR Interview' && shouldShowPassFailHR() && (
          <>
            <button onClick={() => openPass('hr')} className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-xs text-white">Pass</button>
            <button onClick={() => openFail('hr')} className="px-2 py-1 bg-red-800 hover:bg-red-700 rounded text-xs text-white">Fail</button>
          </>
        )}
      </div>
    );
  };

  // Badge of Selected Candidates
  const displayBadgeStatus = () => {
    const eff = effectiveOverall();
    if (eff === 'Selected') {
      return candidate.selection?.Status ?? candidate.selectionStatus ?? 'Selected';
    }
    return eff;
  };

  // Keep Badge Color with Status
  const badgeClassForDisplay = () => {
    const eff = effectiveOverall();
    if (eff === 'Selected') return badge('Selected');
    return badge(displayBadgeStatus());
  };

  // Candidates Details
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 relative z-10">
        <div className="flex items-center gap-4 min-w-0">
          <img src={candidate.photo} alt={candidate.fullName} className="w-12 h-12 rounded-full border border-neutral-600" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-medium text-white truncate">{candidate.fullName}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${badgeClassForDisplay()}`}>{displayBadgeStatus()}</span>
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

      {/* Exam Schedule UI */}
      {showExamCalendar === candidate.id && (
        <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-3 mt-3 relative z-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-white text-sm">Exam Date:</span>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-2 py-1 bg-neutral-700 border border-neutral-600 rounded text-white text-sm appearance-none focus:outline-none" />
            <span className="text-neutral-400 text-xs">11:00 AM</span>

            <button onClick={() => { setShowExamCalendar(null); setSelectedDate(''); }} className="px-3 py-1 bg-neutral-600 rounded text-white text-xs flex items-center gap-1">
              <X size={12} /> Cancel
            </button>
            <button onClick={onScheduleExamInline} className="px-3 py-1 bg-blue-700 rounded text-white text-xs">Schedule</button>
          </div>
        </div>
      )}

      {/* Message Box */}
      {(
        showMessage === `applied-pass-${candidate.id}` ||
        showMessage === `applied-fail-${candidate.id}` ||
        showMessage === `exam-pass-${candidate.id}` ||
        showMessage === `exam-fail-${candidate.id}` ||
        showMessage === `tech-pass-${candidate.id}` ||
        showMessage === `tech-fail-${candidate.id}` ||
        showMessage === `hr-pass-${candidate.id}` ||
        showMessage === `hr-fail-${candidate.id}`
      ) && (
          <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-3 mt-3 relative z-0">
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-2 py-1 bg-neutral-700 border border-neutral-600 rounded text-white text-sm h-16 resize-none mb-2" />
            <div className="flex gap-2">
              <button onClick={() => { closeAllModals(); }} className="px-3 py-1 bg-neutral-600 rounded text-white text-xs flex items-center gap-1"><X size={12} />Cancel</button>
              <button onClick={onSendMessage} className="px-3 py-1 bg-emerald-700 rounded text-white text-xs flex items-center gap-1"><Send size={12} />Send</button>
            </div>
          </div>
        )}

      {/* Inline rating box */}
      {(
        showRating === `tech-${candidate.id}` ||
        showRating === `hr-${candidate.id}` ||
        showRating === `tech-fail-${candidate.id}` ||
        showRating === `hr-fail-${candidate.id}`
      ) && (
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
              <button onClick={() => { closeAllModals(); setRating(0); setMessage(''); }} className="px-3 py-1 bg-neutral-600 rounded text-white text-xs">Cancel</button>
              <button onClick={onSubmitRating} className="px-3 py-1 bg-yellow-600 rounded text-white text-xs">Submit Rating</button>
            </div>
          </div>
        )}
    </div>
  );
};

export default CandidateCard;
