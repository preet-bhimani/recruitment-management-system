import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminUser from "./admin/AdminUser";
import AdminDashboard from './admin/AdminDashboard'
import AdminAddUser from './admin/AdminAddUser';
import AdminAddUserExcel from './admin/AdminAddUserExcel';
import AdminAddUserResume from './admin/AdminAddUserResume';
import AdminUserUpdate from './admin/AdminUserUpdate';
function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <Router>
        <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/admin-user" element={<AdminUser />} />
            <Route path='/admin-add-user' element={<AdminAddUser />} />
            <Route path='/admin-add-user-excel' element={<AdminAddUserExcel />}/>
            <Route path ='/admin-add-user-resume' element={<AdminAddUserResume />} />
            <Route path='/admin-user-update/8723A287-BBB3-46C9-BD23-08DDAE2FEC35' element={<AdminUserUpdate />} />
        </Routes>
    </Router>
    </>
  )
}

export default App
