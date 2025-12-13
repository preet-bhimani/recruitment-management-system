import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
};

export const UIProvider = ({ children }) => {
  const [showExamCalendar, setShowExamCalendar] = useState(null);
  const [showMessage, setShowMessage] = useState(null);
  const [showRating, setShowRating] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const closeAllModals = () => {
    setShowExamCalendar(null);
    setShowMessage(null);
    setShowRating(null);
    setSelectedDate('');
    setMessage('');
    setRating(0);
  };

  // Messages for Each State
  const getDefaultMessage = (type) => {
    const map = {
      select: "Congratulations! You have been shortlisted for technical interview.",
      reject: "Thank you for applying. Unfortunately, we cannot proceed your application.",
      pass: "Congratulations! You passed the exam and are shortlisted for technical interview.",
      fail: "Unfortunately, you did not pass the exam.",
      hold: "This application is put on hold. We will notify you with further updates.",
      'tech-clear': "Congratulations! You cleared the technical interview. You will receive a notification shortly.",
      'tech-not-clear': "Thank you for interviewing. Unfortunately, you did not clear the interview.",
      'hr-clear': "Congratulations! You cleared the HR interview. You will receive a notification shortly.",
      'hr-not-clear': "Thank you for interviewing. Unfortunately, you did not clear the interview."
    };
    return map[type] || '';
  };

  const value = {
    showExamCalendar, setShowExamCalendar,
    showMessage, setShowMessage,
    showRating, setShowRating,
    selectedDate, setSelectedDate,
    message, setMessage,
    rating, setRating,
    sidebarCollapsed, setSidebarCollapsed,
    closeAllModals, getDefaultMessage
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
