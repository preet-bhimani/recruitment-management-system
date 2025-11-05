import React from 'react';
import { Star } from 'lucide-react';
import { useUI } from '../contexts/UIContext';
import { useCandidates } from '../contexts/CandidateContext';

const ModalManager = () => {
  const {
    showExamCalendar,
    showMessage,
    showRating,
    selectedDate,
    setSelectedDate,
    message,
    setMessage,
    rating,
    setRating,
    closeAllModals
  } = useUI();

  const {
    updateCandidate,
    scheduleExam,
    passRound,
    failRound,
    candidates,
    updateStatusViaApi
  } = useCandidates();

  // Get Current Details for Candidates
  const getCurrentCandidate = () => {
    const candidateKey = showExamCalendar || showMessage || showRating;
    if (!candidateKey) return null;

    // Get Original Id
    const actualId = candidateKey.toString().replace(/^(tech-|hr-|pass-|fail-|applied-|exam-)/, '');
    // Find by string id (your candidate ids are strings/UUIDs)
    return candidates.find(c => c.id === actualId) || null;
  };

  const currentCandidate = getCurrentCandidate();

  // Exam Schedule
  const handleExamScheduleConfirm = async () => {
    if (!selectedDate) return alert("Exam date required");

    const jaId = showExamCalendar;
    await updateStatusViaApi(jaId, {
      status: "Exam",
      examDate: selectedDate,
      feedback: message || null
    });

    closeAllModals();
  };


  // Messages
  const handleSendMessageClick = async () => {
    if (!showMessage) return;

    const key = showMessage.toString();
    const jaId = key.replace(/^(jobapp-status-applied-|jobapp-status-shortlist-|jobapp-status-reject-|jobapp-status-hold-)/, "");

    // Applied
    if (key.startsWith("jobapp-status-applied-")) {
      await updateStatusViaApi(jaId, { status: "Applied", feedback: message || null });
      closeAllModals();
      return;
    }

    // Shortlisted
    if (key.startsWith("jobapp-status-shortlist-")) {
      await updateStatusViaApi(jaId, { status: "Shortlisted", feedback: message || null });
      closeAllModals();
      return;
    }

    // Rejected
    if (key.startsWith("jobapp-status-reject-")) {
      await updateStatusViaApi(jaId, { status: "Rejected", feedback: message || null });
      closeAllModals();
      return;
    }

    // Hold
    if (key.startsWith("jobapp-status-hold-")) {
      await updateStatusViaApi(jaId, { status: "Hold", feedback: message || null });
      closeAllModals();
      return;
    }

    closeAllModals();
  };


  // Ratings
  const handleRatingSubmitClick = () => {
    if (!rating || !showRating) return;
    const key = showRating.toString();
    const id = key.replace(/^(tech-|hr-|tech-fail-|hr-fail-)/, '');

    // Tech Rating
    if (key.startsWith('tech-fail-') || key.startsWith('tech-fail') || key.startsWith('tech-') && key.includes('fail')) {
      failRound(id, 'tech', { rating, feedback: message });
      closeAllModals();
      return;
    }
    if (key.startsWith('tech-') && !key.includes('fail')) {
      passRound(id, 'tech', { rating, feedback: message });
      closeAllModals();
      return;
    }

    // HR Rating
    if (key.startsWith('hr-fail-') || key.startsWith('hr-fail') || (key.startsWith('hr-') && key.includes('fail'))) {
      failRound(id, 'hr', { rating, feedback: message });
      closeAllModals();
      return;
    }
    if (key.startsWith('hr-') && !key.includes('fail')) {
      passRound(id, 'hr', { rating, feedback: message });
      closeAllModals();
      return;
    }
    closeAllModals();
  };

  // Rating UI
  const renderStarRating = (currentRating, interactive = false, onRate = null) => {
    return (
      <div className="flex gap-1 items-center">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => interactive && onRate && onRate(s)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}>
            <Star
              size={16}
              className={`${s <= currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-500'}`}
            />
          </button>
        ))}
        <span className="text-white text-sm ml-2">({currentRating}/5)</span>
      </div>
    );
  };



  if (!currentCandidate) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="mb-4 text-center">
          <h3 className="text-white text-lg font-medium">{currentCandidate.fullName}</h3>
          <p className="text-neutral-400 text-sm">{currentCandidate.jobTitle}</p>
        </div>

        {/* Exam Calendar Modal */}
        {showExamCalendar && (
          <div>
            <h4 className="text-white text-sm font-medium mb-3">Schedule Exam</h4>
            <div className="space-y-3">
              <div>
                <label className="text-white text-sm">Exam Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white text-sm" />
              </div>
              <div className="text-neutral-400 text-xs">Time: 11:00 AM</div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={closeAllModals}
                  className="px-4 py-2 bg-neutral-600 hover:bg-neutral-500 rounded text-white text-sm">
                  Cancel
                </button>
                <button
                  onClick={handleExamScheduleConfirm}
                  disabled={!selectedDate}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-white text-sm">
                  Schedule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rating Modal */}
        {showRating && (
          <div>
            <h4 className="text-white text-sm font-medium mb-3">
              {showRating.toString().includes('tech') ? 'Technical Interview Rating' : 'HR Interview Rating'}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-neutral-400 text-sm">Rate out of 5:</span>
                {renderStarRating(rating, true, setRating)}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={closeAllModals}
                  className="px-4 py-2 bg-neutral-600 hover:bg-neutral-500 rounded text-white text-sm">
                  Cancel
                </button>
                <button
                  onClick={handleRatingSubmitClick}
                  disabled={rating === 0}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-white text-sm">
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message Modal */}
        {showMessage && (
          <div>
            <h4 className="text-white text-sm font-medium mb-3">Send Message</h4>
            <div className="space-y-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white text-sm h-24 resize-none"
                placeholder="Type your message..." />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={closeAllModals}
                  className="px-4 py-2 bg-neutral-600 hover:bg-neutral-500 rounded text-white text-sm">
                  Cancel
                </button>
                <button
                  onClick={handleSendMessageClick}
                  disabled={!message.trim()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-white text-sm">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalManager;
