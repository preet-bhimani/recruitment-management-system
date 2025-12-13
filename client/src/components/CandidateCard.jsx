import React, { useMemo, useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Video, Star, X, Send, FileDown } from 'lucide-react';
import { useCandidates } from '../contexts/CandidateContext';
import { useUI } from '../contexts/UIContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CandidateCard = ({ candidate }) => {
  const {
    updateCandidate,
    scheduleExam,
    passRound,
    failRound,
    candidates,
    getLatestRound,
    getRoundCount,
    tempStatuses,
    updateTemp,
    saveTempChanges,
    setTempStatuses,
    updateTechnicalResult,
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
  const [pendingStatus, setPendingStatus] = useState(candidate.status);

  // Latest Rounds
  const latestTech = useMemo(() => {
    const r = getLatestRound(candidate, 'tech');
    if (!r) return null;
    return {
      ...r,
      Status: r.Status ?? "In Progress",
      IsClear: r.IsClear ?? "In Progress",

      MeetingSubject: r.meetingSubject ?? "",
      MeetingLink: r.meetingLink ?? "",

      TechDate: r.techDate ?? "",
      TechTime: r.techTime ?? "",

      InterviewerName: r.interviewerName ?? "",
      InterviewerEmail: r.interviewerEmail ?? "",

      TechRating: r.techRating ?? null,
      TechFeedback: r.TechFeedback ?? r.techFeedback ?? "",
    };
  }, [candidate]);

  // Get Latest Technical Interview Round from Table
  const getEffectiveLatestTech = () => {
    if (!latestTech) return null;

    const techIsClearTemp = tempStatuses[`${candidate.jaId}-techIsClear`];
    const techStatusTemp = tempStatuses[`${candidate.jaId}-techStatus`];

    return {
      ...latestTech,
      IsClear: techIsClearTemp ?? latestTech.IsClear,
      Status: techStatusTemp ?? latestTech.Status,
    };
  };

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

  const effectiveOverall = () => tempStatuses?.[`${candidate.jaId}-overallStatus`] ?? candidate.overallStatus;

  // Find Candidate Who Reject on Technical Interview Part
  const isInTechStageUI = () => {
    const overall = candidate.overallStatus;
    const rejectionStage = candidate.rejectionStage;
    const hasAnyTechRound = Array.isArray(candidate.techRounds) && candidate.techRounds.length > 0;

    if (overall === "Technical Interview") return true;
    if (overall === "Rejected" && rejectionStage === "Technical Interview") return true;
    if (overall === "Hold" && hasAnyTechRound) return true;

    return false;
  };

  // After Pass or Fail Flow
  const passFailFlowActive = () => {
    const m = showMessage || '';
    const r = showRating || '';
    return (m && (m.endsWith(`-${candidate.jaId}`) && (m.startsWith('tech-') || m.startsWith('hr-')))) ||
      (r && r.endsWith(`-${candidate.jaId}`) && (r.startsWith('tech-') || r.startsWith('hr-')));
  };

  // Meeting for Tech Rounds
  const shouldShowMeetingTech = () => {
    if (passFailFlowActive()) return false;

    const latest = getEffectiveLatestTech();
    // No Round Yet Show
    if (!latest) return true;

    // Show when Last Round Clear and Status In Progress
    if (latest.IsClear === "Clear" && latest.Status === "In Progress") {
      return true;
    }
    return false;
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

  // Technical IsClear Change Value
  const handleTechIsClearChange = (val) => {
    updateTemp(candidate.jaId, "techIsClear", val);

    if (showMessage || showRating) return;

    if (val === "Clear" || val === "Not Clear") {
      setMessage(getDefaultMessage(val === "Clear" ? "tech-clear" : "tech-not-clear"));
      setShowMessage(`tech-${val === "Clear" ? "pass" : "fail"}-${candidate.jaId}`);
    }
  };

  // Technical Status Change Value
  const handleTechStatusChange = (val) => {
    updateTemp(candidate.jaId, "techStatus", val);

    if (showMessage || showRating) return;

    if (val === "Clear" || val === "Not Clear") {
      setMessage(getDefaultMessage(val === "Clear" ? "tech-clear" : "tech-not-clear"));
      setShowMessage(`tech-${val === "Clear" ? "pass" : "fail"}-${candidate.jaId}`);
    }
  };

  // HR IsClear Change Value
  const handleHrIsClearChange = (val) => {
    updateTemp(candidate.jaId, 'hrIsClear', val);
  };

  // HR Status Change Value
  const handleHrStatusChange = (val) => {
    updateTemp(candidate.jaId, 'hrStatus', val);
  };

  const toggleExamCalendar = () => setShowExamCalendar(showExamCalendar === candidate.jaId ? null : candidate.jaId);

  // Schdeule Exam Logic
  const onScheduleExamInline = () => {
    if (!selectedDate) return alert("Pick a date");
    scheduleExam(candidate.jaId, selectedDate);
    setSelectedDate("");
    setShowExamCalendar(null);
  };

  // Open Exam Pass Modal
  const openExamPass = () => {
    openActionModalFor("pass");
  };

  // Open Exam Fail Modal
  const openExamFail = () => {
    openActionModalFor("fail");
  };

  const openPass = (type) => { setMessage(getDefaultMessage(type === 'tech' ? 'tech-clear' : 'hr-clear')); setShowMessage(type === 'tech' ? `tech-pass-${candidate.jaId}` : `hr-pass-${candidate.jaId}`); };
  const openFail = (type) => { setMessage(getDefaultMessage(type === 'tech' ? 'tech-not-clear' : 'hr-not-clear')); setShowMessage(type === 'tech' ? `tech-fail-${candidate.jaId}` : `hr-fail-${candidate.jaId}`); };

  // Status Chaneg Modal
  const openActionModalFor = (actionType) => {
    setMessage(getDefaultMessage(actionType));
    setShowMessage(`${actionType}-${candidate.jaId}`);
  };

  // Open Shortlist Modal
  const openShortlistModal = () => {
    openActionModalFor('select');
  };

  // Open Reject Modal
  const openRejectModal = () => {
    openActionModalFor('reject');
  };

  // Message Logic
  const onSendMessage = () => {
    if (!message.trim()) return alert('Write a message');
    const key = showMessage || '';

    if (key === `select-${candidate.jaId}`) {
      updateCandidate(candidate.jaId, {
        status: "Shortlisted",
        overallStatus: "Technical Interview",
        feedback: message
      });
      closeAllModals();
      return;
    }

    if (key === `reject-${candidate.jaId}`) {
      updateCandidate(candidate.jaId, {
        status: "Rejected",
        overallStatus: "Rejected",
        feedback: message
      });
      closeAllModals();
      return;
    }

    if (key === `hold-${candidate.jaId}`) {
      updateCandidate(candidate.jaId, {
        status: "Hold",
        overallStatus: "Hold",
        feedback: message
      });
      closeAllModals();
      return;
    }

    if (key === `pass-${candidate.jaId}`) {
      updateCandidate(candidate.jaId, {
        status: "Exam",
        overallStatus: "Technical Interview",
        examResult: "Pass",
        feedback: message
      });
      closeAllModals();
      return;
    }

    if (key === `fail-${candidate.jaId}`) {
      updateCandidate(candidate.jaId, {
        status: "Rejected",
        overallStatus: "Rejected",
        examResult: "Fail",
        feedback: message
      });
      closeAllModals();
      return;
    }

    if (key === `tech-pass-${candidate.jaId}`) { setShowMessage(null); setShowRating(`tech-${candidate.jaId}`); return; }
    if (key === `tech-fail-${candidate.jaId}`) { setShowMessage(null); setShowRating(`tech-fail-${candidate.jaId}`); return; }
    if (key === `hr-pass-${candidate.jaId}`) { setShowMessage(null); setShowRating(`hr-${candidate.jaId}`); return; }
    if (key === `hr-fail-${candidate.jaId}`) { setShowMessage(null); setShowRating(`hr-fail-${candidate.jaId}`); return; }

    setShowMessage(null);
  };

  // Rating Logic
  const onSubmitRating = () => {
    if (!rating) return alert('Pick 1-5');
    const r = showRating || '';
    if (r === `hr-fail-${candidate.jaId}`) { failRound(candidate.jaId, 'hr', { rating, feedback: message }); setShowRating(null); setRating(0); setMessage(''); return; }
    if (r === `hr-${candidate.jaId}`) { passRound(candidate.jaId, 'hr', { rating, feedback: message }); setShowRating(null); setRating(0); setMessage(''); return; }
  };

  // Final Rating After Status Change
  const onSubmitRecruiterTechRating = async () => {
    const latest = latestTech;
    if (!latest) return;

    const tiId = latest.tiId || latest.TIId;

    const isPass = showRating === `tech-${candidate.jaId}`;

    const payload = {
      techIsClear: isPass ? "Clear" : "Not Clear",
      techStatus: isPass ? "Clear" : "Not Clear",
      techRating: rating,
      techFeedback: message.trim(),

      techDate: latest.TechDate || "",
      techTime: latest.TechTime || "00:00",

      utDto: {},

      meetingSubject: latest.MeetingSubject || "",
      meetingLink: latest.MeetingLink || "",
      interviewerName: latest.InterviewerName || "",
      interviewerEmail: latest.InterviewerEmail || ""
    };

    try {
      await updateTechnicalResult(tiId, payload);
    }
    catch (err) {
      toast.error(err?.response?.data ?? "Failed to update technical result!");
    }

    delete tempStatuses[`${candidate.jaId}-techIsClear`];
    delete tempStatuses[`${candidate.jaId}-techStatus`];

    closeAllModals();
    setRating(0);
    setMessage("");
  };

  // Handle Save Job Application Status
  const handleSaveStatus = () => {
    const value = pendingStatus;

    if (value === "Exam") {
      setShowExamCalendar(candidate.jaId);
      return;
    }

    if (value === "Shortlisted") {
      openActionModalFor("select");
      return;
    }

    if (value === "Rejected") {
      openActionModalFor("reject");
      return;
    }

    if (value === "Hold") {
      openActionModalFor("hold");
      return;
    }
  };

  // Technical Interview Drop Down Save
  const onSaveTechDropdown = () => {
    const isClearTemp = tempStatuses[`${candidate.jaId}-techIsClear`];
    const statusTemp = tempStatuses[`${candidate.jaId}-techStatus`];

    if (isClearTemp === undefined && statusTemp === undefined) return;
    if (showMessage || showRating) return;

    const latest = latestTech;
    if (!latest) return true;

    if (isClearTemp === "Clear") {
      setMessage(getDefaultMessage("tech-clear"));
      setShowMessage(`tech-pass-${candidate.jaId}`);
      return;
    }

    if (isClearTemp === "Not Clear") {
      setMessage(getDefaultMessage("tech-not-clear"));
      setShowMessage(`tech-fail-${candidate.jaId}`);
      return;
    }

    updateTechnicalResult(latest?.tiId || latest?.TIId, {
      techStatus: statusTemp ?? latest.Status,
      techIsClear: isClearTemp ?? latest.IsClear,
      meetingSubject: latest.MeetingSubject,
      interviewerName: latest.InterviewerName,
      interviewerEmail: latest.InterviewerEmail,
      techRating: latest.TechRating,
      techFeedback: latest.TechFeedback
    });

    delete tempStatuses[`${candidate.jaId}-techIsClear`];
    delete tempStatuses[`${candidate.jaId}-techStatus`];
    setTempStatuses({ ...tempStatuses });
  };

  // Open Meeting Button and Navigate
  const openMeeting = (type) => {
    const nextTechRound = (candidate.techRounds?.length ?? 0) + 1;

    navigate("/recruiter-meeting-scheduling", {
      state: {
        candidateId: candidate.jaId,
        type: "tech",
        joId: candidate.joId,
        jaId: candidate.jaId,
        userId: candidate.userId,
        roundNo: nextTechRound
      }
    });
  };

  useEffect(() => {
    setPendingStatus(candidate.status);
  }, [candidate.status]);

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
            value={pendingStatus ?? candidate.status}
            onChange={(e) => setPendingStatus(e.target.value)}
            className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white appearance-none focus:outline-none">
            <option value="Applied">Applied</option>
            <option value="Exam">Exam</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
            <option value="Hold">Hold</option>
          </select>
        )}

        {/* Show Technical DropDowns */}
        {isInTechStageUI() && (
          <>
            <select
              value={tempStatuses[`${candidate.jaId}-techIsClear`] ?? (latestTech?.IsClear ?? 'In Progress')}
              onChange={(e) => handleTechIsClearChange(e.target.value)}
              className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white appearance-none focus:outline-none">
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Clear">Clear</option>
              <option value="Not Clear">Not Clear</option>
              <option value="Hold">Hold</option>
            </select>

            <select
              value={tempStatuses[`${candidate.jaId}-techStatus`] ?? (latestTech?.Status ?? 'In Progress')}
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
              value={tempStatuses[`${candidate.jaId}-hrIsClear`] ?? (latestHr?.IsClear ?? 'In Progress')}
              onChange={(e) => handleHrIsClearChange(e.target.value)}
              className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white appearance-none focus:outline-none">
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Clear">Clear</option>
              <option value="Not Clear">Not Clear</option>
            </select>

            <select
              value={tempStatuses[`${candidate.jaId}-hrStatus`] ?? (latestHr?.Status ?? 'In Progress')}
              onChange={(e) => handleHrStatusChange(e.target.value)}
              className="px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-xs text-white appearance-none focus:outline-none">
              <option value="In Progress">In Progress</option>
              <option value="Clear">Clear</option>
              <option value="Not Clear">Not Clear</option>
            </select>
          </>
        )}

        {/* Save Button Logic */}
        {pendingStatus !== candidate.status && !showExamCalendar && (
          <button onClick={handleSaveStatus} className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs text-white"> ✓ Save </button>
        )}

        {/* Save Button Logic for Technical Interview */}
        {isInTechStageUI() &&
          (
            tempStatuses[`${candidate.jaId}-techIsClear`] !== undefined ||
            tempStatuses[`${candidate.jaId}-techStatus`] !== undefined
          ) && !showMessage && !showRating && (
            <button onClick={onSaveTechDropdown} className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs text-white"> Save </button>
          )}

        {/* Selected or Rejected When Applied */}
        {effectiveOverall() === 'Applied' && (
          <>
            <button onClick={openShortlistModal} className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-xs text-white" title="Shortlist">
              <CheckCircle size={14} />
            </button>
            <button onClick={openRejectModal} className="px-2 py-1 bg-red-800 hover:bg-red-700 rounded text-xs text-white" title="Reject">
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
        {isInTechStageUI() && shouldShowMeetingTech() && !showMessage && !showRating && (
          <button onClick={() => openMeeting('tech')} className="px-2 py-1 bg-indigo-700 hover:bg-indigo-600 rounded text-xs text-white" title="Schedule Tech Meeting">
            <Video size={14} />
          </button>
        )}

        {effectiveOverall() === 'HR Interview' && shouldShowMeetingHR() && (
          <button onClick={() => openMeeting('hr')} className="px-2 py-1 bg-pink-700 hover:bg-pink-600 rounded text-xs text-white" title="Schedule HR Meeting">
            <Video size={14} />
          </button>
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
          <img
            src={candidate.photo}
            alt={candidate.fullName}
            className="w-12 h-12 min-w-12 min-h-12 rounded-full border border-neutral-600 shrink-0 object-cover" />

          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-medium text-white truncate">{candidate.fullName}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${badgeClassForDisplay()}`}>{displayBadgeStatus()}</span>
              {candidate.overallStatus === 'Technical Interview' && <span className="bg-orange-600 text-white px-2 py-0.5 rounded-full text-xs">Round: {techRounds || 0}</span>}
              {candidate.overallStatus === 'HR Interview' && <span className="bg-orange-600 text-white px-2 py-0.5 rounded-full text-xs">Round: {hrRounds || 0}</span>}
              {candidate.overallStatus === 'Hold' && <span className="bg-gray-600 text-white px-2 py-0.5 rounded-full text-xs">{candidate.holdOverallStatus}</span>}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-neutral-400">
              <span className="truncate"><span className="text-purple-200">Email:</span> {candidate.email}</span>
              <span className="truncate"><span className="text-purple-200">Job:</span> {candidate.title}</span>
              <span className="truncate"><span className="text-purple-200">Phone:</span> {candidate.phoneNumber}</span>
              <span className="truncate"><span className="text-purple-200">Applied:</span> {candidate.appliedDate}</span>
            </div>
          </div>
        </div>

        <ControlBar />
      </div>

      {/* Exam Schedule UI */}
      {showExamCalendar === candidate.jaId && (
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
      {showMessage && showMessage.endsWith(`-${candidate.jaId}`) && (
        <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-3 mt-3 relative z-0">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-2 py-1 bg-neutral-700 border border-neutral-600 rounded text-white text-sm h-16 resize-none mb-2" />
          <div className="flex gap-2">
            <button onClick={() => { closeAllModals(); }}
              className="px-3 py-1 bg-neutral-600 rounded text-white text-xs flex items-center gap-1">
              <X size={12} />Cancel
            </button>
            <button onClick={onSendMessage}
              className="px-3 py-1 bg-emerald-700 rounded text-white text-xs flex items-center gap-1">
              <Send size={12} />Send
            </button>
          </div>
        </div>
      )}

      {/* Inline Rating Box */}
      {(
        showRating === `tech-${candidate.jaId}` ||
        showRating === `hr-${candidate.jaId}` ||
        showRating === `tech-fail-${candidate.jaId}` ||
        showRating === `hr-fail-${candidate.jaId}`
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
              <button
                onClick={() => {
                  if (showRating.startsWith('tech-')) {
                    onSubmitRecruiterTechRating();
                  }
                  else {
                    onSubmitRating();
                  }
                }}
                className="px-3 py-1 bg-yellow-600 rounded text-white text-xs">
                Submit Rating
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default CandidateCard;
