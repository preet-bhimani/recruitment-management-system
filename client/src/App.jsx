import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminUser from "./admin/AdminUser";
import AdminDashboard from './admin/AdminDashboard'
import AdminAddUser from './admin/AdminAddUser';
import AdminAddUserExcel from './admin/AdminAddUserExcel';
import AdminAddUserResume from './admin/AdminAddUserResume';
import AdminUserUpdate from './admin/AdminUserUpdate';
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

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <Router>
        <Routes>
            <Route path='/' element={<AdminDashboard />} />
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
            <Route path='/admin-hrinterview' element={<AdminHRInterview />} />
            <Route path='/admin-add-meeting' element={<AdminMeetingSchedual />} />
        </Routes>
    </Router>
    </>
  )
}

export default App
