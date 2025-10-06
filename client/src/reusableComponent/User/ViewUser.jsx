import React, { useState } from "react";
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewUser = () => {

  const navigate = useNavigate();

  // Back Button
  const handleBack = () => {
    navigate(-1);
  };

  const [userData] = useState({
    userId: "8723A287-BBB3-46C9-BD23-08DDAE2FEC35",
    fullName: "Preet Bhimani",
    email: "preet@gmail.com",
    password: "***",
    phoneNumber: "9377382731",
    city: "Rajkot",
    dob: "2003-05-13",
    role: "Admin",
    isActive: "Active",
    photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
    resume: "https://www.pancardapp.com/blog/wp-content/uploads/2019/04/sample-pan-card.jpg", // if present, will show download button
    reference: "Friends",
    skills: "ASP.NET React JavaScript Java Git",
    bachelorDegree: "Bachelor of Computer Applications",
    bachelorUniversity: "RK University",
    bachelorPercentage: "78.3",
    masterDegree: "Master of Computer Applications",
    masterUniversity: "RK University",
    masterPercentage: "90.0",
    yearsOfExperience: "0",
    previousCompanyName: "",
    previousCompanyTitle: "",
    cdid: "",
  });

  // When There is missing Data Show - Instead of
  const getValue = (val) => {
    if (val === null || val === undefined) return "-";
    if (typeof val === "string" && val.trim() === "") return "-";
    return String(val);
  };

  // Date Formate
  const formattedDOB = (() => {
    const v = userData.dob;
    if (!v) return "-";
    try {
      const iso = new Date(v).toISOString().split("T")[0];
      return iso.replace(/-/g, "/");
    } catch {
      return getValue(v);
    }
  })();

  // Skills Array
  const skills = userData.skills ? userData.skills.split(/\s+/).filter(Boolean) : [];

  // Percentage Logic
  const formatPercent = (val) => {
    if (val === null || val === undefined) return "-";
    if (typeof val === "string" && val.trim() === "") return "-";
    return String(val);
  };

  // When There is no Image Show Name Insted of
  const initials = (() => {
    const name = userData.fullName;
    if (!name || !name.trim()) return "-";
    const parts = name.trim().split(/\s+/);
    const i = parts.slice(0, 2).map((p) => p[0] || "").join("").toUpperCase();
    return i || "-";
  })();

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-6 flex justify-center">

      {/* Back Button */}
      <button
        onClick={handleBack}
        aria-label="Go back"
        className="fixed top-4 left-4 z-50 bg-neutral-800 text-white p-2 rounded-full shadow-md hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="w-full max-w-6xl bg-neutral-900 border border-neutral-800 rounded-lg p-5 md:p-8 shadow-sm mt-12">

        {/* Main Layout */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">

            {/* Photo */}
            <div className="w-14 h-14 rounded-md bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 overflow-hidden">
              {userData.photo ? (
                <img
                  src={userData.photo}
                  alt={getValue(userData.fullName)}
                  className="w-full h-full object-cover"/>
              ) : (
                <span>{initials}</span>
              )}
            </div>

            {/* Name and Other Info */}
            <div className="min-w-0">
              <h1 className="text-xl md:text-3xl font-extrabold leading-tight text-white truncate">
                {getValue(userData.fullName)}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-neutral-400">
                <span className="flex items-center gap-1">
                  <Mail size={14} /> {getValue(userData.email)}
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={14} /> {getValue(userData.phoneNumber)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {getValue(userData.city)}
                </span>
              </div>
              <div className="mt-3 h-0.5 w-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-400" />
            </div>
          </div>

          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getValue(userData.isActive) === "Active" ? "bg-green-600" : "bg-red-600"}`}>
              {getValue(userData.isActive)}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 my-5" />

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs md:text-sm text-neutral-400">
          <div>
            <div className="text-purple-400 font-medium">User ID</div>
            <div className="text-neutral-200 break-all">{getValue(userData.userId)}</div>
          </div>

          <div>
            <div className="text-purple-400 font-medium">Date of Birth</div>
            <div className="flex items-center gap-2 text-neutral-200">
              {formattedDOB || "-"}
            </div>
          </div>

          <div>
            <div className="text-purple-400 font-medium">Role</div>
            <div className="text-neutral-200">{getValue(userData.role)}</div>
          </div>
        </div>

        <div className="border-t border-neutral-800 my-5" />

        {/* Reference and Experience and CDID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs md:text-sm text-neutral-400">
          <div>
            <div className="text-purple-400 font-medium">Reference</div>
            <div className="text-neutral-200">{getValue(userData.reference)}</div>
          </div>

          <div>
            <div className="text-purple-400 font-medium">Years of Experience</div>
            <div className="text-neutral-200">{getValue(userData.yearsOfExperience)}</div>
          </div>

          <div>
            <div className="text-purple-400 font-medium">CDID</div>
            <div className="text-neutral-200">{getValue(userData.cdid)}</div>
          </div>
        </div>

        <div className="border-t border-neutral-800 my-5" />

        {/* Professional Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm text-neutral-400">
          <div>
            <div className="text-purple-400 font-medium">Previous Company</div>
            <div className="text-neutral-200">{getValue(userData.previousCompanyName)}</div>
          </div>

          <div>
            <div className="text-purple-400 font-medium">Previous Title</div>
            <div className="text-neutral-200">{getValue(userData.previousCompanyTitle)}</div>
          </div>
        </div>

        <div className="border-t border-neutral-800 my-5" />

        {/* Skills */}
        <div>
          <div className="text-sm font-semibold text-purple-400 mb-2">Skills</div>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-200">
                  {getValue(skill)}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-neutral-400 text-sm">-</div>
          )}
        </div>

        <div className="border-t border-neutral-800 my-5" />

        {/* Education Details */}
        <div className="space-y-4">
          <div>
            <div className="text-sm font-semibold text-purple-400 mb-2">Bachelor’s Degree</div>
            <div className="text-neutral-200">{getValue(userData.bachelorDegree)}</div>
            <div className="text-neutral-400 text-xs">
              {getValue(userData.bachelorUniversity)} • {formatPercent(userData.bachelorPercentage)}
              {userData.bachelorPercentage ? "%" : ""}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-purple-400 mb-2">Master’s Degree</div>
            <div className="text-neutral-200">{getValue(userData.masterDegree)}</div>
            <div className="text-neutral-400 text-xs">
              {getValue(userData.masterUniversity)} • {formatPercent(userData.masterPercentage)}
              {userData.masterPercentage ? "%" : ""}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 my-5" />

        {/* Resume */}
        <div>
          <div className="text-purple-400 font-medium mb-2">Resume</div>
          <div>
            {userData.resume ? (
              <a
                href={userData.resume}
                download
                className="inline-block px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-white text-sm">
                Download Resume
              </a>
            ) : (
              <div className="text-neutral-400">-</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
