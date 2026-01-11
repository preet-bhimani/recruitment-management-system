import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import InterviewerMeetingDetails from './interviewer/InterviewerMeetingDetails';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      <Router>
        <Routes>
          <Route path="/admin-document" element={<AdminDocuments />} />
          <Route path='/admin-add-update-candidate-documents/:jaId' element={<UploadDocuments />} />
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
          <Route element={<ProtectedRoute allowedRoles={["Interviewer", "HR"]} />}>
          <Route path='/interview-meeting-details' element={<InterviewerMeetingDetails />} />
          </Route>
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
