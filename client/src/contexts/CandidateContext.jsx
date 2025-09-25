import React, { createContext, useContext, useState } from 'react';

const CandidateContext = createContext();

export const useCandidates = () => {
  const ctx = useContext(CandidateContext);
  if (!ctx) throw new Error('useCandidates must be used within CandidateProvider');
  return ctx;
};

// Create Round
const makeRound = (roundNo, link = '', date = '', time = '') => ({
  RoundNo: roundNo,
  MeetingLink: link,
  Date: date,
  Time: time,
  Feedback: '',
  Rating: 0,
  IsClear: 'In Progress',   
  Status: 'In Progress'    
});

// Candidates Details
export const CandidateProvider = ({ children }) => {
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      fullName: "Preet Bhimani",
      email: "preet@gmail.com",
      jobTitle: "Data Science",
      phone: "9876543210",
      appliedDate: "2024-09-25",
      jobApplicationStatus: "Applied",
      overallStatus: "Applied",
      photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
      techRounds: [],
      hrRounds: [],
      isNextRound: false
    },
    {
      id: 2,
      fullName: "Umang Paneri",
      email: "umang@gmail.com",
      jobTitle: "Sr. Developer",
      phone: "9876567892",
      appliedDate: "2024-09-23",
      jobApplicationStatus: "Exam",
      overallStatus: "Exam",
      photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
      techRounds: [],
      hrRounds: [],
      isNextRound: false
    },
    {
      id: 3,
      fullName: "Vishva Antala",
      email: "vishva@gmail.com",
      jobTitle: "UI/UX Designer",
      phone: "9128374655",
      appliedDate: "2024-09-22",
      jobApplicationStatus: "Shortlisted",
      overallStatus: "Technical Interview",
      photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
      techRounds: [],    
      hrRounds: [],
      isNextRound: false
    },
    {
      id: 4,
      fullName: "Sahil Boghara",
      email: "sahil@gmail.com",
      jobTitle: "Full Stack Developer",
      phone: "9087564321",
      appliedDate: "2024-09-21",
      jobApplicationStatus: "Shortlisted",
      overallStatus: "Technical Interview",
      photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
      techRounds: [{ RoundNo: 1, MeetingLink: '', Date: '2024-09-27', Time: '11:00', Feedback: '', Rating: 0, IsClear: 'In Progress', Status: 'In Progress' }],
      hrRounds: [],
      isNextRound: false
    },
    {
      id: 5,
      fullName: "Paras Bhut",
      email: "paras@gmail.com",
      jobTitle: "Backend Developer",
      phone: "9012374655",
      appliedDate: "2024-09-20",
      jobApplicationStatus: "Shortlisted",
      overallStatus: "HR Interview",
      photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
      techRounds: [{ RoundNo: 1, MeetingLink: '', Date: '2024-09-26', Time: '12:00', Feedback: '', Rating: 4, IsClear: 'Clear', Status: 'In Progress' }],
      hrRounds: [],
      isNextRound: false
    },
    {
      id: 6,
      fullName: "Nehal Padhiyar",
      email: "nehal@gmail.com",
      jobTitle: "Product Manager",
      phone: "9012123682",
      appliedDate: "2024-09-19",
      jobApplicationStatus: "Shortlisted",
      overallStatus: "HR Interview",
      photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
      techRounds: [{ RoundNo: 1, MeetingLink: '', Date: '2024-09-25', Time: '14:00', Feedback: '', Rating: 3, IsClear: 'Clear', Status: 'In Progress' }],
      hrRounds: [{ RoundNo: 1, MeetingLink: '', Date: '2024-09-28', Time: '16:00', Feedback: '', Rating: 0, IsClear: 'In Progress', Status: 'In Progress' }],
      isNextRound: false
    }
  ]);

  const [tempStatuses, setTempStatuses] = useState({}); 

  // Round Details
  const getRounds = (c, type) => type === 'tech' ? c.techRounds : c.hrRounds;
  const setRounds = (c, type, rounds) => type === 'tech' ? { ...c, techRounds: rounds } : { ...c, hrRounds: rounds };
  const getLatestRound = (c, type) => {
    const rounds = getRounds(c, type);
    return rounds.length ? rounds[rounds.length - 1] : null;
  };
  const getRoundCount = (c, type) => getRounds(c, type).length;

  const updateCandidate = (id, updater) => {
    setCandidates(prev => prev.map(c => c.id === id ? updater(c) : c));
  };

  // Exam scheduling
  const scheduleExam = (id, date) => {
    updateCandidate(id, c => ({ ...c, jobApplicationStatus: 'Exam', overallStatus: 'Exam', examDate: date }));
  };

  // If Tech/HR interview Cleared and Move to Next Stage
  const promoteIfClear = (c, type, newStatus) => {
    if (newStatus === 'Clear') {
      if (type === 'tech') {
        return { ...c, overallStatus: 'HR Interview' };
      }
      if (type === 'hr') {
        return { ...c, overallStatus: 'Selected' };
      }
    }
    return c;
  };

  // Create Round
  const createRound = (id, type, { link = '', date = '', time = '' } = {}) => {
    updateCandidate(id, c => {
      const rounds = getRounds(c, type);
      const nextNo = rounds.length + 1;
      const newRound = makeRound(nextNo, link, date, time);
      const newRounds = [...rounds, newRound];
      return setRounds(c, type, newRounds);
    });
  };

  // Pass Round
  const passRound = (id, type, { rating = 0, feedback = '' } = {}) => {
    updateCandidate(id, c => {
      const rounds = getRounds(c, type);
      if (!rounds.length) return c;
      const last = { ...rounds[rounds.length - 1] };
      last.Rating = rating;
      last.Feedback = feedback;
      last.IsClear = 'Clear';
      const newRounds = [...rounds.slice(0, -1), last];
      return setRounds(c, type, newRounds);
    });
  };

  // Fail Round
  const failRound = (id, type, { rating = 0, feedback = '' } = {}) => {
    updateCandidate(id, c => {
      const rounds = getRounds(c, type);
      if (!rounds.length) return c;
      const last = { ...rounds[rounds.length - 1] };
      last.Rating = rating;
      last.Feedback = feedback;
      last.Status = 'Not Clear';
      const newRounds = [...rounds.slice(0, -1), last];
      const rejected = { ...setRounds(c, type, newRounds), jobApplicationStatus: 'Rejected', overallStatus: 'Rejected' };
      return rejected;
    });
  };

  // Save Changes
  const saveTempChanges = (id) => {
    const changes = Object.entries(tempStatuses).filter(([k]) => k.startsWith(`${id}-`));
    updateCandidate(id, c => {
      let updated = { ...c };
      let latestTech = getLatestRound(updated, 'tech');
      let latestHr = getLatestRound(updated, 'hr');

      changes.forEach(([key, value]) => {
        const field = key.split('-').slice(1).join('-');
        if (field === 'overallStatus') {
          updated.overallStatus = value;
        } else if (field === 'techStatus') {
          if (latestTech) {
            latestTech = { ...latestTech, Status: value };
            const rs = getRounds(updated, 'tech');
            const newRs = [...rs.slice(0, -1), latestTech];
            updated = setRounds(updated, 'tech', newRs);
            updated = promoteIfClear(updated, 'tech', value);
          }
        } else if (field === 'techIsClear') {
          if (latestTech) {
            latestTech = { ...latestTech, IsClear: value };
            const rs = getRounds(updated, 'tech');
            const newRs = [...rs.slice(0, -1), latestTech];
            updated = setRounds(updated, 'tech', newRs);
          }
        } else if (field === 'hrStatus') {
          if (latestHr) {
            latestHr = { ...latestHr, Status: value };
            const rs = getRounds(updated, 'hr');
            const newRs = [...rs.slice(0, -1), latestHr];
            updated = setRounds(updated, 'hr', newRs);
            updated = promoteIfClear(updated, 'hr', value);
          }
        } else if (field === 'hrIsClear') {
          if (latestHr) {
            latestHr = { ...latestHr, IsClear: value };
            const rs = getRounds(updated, 'hr');
            const newRs = [...rs.slice(0, -1), latestHr];
            updated = setRounds(updated, 'hr', newRs);
          }
        } else if (field === 'jobApplicationStatus') {
          updated.jobApplicationStatus = value;
          if (value === 'Shortlisted') updated.overallStatus = 'Technical Interview';
          if (value === 'Rejected' || value === 'Fail') updated.overallStatus = 'Rejected';
        }
      });

      return updated;
    });

    // Tempraorary Status Clean 
    setTempStatuses(prev => {
      const out = { ...prev };
      Object.keys(out).forEach(k => { if (k.startsWith(`${id}-`)) delete out[k]; });
      return out;
    });
  };

  const updateTemp = (id, field, value) => {
    setTempStatuses(prev => ({ ...prev, [`${id}-${field}`]: value }));
  };

  const hasTemp = (id, field, original) => {
    const v = tempStatuses[`${id}-${field}`];
    return v !== undefined && v !== original;
  };

  const value = {
    candidates,
    setCandidates,
    getLatestRound,
    getRoundCount,
    createRound,
    passRound,
    failRound,
    scheduleExam,
    tempStatuses,
    updateTemp,
    hasTemp,
    saveTempChanges,
    updateCandidate
  };

  return <CandidateContext.Provider value={value}>{children}</CandidateContext.Provider>;
};
