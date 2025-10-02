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
      id: "8fb58e32-8421-403d-8132-08155fe65994",
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
      id: "a3180004-9693-4639-afe6-0fb6871398f0",
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
      id: "8cad1fa2-3293-48e4-bc56-b114f91e4038",
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
      id: "3f546907-b189-45bd-b381-206bd5b88623",
      fullName: "Sahil Boghara",
      email: "sahil@gmail.com",
      jobTitle: "Full Stack Developer",
      phone: "9087564321",
      appliedDate: "2024-09-21",
      jobApplicationStatus: "Shortlisted",
      overallStatus: "Technical Interview",
      photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
      techRounds: [{ RoundNo: 1, MeetingLink: 'https://www.microsoft.com/en-in/microsoft-teams/group-chat-software', Date: '2024-09-27', Time: '11:00', Feedback: '', Rating: 0, IsClear: 'In Progress', Status: 'In Progress' }],
      hrRounds: [],
      isNextRound: false
    },
    {
      id: "e3e0b08f-aa25-4621-bf46-3fb763d4ec42",
      fullName: "Kevin Tilala",
      email: "kevin.@gmail.com",
      jobTitle: "Full Stack Developer",
      phone: "9876543210",
      appliedDate: "2025-09-28",
      jobApplicationStatus: "Shortlisted",
      overallStatus: "Technical Interview",
      photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
      techRounds: [{ RoundNo: 1, MeetingLink: 'https://www.microsoft.com/en-in/microsoft-teams/group-chat-software', Date: "2025-09-28", Time: "11:00", Feedback: "", Rating: 0, IsClear: "In Progress", Status: "In Progress" }],
      hrRounds: [],
      isNextRound: false
    },
    {
      id: "f26d8515-1d35-4a58-a5da-083987977fee",
      fullName: "Paras Bhut",
      email: "paras@gmail.com",
      jobTitle: "Backend Developer",
      phone: "9012374655",
      appliedDate: "2024-09-20",
      jobApplicationStatus: "Shortlisted",
      overallStatus: "HR Interview",
      photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
      techRounds: [{ RoundNo: 1, MeetingLink: '', Date: '2024-09-26', Time: '12:00', Feedback: '', Rating: 4, IsClear: 'Clear', Status: 'Clear' }],
      hrRounds: [],
      isNextRound: false
    },
    {
      id: "6488528a-468e-4b41-945d-ac746bec9300",
      fullName: "Nehal Padhiyar",
      email: "nehal@gmail.com",
      jobTitle: "Product Manager",
      phone: "9012123682",
      appliedDate: "2024-09-19",
      jobApplicationStatus: "Shortlisted",
      overallStatus: "HR Interview",
      photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
      techRounds: [{ RoundNo: 1, MeetingLink: '', Date: '2024-09-25', Time: '14:00', Feedback: '', Rating: 5, IsClear: 'Clear', Status: 'Clear' }],
      hrRounds: [{ RoundNo: 1, MeetingLink: 'https://www.microsoft.com/en-in/microsoft-teams/group-chat-software', Date: '2024-09-28', Time: '16:00', Feedback: '', Rating: 0, IsClear: 'In Progress', Status: 'In Progress' }],
      isNextRound: false
    },
    {
      id: "aa196370-895c-4b9a-9164-7d98f390d439",
      fullName: "Meet Tank",
      email: "meet@gmail.com",
      jobTitle: "QA Engineer",
      phone: "9000012345",
      appliedDate: "2024-11-01",
      jobApplicationStatus: "Shortlisted",
      overallStatus: "Selected",
      photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
      techRounds: [],
      hrRounds: [],
      selectionStatus: "Document Pending",
      isNextRound: false
    },

    {
      id: "00e22c17-34c4-4f75-94c2-9dd3517f0d97",
      fullName: "Viraj Chotaliya",
      email: "viraj@gmail.com",
      jobTitle: "QA Engineer",
      phone: "9000054321",
      appliedDate: "2024-11-02",
      jobApplicationStatus: "Shortlisted",
      overallStatus: "Selected",
      photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
      techRounds: [],
      hrRounds: [],
      selectionStatus: "Pending",
      documents: {
        aadhar: "https://akm-img-a-in.tosshub.com/businesstoday/images/story/202304/untitled_design_90-sixteen_nine.jpg?size=948:533",
        pan: "https://www.pancardapp.com/blog/wp-content/uploads/2019/04/sample-pan-card.jpg",
        experienceLetter: "https://careers.bhel.in/ar_2025/Experience%20Certificate%20Proforma.pdf",
        bankName: "ICICI Bank",
        bankAccount: "1234567890",
        bankIFSC: "ICIC0001234",
      },
      isNextRound: false
    },

    {
      id: "117ee786-19b6-4b00-adee-818125ac21af",
      fullName: "Yash Dobariya",
      email: "yash@gmail.com",
      jobTitle: "Backend Developer",
      phone: "9000067890",
      appliedDate: "2024-11-03",
      jobApplicationStatus: "Shortlisted",
      overallStatus: "Selected",
      photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
      techRounds: [],
      hrRounds: [],
      selectionStatus: "Accepted",
      isNextRound: false
    },

    {
      id: "f461a3b7-0aea-4110-b0f7-c39ef44d798b",
      fullName: "Parth Nagariya",
      email: "parth@gmail.com",
      jobTitle: "Backend Developer",
      phone: "9000009876",
      appliedDate: "2024-11-04",
      jobApplicationStatus: "Shortlisted",
      overallStatus: "Selected",
      photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
      techRounds: [],
      hrRounds: [],
      selectionStatus: "Declined",
      isNextRound: false
    }
  ]);

  const [tempStatuses, setTempStatuses] = useState({});

  // Round Details helpers
  const getRounds = (c, type) => type === 'tech' ? c.techRounds : c.hrRounds;
  const setRounds = (c, type, rounds) => type === 'tech' ? { ...c, techRounds: rounds } : { ...c, hrRounds: rounds };
  const getLatestRound = (c, type) => {
    const rounds = getRounds(c, type);
    return rounds.length ? rounds[rounds.length - 1] : null;
  };
  const getRoundCount = (c, type) => getRounds(c, type).length;

  const updateCandidate = (id, updater) => {
    if (typeof updater === 'function') {
      setCandidates(prev => prev.map(c => c.id === id ? updater(c) : c));
    } else {
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...updater } : c));
    }
  };

  // Exam Schedule
  const scheduleExam = (id, payload) => {
    let date = '';
    let time = '';
    if (typeof payload === 'string') {
      date = payload;
    } else if (payload && typeof payload === 'object') {
      date = payload.date || payload.examDate || '';
      time = payload.time || payload.examTime || '';
    }
    updateCandidate(id, c => ({ ...c, jobApplicationStatus: 'Exam', overallStatus: 'Exam', examDate: date, examTime: time }));
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
          if (value === 'Selected') updated.jobApplicationStatus = 'Selected';
          else if (value === 'Rejected') updated.jobApplicationStatus = 'Rejected';
        } else if (field === 'jobApplicationStatus') {
          updated.jobApplicationStatus = value;
          if (value === 'Shortlisted') updated.overallStatus = 'Technical Interview';
          else if (value === 'Rejected' || value === 'Fail') updated.overallStatus = 'Rejected';
        } else if (field === 'techStatus' && latestTech) {
          latestTech = { ...latestTech, Status: value };
          updated = setRounds(updated, 'tech', [...getRounds(updated, 'tech').slice(0, -1), latestTech]);
          updated = promoteIfClear(updated, 'tech', value);
        } else if (field === 'techIsClear' && latestTech) {
          latestTech = { ...latestTech, IsClear: value };
          updated = setRounds(updated, 'tech', [...getRounds(updated, 'tech').slice(0, -1), latestTech]);
        } else if (field === 'hrStatus' && latestHr) {
          latestHr = { ...latestHr, Status: value };
          updated = setRounds(updated, 'hr', [...getRounds(updated, 'hr').slice(0, -1), latestHr]);
          updated = promoteIfClear(updated, 'hr', value);
        } else if (field === 'hrIsClear' && latestHr) {
          latestHr = { ...latestHr, IsClear: value };
          updated = setRounds(updated, 'hr', [...getRounds(updated, 'hr').slice(0, -1), latestHr]);
        }
      });

      return updated;
    });

    // Claer Temp Status
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
