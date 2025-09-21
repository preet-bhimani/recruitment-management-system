import React, { useState } from "react";
import { Bell, CheckCircle, XCircle, Clock, Calendar, Users, FileCheck, Target, MessageSquare, ChevronDown, ChevronUp, Video } from "lucide-react";
import CommonNavbar from "../components/CommonNavbar";
import Footer from "../components/Footer";

const Notifications = () => {
  const [expandedJobs, setExpandedJobs] = useState({});

  const jobNotifications = {
    "Data Scientist": [
      {
        jobID: "4091FDD1-2D1F-44F5-00BB-08DDB922600D",
        jobTitle: "Data Scientist",
        notificationType: "Application",
        status: "Shortlisted",
        date: "2025-09-18T10:30:00",
        interviewerName: null,
        meetingLink: null,
        feedback: "Congratulations You have been Shotlisted. You Recieve Exam Date very soon."
      },
      {
        jobID: "4091FDD1-2D1F-44F5-00BB-08DDB922600D",
        jobTitle: "Data Scientist",
        notificationType: "Exam",
        status: "Fail",
        date: "2025-09-20T14:15:00",
        interviewerName: null,
        meetingLink: null,
        feedback: "Unfortunately You haven't cleared the exam.."
      }
    ],
    "Jr. AI Developer": [
      {
        jobID: "9CF256C4-7ECA-4469-8CCE-08DD70ACE5C1",
        jobTitle: "Jr. AI Developer",
        notificationType: "Application",
        status: "Shortlisted",
        date: "2025-09-15T11:45:00",
        interviewerName: null,
        meetingLink: null,
        feedback: "Congratulations, you have been shortlisted. You will receive the technical interview link very soon."
      },
      {
        jobID: "9CF256C4-7ECA-4469-8CCE-08DD70ACE5C1",
        jobTitle: "Jr. AI Developer",
        notificationType: "Tech Interview Round 1",
        status: "Cleared",
        date: "2025-09-17T15:00:00",
        meetingLink: "/",
        feedback: "Congratulations, you have been cleared for the first round of interviews. You get the next link very soon."
      },
      {
        jobID: "9CF256C4-7ECA-4469-8CCE-08DD70ACE5C1",
        jobTitle: "Jr. AI Developer",
        notificationType: "Tech Interview Round 2",
        status: "Cleared",
        date: "2025-09-19T10:00:00",
        meetingLink: "/",
        feedback: "You have very good knowledge about AI technologies and their applications. Ready for final round."
      },
      {
        jobID: "9CF256C4-7ECA-4469-8CCE-08DD70ACE5C1",
        jobTitle: "Jr. AI Developer",
        notificationType: "HR Interview",
        status: "Scheduled",
        date: "2025-09-22T14:30:00",
        meetingLink: "/",
        feedback: null
      }
    ],
    "Sr. Software Engineer": [
      {
        jobID: "8723A287-BBB3-46C9-BD23-08DDAE2FEC35",
        jobTitle: "Sr. Software Engineer",
        notificationType: "Application",
        status: "Shortlisted",
        date: "2025-09-14T09:20:00",
        meetingLink: null,
        feedback: "Congratulations You have been Shotlisted. You Recieve Exam Date very soon."
      },
      {
        jobID: "8723A287-BBB3-46C9-BD23-08DDAE2FEC35",
        jobTitle: "Sr. Software Engineer",
        notificationType: "Exam",
        status: "Pass",
        date: "2025-09-16T16:30:00",
        meetingLink: null,
        feedback: "Congratulations You have passed the exam. You will recieve Technical Interview Link very soon."
      },
      {
        jobID: "8723A287-BBB3-46C9-BD23-08DDAE2FEC35",
        jobTitle: "Sr. Software Engineer",
        notificationType: "Tech Interview Round 1",
        status: "Cleared",
        date: "2025-09-18T11:15:00",
        meetingLink: "/",
        feedback: "Congratulations, you have been cleared for the Techincal round of interviews. You get the next HR round link very soon."
      }
    ]
  };

  const toggleJobExpansion = (jobTitle) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobTitle]: !prev[jobTitle]
    }));
  };

  const getTypeIcon = (type) => {
    if (type.includes('Application')) return <Target className="w-5 h-5 text-white" />;
    if (type.includes('Exam')) return <FileCheck className="w-5 h-5 text-white" />;
    if (type.includes('Tech Interview')) return <Users className="w-5 h-5 text-white" />;
    if (type.includes('HR Interview')) return <Calendar className="w-5 h-5 text-white" />;
    return <Bell className="w-5 h-5 text-neutral-400" />;
  };

  const getStatusIcon = (status) => {
    if (!status) return <Clock className="w-4 h-4 text-yellow-400" />;

    const statusLower = status.toLowerCase();
    if (['shortlisted', 'pass', 'cleared'].includes(statusLower)) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    if (['fail', 'failed', 'rejected'].includes(statusLower)) {
      return <XCircle className="w-4 h-4 text-red-400" />;
    }
    return <Clock className="w-4 h-4 text-yellow-400" />;
  };

  const getStatusColor = (status) => {
    if (!status) return 'text-yellow-400';

    const statusLower = status.toLowerCase();
    if (['shortlisted', 'pass', 'cleared'].includes(statusLower)) {
      return 'text-green-400';
    }
    if (['fail', 'failed', 'rejected'].includes(statusLower)) {
      return 'text-red-400';
    }
    return 'text-yellow-400';
  };

  const isPendingInterview = (status) => {
    if (!status) return false;
    return ['scheduled', 'pending'].includes(status.toLowerCase());
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-GB'),
      time: date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950">
      {/* Navbar */}
      <CommonNavbar isLoggedIn />

      {/* Main Content */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Notifications</h1>
            <p className="text-neutral-400">Track your application progress step by step</p>
          </div>

          {/* Job-Wise Notifications */}
          {Object.entries(jobNotifications).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(jobNotifications).map(([jobTitle, notifications]) => (
                <div key={jobTitle} className="bg-neutral-900 rounded-lg border border-neutral-800">

                  {/* Job Title */}
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-neutral-800 transition"
                    onClick={() => toggleJobExpansion(jobTitle)}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-900/20 rounded-lg flex items-center justify-center border border-purple-700">
                        <Target className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{jobTitle}</h3>
                        <p className="text-neutral-400 text-sm">{notifications.length} notifications</p>
                      </div>
                    </div>
                    {expandedJobs[jobTitle] ?
                      <ChevronUp className="w-5 h-5 text-neutral-300" /> :
                      <ChevronDown className="w-5 h-5 text-neutral-300" />
                    }
                  </div>

                  {/* Notifications List */}
                  {expandedJobs[jobTitle] && (
                    <div className="border-t border-neutral-800">
                      {notifications.map((notification, index) => {
                        const { date, time } = formatDateTime(notification.date);
                        return (
                          <div key={index} className={`p-6 ${index !== notifications.length - 1 ? 'border-b border-neutral-800' : ''}`}>

                            {/* Notification */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center border border-neutral-600">
                                  {getTypeIcon(notification.notificationType)}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-white mb-2">{notification.notificationType}</h4>
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(notification.status)}
                                    <span className={`text-sm font-medium ${getStatusColor(notification.status)}`}>
                                      {notification.status || 'Pending'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-neutral-400">{date}</p>
                                <p className="text-xs text-neutral-500">{time}</p>
                              </div>
                            </div>

                            <div className="ml-13 space-y-3">
                              {/* Meeting Link */}
                              {notification.meetingLink && isPendingInterview(notification.status) && (
                                <div>
                                  <a href={notification.meetingLink} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-sm font-medium transition">
                                    <Video className="w-4 h-4" />
                                    Join Interview
                                  </a>
                                </div>
                              )}

                              {/* Feedback */}
                              {notification.feedback && (
                                <div className="bg-neutral-800 rounded-lg p-3 border border-neutral-700">
                                  <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare className="w-4 h-4 text-blue-400" />
                                    <p className="text-xs text-neutral-300">Feedback</p>
                                  </div>
                                  <p className="text-sm text-neutral-300 leading-relaxed">{notification.feedback}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-700">
                <Bell className="w-8 h-8 text-neutral-100" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Notifications Yet</h3>
              <p className="text-neutral-400 mb-6 max-w-md mx-auto">
                You haven't received any notifications for your job applications. Stay tuned!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Notifications;
