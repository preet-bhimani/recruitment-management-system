import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminUser from "./admin/User/AdminUser";
import AdminDashboard from './admin/AdminDashboard'
import AdminAddUser from './admin/User/AdminAddUser';
import AdminAddUserExcel from './admin/User/AdminAddUserExcel';
import AdminAddUserResume from './admin/User/AdminAddUserResume';
import AdminUserUpdate from './admin/User/AdminUserUpdate';
import AdminHRInterview from './admin/HR Interview/AdminHRInterview';
import AdminAddTechInterview from './admin/Technical Interview/AdminAddTechInterview';
import AdminMeetingSchedual from './admin/Technical Interview/AdminMeetingSchedual';
import AdminAddHRInterview from './admin/HR Interview/AdminAddHRInterview';
import AdminUpdateHRInterview from './admin/HR Interview/AdminUpdateHRInterview';
import AdminSelection from './admin/selection/AdminSelection';
import AdminUpdateSelection from './admin/selection/AdminUpdateSelection';
import AdminDocuments from './admin/Documents/AdminDocuments';
import AdminAddDocuments from './admin/Documents/AdminAddDocuments';
import Register from './components/Register';
import Login from './components/Login';
import CandidateDashboard from './candidate/CandidateDashboard';
import JobDescription from './candidate/JobDescription';
import Resume from './candidate/Resume';
import UpdateProfile from './candidate/UpdateProfile';
import UpdatePasswordMail from './candidate/UpdatePasswordMail';
import UpdatePasswordOTP from './candidate/UpdatePasswordOTP';
import UpdatePassword from './candidate/UpdatePassword';
import UploadDocuments from './candidate/UploadDocuments';
import RecruiterCandidate from './recruiter/RecruiterCandidate';
import RecruiterAddUser from './recruiter/RecruiterAddUser';
import ReviewerDashboard from './reviewer/ReviewerDashboard';
import RecruiterAddUserExcel from './recruiter/RecruiterAddUserExcel';
import RecruiterAddUserResume from './recruiter/RecruiterAddUserResume';
import HRFeedback from './hr/HRFeedback';
import HRDocumentsCheck from './hr/HRDocumentsCheck';
import ViewUser from './reusableComponent/User/ViewUser';
import ViewerUser from './viewer/ViewerUser';
import RecruiterMeetingScheduling from './recruiter/RecruiterMeetingScheduling';
import ViewerHRInterview from './viewer/ViewerHRInterview';
import ViewHRInterview from './reusableComponent/Hr Interview/ViewHRInterview';
import ViewerSelection from './viewer/ViewerSelection';
import ViewSelection from './reusableComponent/Selection/ViewSelection';
import ViewerDocumentList from './viewer/ViewerDocumentList';
import ViewDocumentList from './reusableComponent/Document List/ViewDocumentList';
import AdminSkill from './admin/Skill/AdminSkill';
import AdminAddSkill from './admin/Skill/AdminAddSkill';
import AdminUpdateSkill from './admin/Skill/AdminUpdateSkill';
import ViewerSkill from './viewer/ViewerSkill';
import { ToastContainer } from 'react-toastify';
import AdminAddOfferLetter from './admin/Offer Letter/AdminAddOfferLetter';
import AdminSentOfferLetter from './admin/Offer Letter/AdminSentOfferLetter';
import AdminOfferLetter from './admin/Offer Letter/AdminOfferLetter';
import AdminUpdateOfferLetter from './admin/Offer Letter/AdminUpdateOfferLetter';
import RecruiterSentOfferLetter from './recruiter/RecruiterSentOfferLetter';
import ViewOfferLetter from './reusableComponent/Offer Letter/ViewOfferLetter';
import ViewerOfferLetter from './viewer/ViewerOfferLetter';
import AdminRoutes from './routes/AdminRoutes';
import RecruiterRoutes from './routes/RecruiterRoutes';
import ViewerRoutes from './routes/ViewerRoutes';
import SharedViewRoutes from './routes/SharedViewRoutes';
import CandidateRoutes from './routes/CandidateRoutes';

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      <Router>
        <Routes>
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path='/admin-user' element={<AdminUser />} />
          <Route path='/admin-add-user' element={<AdminAddUser />} />
          <Route path='/admin-add-user-excel' element={<AdminAddUserExcel />} />
          <Route path='/admin-add-user-resume' element={<AdminAddUserResume />} />
          <Route path='/admin-user-update/:id' element={<AdminUserUpdate />} />
          <Route path='/admin-add-techinterview' element={<AdminAddTechInterview />} />
          <Route path='/admin-hrinterview' element={<AdminHRInterview />} />
          <Route path='/admin-add-hrinterview' element={<AdminAddHRInterview />} />
          <Route path='/admin-update-hrinterview/:id' element={<AdminUpdateHRInterview />} />
          <Route path='/admin-add-meeting' element={<AdminMeetingSchedual />} />
          <Route path='/admin-selection' element={<AdminSelection />} />
          <Route path='/admin-update-selection/:id' element={<AdminUpdateSelection />} />
          <Route path='/admin-document' element={<AdminDocuments />} />
          <Route path='/admin-add-document' element={<AdminAddDocuments />} />
          <Route path='/admin-add-update-candidate-documents/:jaId' element={<UploadDocuments />} />
          <Route path='/admin-offer-letter' element={<AdminOfferLetter />} />
          <Route path='/admin-add-offerletter' element={<AdminAddOfferLetter />} />
          <Route path='/admin-sent-offerletter/:id' element={<AdminSentOfferLetter />} />
          <Route path='/admin-update-offerletter/:id' element={<AdminUpdateOfferLetter />} />
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
          <Route path='/upload-documents/:id' element={<UploadDocuments />} />
          <Route path='/recruiter-candidate' element={<RecruiterCandidate />} />
          <Route path='/recruiter-add-candidate' element={<RecruiterAddUser />} />
          <Route path='/recruiter-add-candidate-excel' element={<RecruiterAddUserExcel />} />
          <Route path='/recruiter-add-candidate-resume' element={<RecruiterAddUserResume />} />
          <Route path='/recruiter-meeting-scheduling' element={<RecruiterMeetingScheduling />} />
          <Route path='/recruiter-sent-offer-letter/:id' element={<RecruiterSentOfferLetter />} />
          <Route path='/reviewer-dashboard' element={<ReviewerDashboard />} />
          <Route path='/hr-feedback' element={<HRFeedback />} />
          <Route path='/hr-documents-check/:candidateId' element={<HRDocumentsCheck />} />
          <Route path='/view-user/:id' element={<ViewUser />} />
          <Route path='/viewer-user' element={<ViewerUser />} />
          <Route path='/viewer-hrinterview' element={<ViewerHRInterview />} />
          <Route path='/view-hrinterview/:id' element={<ViewHRInterview />} />
          <Route path='/viewer-selection' element={<ViewerSelection />} />
          <Route path='/view-selection/:id' element={<ViewSelection />} />
          <Route path='/viewer-documentlist' element={<ViewerDocumentList />} />
          <Route path='/view-documentlist/:id' element={<ViewDocumentList />} />
          <Route path='/viewer-skill' element={<ViewerSkill />} />
          <Route path='/view-offerletter/:id' element={<ViewOfferLetter />} />
          <Route path='/viewer-offerletter' element={<ViewerOfferLetter />} />
          {AdminRoutes}
          {RecruiterRoutes}
          {ViewerRoutes}
          {SharedViewRoutes}
          {CandidateRoutes}
        </Routes>
      </Router>
    </>
  )
}

export default App
