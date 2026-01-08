import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from '../routes/axiosInstance';

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
  const { role, token } = useAuth();
  const [tempStatuses, setTempStatuses] = useState({});

  // Fetch Candidates
  const fetchCandidates = async () => {
    try {
      const res = await axiosInstance.get(`JobApplication`)
      setCandidates((res.data || []).map(c => ({
        ...c,
        rejectionStage: c.rejectionStage ?? null,
      })));
    }
    catch (err) {
      toast.error("Failed to fetch candidates!");
    }
  };

  // Fetch HR Interviews
  const fetchHRInterviews = async () => {
    try {
      const res = await axios.get(`https://localhost:7119/api/HRInterview/hr`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const hrList = res.data || [];
      setCandidates(prevCandidates =>
        prevCandidates.map(c => {
          const hrRounds = hrList
            .filter(r => String(r.jaId) === String(c.jaId))
            .map(r => ({
              ...r,
              Status: r.hrStatus,
              IsClear: r.hrIsClear,
              Rating: r.hrRating,
              Feedback: r.hrFeedback,
              hiId: r.hiId,
              hrDate: r.hrDate,
              hrTime: r.hrTime,
              noOfRound: r.noOfRound,
              meetingLink: r.meetingLink,
              meetingSubject: r.meetingSubject,
              interviewerName: r.interviewerName,
              interviewerEmail: r.interviewerEmail,
            }));

          if (hrRounds.length > 0) {
            return { ...c, hrRounds };
          }
          return c;
        })
      );
    }
    catch (err) {
      toast.error("Failed to fetch HR interviews!");
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchCandidates();

      if (role === "Interviewer") {
        await fetchAssignedInterviews();
      }

      if (role === "HR") {
        await fetchHRInterviews();
        await fetchCandidatesUnderHR();
      }

      if (role === "Recruiter") {
        await fetchTechInterviews();
        await fetchAllHRRounds();
        await fetchOfferLetters();
      }
    };
    load();
  }, [role]);


  // Round Details
  const getRounds = (c, type) => {
    return Array.isArray(type === "tech" ? c.techRounds : c.hrRounds)
      ? (type === "tech" ? c.techRounds : c.hrRounds)
      : [];
  };

  // Latest Round For Tech and HR Interview
  const getLatestRound = (c, type) => {
    const rounds = getRounds(c, type);
    if (!rounds.length) return null;

    const last = rounds[rounds.length - 1];

    return {
      ...last,
      Status: last.Status ?? last.hrStatus ?? last.techStatus ?? "In Progress",
      IsClear: last.IsClear ?? last.hrIsClear ?? last.techIsClear ?? "In Progress",
      Rating: last.Rating ?? last.hrRating ?? last.techRating ?? 0,
      Feedback: last.Feedback ?? last.hrFeedback ?? last.techFeedback ?? "",
      tiId: last.tiId ?? last.TIId ?? last.id,
      hiId: last.hiId ?? last.HIId ?? last.id
    };
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
      await axiosInstance.put(`JobApplication/update/${id}`, dto)
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
      const res = await axiosInstance.get(`TechnicalInterview/interviewer`)

      const assigned = res.data || [];

      setCandidates(prev =>
        prev.map(c => {
          const techRounds = assigned.filter(i =>
            String(i.jaId) === String(c.jaId)
          );

          return {
            ...c,
            isAssignedToInterviewer: techRounds.length > 0,
            techRounds
          };
        })
      );
    } catch (err) {
      toast.error("Failed to fetch interviewer assignments!");
    }
  };

  // Now Recruiter Also Get All Candidates for Technical Interview
  const fetchTechInterviews = async () => {
    try {
      const res = await axiosInstance.get(`TechnicalInterview`);
      const techList = res.data || [];

      setCandidates(prev =>
        prev.map(c => {
          const techRounds = techList.filter(r => String(r.jaId) === String(c.jaId));
          return { ...c, techRounds };
        })
      );
    }
    catch (err) {
      toast.error("Failed to load technical rounds!");
    }
  };

  // Update Technical Result
  const updateTechnicalResult = async (tiId, payload) => {
    try {
      await axiosInstance.put(`TechnicalInterview/update/${tiId}`, payload)

      toast.success("Technical Interview result updated!");
      await fetchCandidates();
      await fetchTechInterviews();
    }
    catch (err) {
      toast.error(err.response?.data || "Failed to update technical result!");
      throw err;
    }
  };

  // Load Interviewer Data
  const loadInterviewerData = async () => {
    await fetchCandidates();
    await fetchAssignedInterviews();
  };

  // Fetch ALL HR rounds for Recruiter
  const fetchAllHRRounds = async () => {
    try {
      const res = await axios.get(
        "https://localhost:7119/api/HRInterview",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const hrList = res.data || [];

      setCandidates(prev =>
        prev.map(c => {
          const hrRounds = hrList
            .filter(r => String(r.jaId) === String(c.jaId))
            .map(r => ({
              hiId: r.hiId,
              noOfRound: r.noOfRound,
              hrDate: r.hrDate,
              hrTime: r.hrTime,
              meetingLink: r.meetingLink,
              meetingSubject: r.meetingSubject,
              interviewerName: r.interviewerName,
              interviewerEmail: r.interviewerEmail,
              Status: r.hrStatus,
              IsClear: r.hrIsClear,
              Rating: r.hrRating,
              Feedback: r.hrFeedback
            }));

          return hrRounds.length > 0 ? { ...c, hrRounds } : c;
        })
      );
    }
    catch (err) {
      toast.error("Failed to fetch all HR rounds!");
    }
  };

  // Update HR Round
  const updateHRInterview = async (hiId, payload) => {
    try {
      await axios.put(`https://localhost:7119/api/HRInterview/update/${hiId}`, payload);

      toast.success("HR round updated!");

      await fetchCandidates();
      await fetchAllHRRounds();

      if (role === "HR") {
        await fetchHRInterviews();
      }
    }
    catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Failed to update HR round!");
    }
  };

  // Fetch Candidate Documents
  const fetchCandidateDocuments = async (jaId) => {
    try {
      const res = await axios.get(`https://localhost:7119/api/DocumentList/${jaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }
      );

      const doc = res.data;

      setCandidates(prev =>
        prev.map(c =>
          String(c.jaId) === String(jaId)
            ? { ...c, documents: doc }
            : c
        ));
    }
    catch (err) {
      toast.error("Failed to fetch candidate documents!");
    }
  };

  // Fetch Candidates Under HR
  const fetchCandidatesUnderHR = async () => {
    const res = await axios.get("https://localhost:7119/api/OfferLetter/hr", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = res.data || [];

    setCandidates(prev =>
      prev.map(c => {
        const found = data.find(x => String(x.jaId) === String(c.jaId));
        return found ? { ...c, ...found } : c;
      })
    );
  };

  // Fetch Offer Letter Details
  const fetchOfferLetters = async () => {
    try {
      const res = await axios.get("https://localhost:7119/api/OfferLetter");
      const offers = res.data || [];

      setCandidates(prev =>
        prev.map(c => {
          const offer = offers.find(
            o => String(o.jaId) === String(c.jaId)
          );

          return {
            ...c,
            olId: offer?.olId ?? null,
            offerLetterStatus: offer?.offerLetterStatus ?? null,
            templateType: offer?.templateType,
            salary: offer?.salary,
            joiningDate: offer?.joiningDate,
            bondTime: offer?.bondTime,
            endDate: offer?.endDate
          };
        })
      );
    }
    catch (err) {
      toast.error("Failed to load offer letter data!");
    }
  };

  // Update Offer Letter Status
  const updateOfferLetterStatus = async (olId, payload) => {
    try {
      const res = await axios.put(`https://localhost:7119/api/OfferLetter/update/${olId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(res.data || "Offer Letter Sent Successfully!");
      await fetchCandidates();
      await fetchOfferLetters();
    }
    catch (err) {
      toast.error(err.response?.data || "Failed to update offer letter status!");
      throw err;
    }
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
    getRounds,
    getRoundCount,
    createRound,
    passRound,
    failRound,
    scheduleExam,
    updateCandidate,
    fetchAssignedInterviews,
    updateTechnicalResult,
    loadInterviewerData,
    fetchHRInterviews,
    updateHRInterview,
    fetchCandidateDocuments,
    fetchCandidatesUnderHR,
    tempStatuses,
    setTempStatuses,
    updateTemp,
    saveTempChanges,
    fetchAllHRRounds,
    updateOfferLetterStatus,
  };

  return <CandidateContext.Provider value={value}>{children}</CandidateContext.Provider>;
};
