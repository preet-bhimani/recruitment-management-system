import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../../components/Navbar";
import { Eye, Edit, Trash2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminUser = () => {
  const users = [
    {
      userId: "8723A287-BBB3-46C9-BD23-08DDAE2FEC35",
      fullName: "Preet Bhimani",
      email: "preet@gmail.com",
      phone: "9377382731",
      city: "Rajkot",
      dob: "2003-05-13",
      role: "Admin",
      isActive: "Active",
      photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
    },
    {
      userId: "9CF256C4-7ECA-4469-8CCE-08DD70ACE5C1",
      fullName: "Umang Paneri",
      email: "umang@gmail.com",
      phone: "9273899119",
      city: "Vadodara",
      dob: "2003-12-21",
      role: "Candidate",
      isActive: "Active",
      photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
    },
    {
      userId: "4091FDD1-2D1F-44F5-00BB-08DDB922600D",
      fullName: "Visva Antala",
      email: "visva@gmail.com",
      phone: "9102938270",
      city: "Surat",
      dob: "2003-03-15",
      role: "HR",
      isActive: "Active",
      photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
    },
  ];

  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* User List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h1 className="text-2xl font-semibold mb-4 text-blue-400">Admin Users</h1>

          {/* Add New User */}
          <div className="flex gap-3 mb-4 justify-end">
            <button className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-sm" onClick={() => navigate("/admin-add-user")}>
              + Add Employee
            </button>
            <button className="px-3 py-1 bg-sky-700 hover:bg-sky-600 rounded text-sm" onClick={() => navigate("/admin-add-user-excel")}>
              + Add Excel
            </button>
            <button className="px-3 py-1 bg-fuchsia-700 hover:bg-fuchsia-600 rounded text-sm" onClick={() => navigate("/admin-add-user-resume")}>
              + Add Resume
            </button>
            <button className="flex items-center gap-1 px-3 py-1 bg-violet-700 hover:bg-violet-600 rounded text-sm" >
              <Filter size={14} /> Filters
            </button>
          </div>

          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.userId}
                className="bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-sm hover:shadow-md transition flex items-center justify-between text-sm">

                <div className="flex items-center gap-3 flex-1">
                  {/* Profile */}
                  <img
                    src={user.photo}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full border border-neutral-600" />
                  {/* Details */}
                  <div className="grid grid-cols-4 gap-x-6 gap-y-1 flex-1">
                    <p><span className="font-medium text-amber-200">UserID:</span> {user.userId}</p>
                    <p><span className="font-medium text-amber-200">Name:</span> {user.fullName}</p>
                    <p><span className="font-medium text-amber-200">Email:</span> {user.email}</p>
                    <p><span className="font-medium text-amber-200">Phone:</span> {user.phone}</p>
                    <p><span className="font-medium text-amber-200">City:</span> {user.city}</p>
                    <p><span className="font-medium text-amber-200">DOB:</span> {user.dob}</p>
                    <p><span className="font-medium text-amber-200">Role:</span> {user.role}</p>
                    <p>
                      <span className="font-medium text-amber-200">Status:</span>{" "}
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${user.isActive === "Active"
                          ? "bg-emerald-800 text-emerald-200"
                          : "bg-rose-800 text-rose-200"}`}>
                        {user.isActive}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Bottons */}
                <div className="flex gap-2 ml-4">
                  <button className="flex items-center gap-1 px-2 py-1 bg-sky-800 hover:bg-sky-700 rounded text-xs" onClick={() => navigate('/admin-user-update/8723A287-BBB3-46C9-BD23-08DDAE2FEC35')}>
                    <Eye size={14} /> View
                  </button>
                  <button className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs" onClick={() => navigate('/admin-user-update/8723A287-BBB3-46C9-BD23-08DDAE2FEC35')}>
                    <Edit size={14} /> Update
                  </button>
                  <button className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUser;
