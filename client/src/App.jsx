import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminUser from "./admin/User/AdminUser";
import AdminDashboard from './admin/AdminDashboard'
import AdminAddUser from './admin/User/AdminAddUser';
import AdminAddUserExcel from './admin/User/AdminAddUserExcel';
import AdminAddUserResume from './admin/User/AdminAddUserResume';
import AdminUserUpdate from './admin/User/AdminUserUpdate';
import AdminSelection from './admin/selection/AdminSelection';
import AdminUpdateSelection from './admin/selection/AdminUpdateSelection';
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
import RecruiterAddUserExcel from './recruiter/RecruiterAddUserExcel';
import RecruiterAddUserResume from './recruiter/RecruiterAddUserResume';
import ViewUser from './reusableComponent/User/ViewUser';
import ViewerUser from './viewer/ViewerUser';
import ViewerSelection from './viewer/ViewerSelection';
import ViewSelection from './reusableComponent/Selection/ViewSelection';
import AdminSkill from './admin/Skill/AdminSkill';
import AdminAddSkill from './admin/Skill/AdminAddSkill';
import AdminUpdateSkill from './admin/Skill/AdminUpdateSkill';
import ViewerSkill from './viewer/ViewerSkill';
import { ToastContainer } from 'react-toastify';
import AdminRoutes from './routes/AdminRoutes';
import RecruiterRoutes from './routes/RecruiterRoutes';
import ViewerRoutes from './routes/ViewerRoutes';
import SharedViewRoutes from './routes/SharedViewRoutes';
import CandidateRoutes from './routes/CandidateRoutes';
import InterviewerRoutes from './routes/InterviewerRoutes';
import HRRoutes from './routes/HRRoutes';
import ReviewerRoutes from './routes/ReviewerRoutes';
import AdminDocuments from './admin/Documents/AdminDocuments';

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
          <Route path="/admin-document" element={<AdminDocuments />} />
          <Route path='/admin-selection' element={<AdminSelection />} />
          <Route path='/admin-update-selection/:id' element={<AdminUpdateSelection />} />
          <Route path='/admin-add-update-candidate-documents/:jaId' element={<UploadDocuments />} />
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
          <Route path='/view-user/:id' element={<ViewUser />} />
          <Route path='/viewer-user' element={<ViewerUser />} />
          <Route path='/viewer-selection' element={<ViewerSelection />} />
          <Route path='/view-selection/:id' element={<ViewSelection />} />
          <Route path='/viewer-skill' element={<ViewerSkill />} />
          {AdminRoutes}
          {RecruiterRoutes}
          {ViewerRoutes}
          {SharedViewRoutes}
          {CandidateRoutes}
          {InterviewerRoutes}
          {HRRoutes}
          {ReviewerRoutes}
        </Routes>
      </Router>
    </>
  )
}

export default App
