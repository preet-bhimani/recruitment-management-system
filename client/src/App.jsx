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
        </Routes>
    </Router>
    </>
  )
}

export default App
