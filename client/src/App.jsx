import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminUser from "./admin/User/AdminUser";
import AdminDashboard from './admin/AdminDashboard'
import AdminAddUser from './admin/User/AdminAddUser';
import AdminAddUserExcel from './admin/User/AdminAddUserExcel';
import AdminAddUserResume from './admin/User/AdminAddUserResume';
import AdminUserUpdate from './admin/User/AdminUserUpdate';
import AdminJobOpening from './admin/Job opening/AdminJobOpening';
import AdminAddJobOpening from './admin/Job opening/AdminAddJobOpening';
import AdminUpdateJobOpening from './admin/Job opening/AdminUpdateJobOpening';
import AdminJobApplication from './admin/Job Application/AdminJobApplication';
import AdminAddJobApplication from './admin/Job Application/AdminAddJobApplication';
import AdminUpdateJobApplication from './admin/Job Application/AdminUpdateJobApplication';
import AdminTechInterview from './admin/Technical Interview/AdminTechInterview';
import AdminHRInterview from './admin/HR Interview/AdminHRInterview';
import AdminAddTechInterview from './admin/Technical Interview/AdminAddTechInterview';
import AdminMeetingSchedual from './admin/Technical Interview/AdminMeetingSchedual';
import AdminUpdateTechInterview from './admin/Technical Interview/AdminUpdateTechInterview';
import AdminAddHRInterview from './admin/HR Interview/AdminAddHRInterview';
import AdminUpdateHRInterview from './admin/HR Interview/AdminUpdateHRInterview';
import AdminSelection from './admin/selection/AdminSelection';
import AdminSentMailSelection from './admin/selection/AdminSentMailSelection';
import AdminUpdateSelection from './admin/selection/AdminUpdateSelection';
import AdminDocuments from './admin/Documents/AdminDocuments';
import AdminAddDocuments from './admin/Documents/AdminAddDocuments';
import AdminUpdateDocuments from './admin/Documents/AdminUpdateDocuments';
import AdminCampusDrive from './admin/Campus Drive/AdminCampusDrive';
import AdminAddCampusDrive from './admin/Campus Drive/AdminAddCampusDrive';
import AdminUpdateCampusDrive from './admin/Campus Drive/AdminUpdateCampusDrive';
import AdminEmployee from './admin/Employee/AdminEmployee';
import AdminAddEmployee from './admin/Employee/AdminAddEmployee';
import AdminUpdateEmployee from './admin/Employee/AdminUpdateEmployee';
import Register from './components/Register';
import Login from './components/Login';
import CandidateDashboard from './candidate/CandidateDashboard';
import JobDescription from './candidate/JobDescription';
import Resume from './candidate/Resume';
import UpdateProfile from './candidate/UpdateProfile';
import UpdatePasswordMail from './candidate/UpdatePasswordMail';
import UpdatePasswordOTP from './candidate/UpdatePasswordOTP';
import UpdatePassword from './candidate/UpdatePassword';
import Notifications from './candidate/Notifications';
import MyJobs from './candidate/MyJobs';
import UploadDocuments from './candidate/UploadDocuments';
import RecruiterDashboard from './recruiter/RecruiterDashboard';
import RecruiterCandidate from './recruiter/RecruiterCandidate';
import CandidateCard from './recruiter/CandidateCard';

function App() {
  return (
    <>
      <Router>
        <Routes>
            <Route path='/admin' element={<AdminDashboard />} />
            <Route path='/admin-user' element={<AdminUser />} />
            <Route path='/admin-add-user' element={<AdminAddUser />} />
            <Route path='/admin-add-user-excel' element={<AdminAddUserExcel />}/>
            <Route path ='/admin-add-user-resume' element={<AdminAddUserResume />} />
            <Route path='/admin-user-update/8723A287-BBB3-46C9-BD23-08DDAE2FEC35' element={<AdminUserUpdate />} />
            <Route path='/admin-jobopening' element={<AdminJobOpening />} />
            <Route path='/admin-add-jobopening' element={<AdminAddJobOpening />} />
            <Route path='/admin-update-jobopening/8723B287-CCC3-46D9-CE23-08EEBF2GFD35' element={<AdminUpdateJobOpening />} />
            <Route path='/admin-jobapplication' element={<AdminJobApplication />} />
            <Route path='/admin-add-jobapplication' element={<AdminAddJobApplication />} />
            <Route path='/admin-update/jobapplication/9834B398-CCC4-57D0-CE34-19EEBF3GFD46' element={<AdminUpdateJobApplication />} />
            <Route path='/admin-techinterview' element={<AdminTechInterview />} />
            <Route path='/admin-add-techinterview' element={<AdminAddTechInterview />} />
            <Route path='/admin-update-techinterview' element={<AdminUpdateTechInterview />} />
            <Route path='/admin-hrinterview' element={<AdminHRInterview />} />
            <Route path='admin-add-hrinterview' element={<AdminAddHRInterview />} />
            <Route path='/admin-update-hrinterview' element={<AdminUpdateHRInterview />} />
            <Route path='/admin-add-meeting' element={<AdminMeetingSchedual />} />
            <Route path='/admin-selection' element={<AdminSelection />} />
            <Route path='/admin-sentmail-selection' element={<AdminSentMailSelection />} />
            <Route path='/admin-update-selection' element={<AdminUpdateSelection />} /> 
            <Route path='/admin-document' element={<AdminDocuments />} />
            <Route path='/admin-add-document' element={<AdminAddDocuments />} />
            <Route path='/admin-update-document' element={<AdminUpdateDocuments />} />
            <Route path='/admin-campusdrive' element={<AdminCampusDrive />} />
            <Route path='/admin-add-campusdrive' element={<AdminAddCampusDrive />} />
            <Route path='/admin-update-campusdrive' element={<AdminUpdateCampusDrive />} />
            <Route path='/admin-employee' element={<AdminEmployee />} />
            <Route path='/admin-add-employee' element={<AdminAddEmployee />} />
            <Route path='/admin-update-employee' element={<AdminUpdateEmployee />} />
            <Route path='/' element={<CandidateDashboard />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/job-description' element={<JobDescription />} />
            <Route path='/resume' element={<Resume />} />
            <Route path='/update-profile' element={<UpdateProfile />} />
            <Route path='/update-password-mail' element={<UpdatePasswordMail />} />
            <Route path='/update-password-otp' element={<UpdatePasswordOTP />} />
            <Route path='/update-password' element={<UpdatePassword />} />
            <Route path='/notifications' element={<Notifications />} />
            <Route path='/myjobs' element={<MyJobs />} />
            <Route path='/upload-documents' element={<UploadDocuments />} />
            <Route path='/recruiter-dashboard' element={<RecruiterDashboard />} />
            <Route path='/recruiter-candidate' element={<RecruiterCandidate />} />
            <Route path='/demo' element={<CandidateCard />} />
        </Routes>
    </Router>
    </>
  )
}

export default App
