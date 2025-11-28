import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";

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
  const [candidates, setCandidates] = useState([]);

  const [tempStatuses, setTempStatuses] = useState({});

  // Fetch Candidates
  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`https://localhost:7119/api/JobApplication`);
      setCandidates(res.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch candidates!");
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);


  // Round Details 
  const getRounds = (c, type) => {
    if (type === 'tech') {
      if (c.technicalInterview) return [c.technicalInterview];
      return c.techRounds ?? [];
    }
    return c.hrRounds ?? [];
  };

  // Latest Round Logic
  const getLatestRound = (c, type) => {
    const rounds = getRounds(c, type);
    if (!Array.isArray(rounds) || rounds.length === 0) return null;
    return rounds[rounds.length - 1];
  };

  const setRounds = (c, type, rounds) => type === 'tech' ? { ...c, techRounds: rounds } : { ...c, hrRounds: rounds };
  const getRoundCount = (c, type) => getRounds(c, type).length;

  // Update Job Application Status via API Endpoint
  const updateCandidate = async (id, updated) => {
    const c = candidates.find(x => x.jaId === id);
    if (!c) return;

    const dto = {
      userId: c.userId,
      joId: c.joId,
      status: updated.status ?? c.status,
      overallStatus: updated.overallStatus ?? c.overallStatus,
      examDate: updated.examDate ?? c.examDate,
      examResult: updated.examResult ?? c.examResult,
      feedback: updated.feedback ?? c.feedback,
      holdOverallStatus: c.holdOverallStatus
    };
    try {
      await axios.put(`https://localhost:7119/api/JobApplication/update/${id}`, dto);
      toast.success("Status updated successfully!");
      await fetchCandidates();
    }
    catch (err) {
      toast.error(err.response?.data || "Failed to update status!");
    }
  };


  // Exam Schedule
  const scheduleExam = (id, date) => {
    updateCandidate(id, {
      status: "Exam",
      overallStatus: "Exam",
      examDate: date,
      examResult: null
    });
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
      const rejected = { ...setRounds(c, type, newRounds), status: 'Rejected', overallStatus: 'Rejected' };
      return rejected;
    });
  };

  // Fetch All Interviews Assigned to the Interviewer
  const fetchAssignedInterviews = async () => {
    try {
      const res = await axios.get(`https://localhost:7119/api/TechnicalInterview/interviewer`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const assigned = res.data || [];
      setCandidates(prev =>
        prev.map(c => ({
          ...c, isAssignedToInterviewer: assigned.some(i => i.userId === c.userId)
        })));
    }
    catch (err) {
      toast.error("Failed to fetch interviewer assignments!");
    }
  };

  // Update Technical Result
  const updateTechnicalResult = async (tiId, payload) => {
    try {
      await axios.put(`https://localhost:7119/api/TechnicalInterview/update/${tiId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }
      );

      toast.success("Technical Interview result updated!");
      await fetchCandidates();
    }
    catch (err) {
      toast.error(err.response?.data || "Failed to update technical result!");
    }
  };

  // Load Interviewer Data
  const loadInterviewerData = async () => {
    await fetchCandidates();
    await fetchAssignedInterviews();
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

        if (field === 'status') {
          updated.status = value;
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
    updateCandidate,
    fetchAssignedInterviews,
    updateTechnicalResult,
    loadInterviewerData,
  };

  return <CandidateContext.Provider value={value}>{children}</CandidateContext.Provider>;
};
