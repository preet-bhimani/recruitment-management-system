import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

const AdminUserUpdate = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [userData, setUserData] = useState({
    userId: "8723A287-BBB3-46C9-BD23-08DDAE2FEC35",
    fullName: "Preet Bhimani",
    email: "preet@gmail.com",
    password: "***",
    phoneNumber: "9377382731",
    city: "Rajkot",
    dob: "2003-05-13",
    role: "Admin",
    isActive: "Active",
    photo: null,
    resume: null,
    reference: "Friends",
    skills: "ASP.NET React JavaScript Java Git",
    bachelorDegree: "Bachelor of Computer Appications",
    bachelorUniversity: "RK University",
    bachelorPercentage: "78.3",
    masterDegree: "Master of Computer Applications",
    masterUniversity: "RK University",
    masterPercentage: "90.0",
    yearsOfExperience: "0",
    previousCompanyName: "",
    previousCompanyTitle: "",
    cdid: ""
  });

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Content */}
        <main className="flex-1 bg-neutral-950 text-white p-3 sm:p-6 overflow-y-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Admin User Update</h1>
          </div>

          {/* User Update Form */}
          <div className="max-w-6xl mx-auto">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg">

              {/* User ID */}
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium text-neutral-300">
                  User ID
                </label>
                <input
                  type="text"
                  value={userData.userId}
                  disabled
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-300 cursor-not-allowed" />
              </div>

              {/* Full Name */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  defaultValue={userData.fullName}
                  placeholder="Enter full name"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={userData.email}
                  placeholder="Enter email"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  defaultValue={userData.password}
                  placeholder="Enter password"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  defaultValue={userData.phoneNumber}
                  placeholder="Enter phone number"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              {/* City */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  City <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  defaultValue={userData.city}
                  placeholder="Enter city"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              {/* DOB */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  defaultValue={userData.dob}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-600" />
              </div>

              {/* Skills */}
              <div>
                <label className="block mb-1 text-sm font-medium">Skills</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="React, Java"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              {/* Photo */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Photo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  className="w-full p-1.5 rounded bg-neutral-800 border border-neutral-600 text-neutral-100
                  file:h-8.5 file:px-3 file:rounded file:border-0 
                  file:bg-neutral-700 file:text-white hover:file:bg-purple-800 cursor-pointer"/>
              </div>

              {/* Resume */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Resume <span className="text-rose-500">*</span>
                </label>
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  className="w-full p-1.5 rounded bg-neutral-800 border border-neutral-600 text-neutral-100
                  file:h-8.5 file:px-3 file:rounded file:border-0 
                  file:bg-neutral-700 file:text-white hover:file:bg-purple-800 cursor-pointer"/>
              </div>

              {/* Bachelor Details */}
              <div>
                <label className="block mb-1 text-sm font-medium">Bachelor Degree</label>
                <input
                  type="text"
                  name="bachelorDegree"
                  placeholder="Enter degree"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Bachelor University</label>
                <input
                  type="text"
                  name="bachelorUniversity"
                  placeholder="Enter university"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Bachelor %</label>
                <input
                  type="number"
                  name="bachelorPercentage"
                  min="0"
                  placeholder="Enter percentage"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              {/* Master Details */}
              <div>
                <label className="block mb-1 text-sm font-medium">Master Degree</label>
                <input
                  type="text"
                  name="masterDegree"
                  placeholder="Enter degree"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Master University</label>
                <input
                  type="text"
                  name="masterUniversity"
                  placeholder="Enter university"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Master %</label>
                <input
                  type="number"
                  name="masterPercentage"
                  min="0"
                  placeholder="Enter percentage"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              {/* Experience */}
              <div>
                <label className="block mb-1 text-sm font-medium">Years of Experience</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  min="0"
                  placeholder="Enter years"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Previous Company Name</label>
                <input
                  type="text"
                  name="previousCompanyName"
                  placeholder="Enter company"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Previous Company Title</label>
                <input
                  type="text"
                  name="previousCompanyTitle"
                  placeholder="Enter title"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              {/* Reference */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Reference <span className="text-rose-500">*</span>
                </label>
                <select
                  name="reference"
                  defaultValue={userData.reference}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100">
                  <option value="" disabled>Select Reference</option>
                  <option value="Campus Drive">Campus Drive</option>
                  <option value="Walk in drive">Walk in drive</option>
                  <option value="Recruitment Apps">Recruitment Apps</option>
                  <option value="Friends">Family/Friends</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* CDID */}
              <div>
                <label className="block mb-1 text-sm font-medium">CDID</label>
                <input
                  type="text"
                  name="cdid"
                  placeholder="Enter CDID"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              {/* Role */}
              <div>
                <label className="block mb-1 text-sm font-medium">Role</label>
                <select
                  name="role"
                  defaultValue={userData.role}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100">
                  <option value="" disabled>Select Role</option>
                  <option value="Candidate">Candidate</option>
                  <option value="Recruiter">Recruiter</option>
                  <option value="HR">HR</option>
                  <option value="Interviewer">Interviewer</option>
                  <option value="Reviewer">Reviewer</option>
                  <option value="Viewer">Viewer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {/* IsActive */}
              <div>
                <label className="block mb-1 text-sm font-medium">Status</label>
                <select
                  name="isActive"
                  defaultValue={userData.isActive}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100">
                  <option value="Active">Clear</option>
                  <option value="Inactive">Not Clear</option>
                </select>
              </div>

              {/* Update Button */}
              <div className="md:col-span-2">
                <button
                  type="button"
                  className="w-full bg-purple-600 hover:bg-purple-500 p-3 rounded font-medium transition text-white">
                  Update User
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUserUpdate;
