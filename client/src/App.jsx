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
import RecruiterAddUser from './recruiter/RecruiterAddUser';
import ReviewerDashboard from './reviewer/ReviewerDashboard';
import RecruiterAddUserExcel from './recruiter/RecruiterAddUserExcel';
import RecruiterAddUserResume from './recruiter/RecruiterAddUserResume';
import InterviewerFeedback from './interviewer/InterviewerFeedback';
import InterviewerMeetingDetails from './interviewer/InterviewerMeetingDetails';
import HRFeedback from './hr/HRFeedback';
import HRDocumentsCheck from './hr/HRDocumentsCheck';
import RecruiterJobOpening from './recruiter/RecruiterJobOpening';
import RecruiterAddJobOpening from './recruiter/RecruiterAddJobOpening';
import ViewerJobOpening from './viewer/ViewerJobOpening';
import ViewJobOpening from './reusableComponent/Job Opening/ViewJobOpening';
import RecruiterUpdateJobOpening from './recruiter/RecruiterUpdateJobOpening';
import ViewUser from './reusableComponent/User/ViewUser';
import ViewerUser from './viewer/ViewerUser';
import RecruiterMeetingScheduling from './recruiter/RecruiterMeetingScheduling';
import ViewerJobApplication from './viewer/ViewerJobApplication';
import ViewJobApplication from './reusableComponent/Job Application/ViewJobApplication';
import ViewerTechnicalInterview from './viewer/ViewerTechnicalInterview';
import ViewTechnicalInterview from './reusableComponent/Technical Interview/ViewTechnicalInterview';
import ViewerHRInterview from './viewer/ViewerHRInterview';
import ViewHRInterview from './reusableComponent/Hr Interview/ViewHRInterview';
import ViewerSelection from './viewer/ViewerSelection';
import ViewSelection from './reusableComponent/Selection/ViewSelection';
import ViewerDocumentList from './viewer/ViewerDocumentList';
import ViewDocumentList from './reusableComponent/Document List/ViewDocumentList';
import ViewerCampusDrive from './viewer/ViewerCampusDrive';
import ViewCampusDrive from './reusableComponent/Campus Drive/ViewCampusDrive';
import ViewerEmployee from './viewer/ViewerEmployee';
import ViewEmployee from './reusableComponent/Employee/ViewEmployee';
import AdminSkill from './admin/Skill/AdminSkill';
import AdminAddSkill from './admin/Skill/AdminAddSkill';
import AdminUpdateSkill from './admin/Skill/AdminUpdateSkill';
import ViewerSkill from './viewer/ViewerSkill';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} theme="colored"/>

      <Router>
        <Routes>
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path='/admin-user' element={<AdminUser />} />
          <Route path='/admin-add-user' element={<AdminAddUser />} />
          <Route path='/admin-add-user-excel' element={<AdminAddUserExcel />} />
          <Route path='/admin-add-user-resume' element={<AdminAddUserResume />} />
          <Route path='/admin-user-update/:id' element={<AdminUserUpdate />} />
          <Route path='/admin-jobopening' element={<AdminJobOpening />} />
          <Route path='/admin-add-jobopening' element={<AdminAddJobOpening />} />
          <Route path='/admin-update-jobopening/:id' element={<AdminUpdateJobOpening />} />
          <Route path='/admin-jobapplication' element={<AdminJobApplication />} />
          <Route path='/admin-add-jobapplication' element={<AdminAddJobApplication />} />
          <Route path='/admin-update-jobapplication/:id' element={<AdminUpdateJobApplication />} />
          <Route path='/admin-techinterview' element={<AdminTechInterview />} />
          <Route path='/admin-add-techinterview' element={<AdminAddTechInterview />} />
          <Route path='/admin-update-techinterview/:id' element={<AdminUpdateTechInterview />} />
          <Route path='/admin-hrinterview' element={<AdminHRInterview />} />
          <Route path='admin-add-hrinterview' element={<AdminAddHRInterview />} />
          <Route path='/admin-update-hrinterview/:id' element={<AdminUpdateHRInterview />} />
          <Route path='/admin-add-meeting' element={<AdminMeetingSchedual />} />
          <Route path='/admin-selection' element={<AdminSelection />} />
          <Route path='/admin-sentmail-selection' element={<AdminSentMailSelection />} />
          <Route path='/admin-update-selection' element={<AdminUpdateSelection />} />
          <Route path='/admin-document' element={<AdminDocuments />} />
          <Route path='/admin-add-document' element={<AdminAddDocuments />} />
          <Route path='/admin-add-update-candidate-documents/:jaId' element={<UploadDocuments />} />
          <Route path='/admin-campusdrive' element={<AdminCampusDrive />} />
          <Route path='/admin-add-campusdrive' element={<AdminAddCampusDrive />} />
          <Route path='/admin-update-campusdrive/:id' element={<AdminUpdateCampusDrive />} />
          <Route path='/admin-employee' element={<AdminEmployee />} />
          <Route path='/admin-add-employee' element={<AdminAddEmployee />} />
          <Route path='/admin-update-employee' element={<AdminUpdateEmployee />} />
          <Route path='/admin-skill' element={<AdminSkill />} />
          <Route path='/admin-add-skill' element={<AdminAddSkill />} />
          <Route path='/admin-update-skill/:id' element={<AdminUpdateSkill />} />
          <Route path='/' element={<CandidateDashboard />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/job-description/:id' element={<JobDescription />} />
          <Route path='/resume' element={<Resume />} />
          <Route path='/update-profile' element={<UpdateProfile />} />
          <Route path='/update-password-mail' element={<UpdatePasswordMail />} />
          <Route path='/update-password-otp' element={<UpdatePasswordOTP />} />
          <Route path='/update-password' element={<UpdatePassword />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/myjobs' element={<MyJobs />} />
          <Route path='/upload-documents/:id' element={<UploadDocuments />} />
          <Route path='/recruiter-dashboard' element={<RecruiterDashboard />} />
          <Route path='/recruiter-candidate' element={<RecruiterCandidate />} />
          <Route path='/recruiter-add-candidate' element={<RecruiterAddUser />} />
          <Route path='/recruiter-add-candidate-excel' element={<RecruiterAddUserExcel />} />
          <Route path='/recruiter-add-candidate-resume' element={<RecruiterAddUserResume />} />
          <Route path='/recruiter-jobopening' element={<RecruiterJobOpening />} />
          <Route path='/recruiter-add-jobopening' element={<RecruiterAddJobOpening />} />
          <Route path='/recruiter-update-jobopening/:id' element={<RecruiterUpdateJobOpening />} />
          <Route path='/recruiter-meeting-scheduling' element={<RecruiterMeetingScheduling />} />
          <Route path='/reviewer-dashboard' element={<ReviewerDashboard />} />
          <Route path='/interviewer-feedback' element={<InterviewerFeedback />} />
          <Route path='/interview-meeting-details' element={<InterviewerMeetingDetails />} />
          <Route path='/hr-feedback' element={<HRFeedback />} />
          <Route path='/hr-documents-check/:candidateId' element={<HRDocumentsCheck />} />
          <Route path='/viewer-jobopening' element={<ViewerJobOpening />} />
          <Route path='/view-jobopening' element={<ViewJobOpening />} />
          <Route path='/view-user' element={<ViewUser />} />
          <Route path='/viewer-user' element={<ViewerUser />} />
          <Route path="/viewer-jobapplication" element={<ViewerJobApplication />} />
          <Route path='/view-jobapplication' element={<ViewJobApplication />} />
          <Route path='/viewer-techinterview' element={<ViewerTechnicalInterview />} />
          <Route path='/view-techinterview' element={<ViewTechnicalInterview />} />
          <Route path='/viewer-hrinterview' element={<ViewerHRInterview />} />
          <Route path='/view-hrinterview' element={<ViewHRInterview />} />
          <Route path='/viewer-selection' element={<ViewerSelection />} />
          <Route path='/view-selection' element={<ViewSelection />} />
          <Route path='/viewer-documentlist' element={<ViewerDocumentList />} />
          <Route path='/view-documentlist' element={<ViewDocumentList />} />
          <Route path='/viewer-campusdrive' element={<ViewerCampusDrive />} />
          <Route path='/view-campusdrive' element={<ViewCampusDrive />} />
          <Route path='/viewer-employee' element={<ViewerEmployee />} />
          <Route path='/view-employee' element={<ViewEmployee />} />
          <Route path='/viewer-skill' element={<ViewerSkill />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
