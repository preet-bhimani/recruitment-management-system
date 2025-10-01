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

  const { handleStatusChange, candidates } = useCandidates();

  // Get The Current Candidates
  const getCurrentCandidate = () => {
    const candidateId = showExamCalendar || showMessage || showRating;
    if (!candidateId) return null;
    
    // Remove Prefiex and Keep Original Candidate Id
    const actualId = candidateId.toString().replace(/^(tech-|hr-|pass-|fail-)/, '');
    return candidates.find(c => c.id === parseInt(actualId));
  };

  const currentCandidate = getCurrentCandidate();

  // Exam Schedule 
  const handleExamScheduleClick = () => {
    if (selectedDate && showExamCalendar) {
      console.log('Scheduling exam for candidate:', showExamCalendar, 'on:', selectedDate);
      handleStatusChange(showExamCalendar, 'examDate', selectedDate);
      handleStatusChange(showExamCalendar, 'jobApplicationStatus', 'Exam');
      closeAllModals();
    }
  };

  // Messages
  const handleSendMessageClick = () => {
    if (message && showMessage) {
      console.log('Sending message to candidate:', showMessage, 'Message:', message);
      closeAllModals();
    }
  };

  // Ratings
  const handleRatingSubmitClick = () => {
    if (rating && showRating) {
      console.log('Submitting rating:', rating, 'for:', showRating);
      
      const candidateId = showRating.toString().replace(/^(tech-|hr-|pass-|fail-)/, '');
      if (showRating.includes('tech')) {
        handleStatusChange(parseInt(candidateId), 'techInterviewRating', rating);
      } else if (showRating.includes('hr')) {
        handleStatusChange(parseInt(candidateId), 'hrInterviewRating', rating);
      }
      closeAllModals();
    }
  };

  // Show Stars
  const renderStarRating = (rating, interactive = false, onRate = null) => {
    return (
      <div className="flex gap-1 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}>
            <Star
              size={16}
              className={`${star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-neutral-500'
              }`}/>
          </button>
        ))}
        <span className="text-white text-sm ml-2">({rating}/5)</span>
      </div>
    );
  };

  if (!currentCandidate) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-800 border border-neutral-600 rounded-lg p-6 max-w-md w-full mx-4">
        
        {/* Show Candidate Name into Modal */}
        <div className="mb-4 text-center">
          <h3 className="text-white text-lg font-medium">{currentCandidate.fullName}</h3>
          <p className="text-neutral-400 text-sm">{currentCandidate.jobTitle}</p>
        </div>

        {/* Calendar Modal */}
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
                  className="w-full mt-1 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white text-sm"/>
              </div>
              <div className="text-neutral-400 text-xs">Time: 11:00 AM</div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={closeAllModals}
                  className="px-4 py-2 bg-neutral-600 hover:bg-neutral-500 rounded text-white text-sm">
                  Cancel
                </button>
                <button
                  onClick={handleExamScheduleClick}
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
                placeholder="Type your message..."/>
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
