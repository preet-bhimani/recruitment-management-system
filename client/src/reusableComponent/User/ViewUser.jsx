import React, { useState, useEffect } from "react";
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CommonLoader from "../../components/CommonLoader";
import axiosInstance from "../../routes/axiosInstance";

const ViewUser = () => {

  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  // Back Button
  const handleBack = () => {
    navigate(-1);
  };

  const [userData, setUserData] = useState(null);

  // Fetch User Details
  const fetchUserDataByID = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`User/${id}`);
      setUserData(res.data || []);
    }
    catch (err) {
      toast.error("Failed to load user details!")
    }
    finally {
      setLoading(false);
    }
  }

  // When There is missing Data Show - Instead of
  const safe = (val) => {
    if (val === null || val === undefined) return "-";
    if (typeof val === "string" && val.trim() === "") return "-";
    return String(val);
  };

  useEffect(() => {
    fetchUserDataByID();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <CommonLoader />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        No User Found
      </div>
    );
  }

  // Date Formate
  const formattedDOB = (() => {
    const v = userData.dob;
    if (!v) return "-";
    try {
      const iso = new Date(v).toISOString().split("T")[0];
      return iso.replace(/-/g, "/");
    } catch {
      return safe(v);
    }
  })();

  // Skills Array
  const skills = Array.isArray(userData.skills) ? userData.skills : [];

  // Percentage Logic
  const formatPercent = (val) => {
    if (val === null || val === undefined) return "-";
    if (typeof val === "string" && val.trim() === "") return "-";
    return String(val);
  };

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
                  alt={safe(userData.fullName)}
                  className="w-full h-full object-cover" />
              ) : (
                <span>{userData.fullName.slice(0, 2).toUpperCase()}</span>
              )}
            </div>

            {/* Name and Other Info */}
            <div className="min-w-0">
              <h1 className="text-xl md:text-3xl font-extrabold leading-tight text-white truncate">
                {safe(userData.fullName)}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-neutral-400">
                <span className="flex items-center gap-1">
                  <Mail size={14} className="text-purple-400" /> {safe(userData.email)}
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={14} className="text-purple-400" /> {safe(userData.phoneNumber)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-purple-400" /> {safe(userData.city)}
                </span>
              </div>
              <div className="mt-3 h-0.5 w-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-400" />
            </div>
          </div>

          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${userData.isActive ? "bg-green-600" : "bg-red-600"}`}>
              {userData.isActive ? "Active" : "Inactive"}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 my-5" />

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs md:text-sm text-neutral-400">
          <div>
            <div className="text-purple-400 font-medium">User ID</div>
            <div className="text-neutral-200 break-all">{safe(userData.userId)}</div>
          </div>

          <div>
            <div className="text-purple-400 font-medium">Date of Birth</div>
            <div className="flex items-center gap-2 text-neutral-200">
              {formattedDOB || "-"}
            </div>
          </div>

          <div>
            <div className="text-purple-400 font-medium">Role</div>
            <div className="text-neutral-200">{safe(userData.role)}</div>
          </div>
        </div>

        <div className="border-t border-neutral-800 my-5" />

        {/* Reference and Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs md:text-sm text-neutral-400">
          <div>
            <div className="text-purple-400 font-medium">Reference</div>
            <div className="text-neutral-200">{safe(userData.reference)}</div>
          </div>

          <div>
            <div className="text-purple-400 font-medium">Years of Experience</div>
            <div className="text-neutral-200">{safe(userData.yearsOfExperience)}</div>
          </div>
        </div>

        <div className="border-t border-neutral-800 my-5" />

        {/* Professional Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm text-neutral-400">
          <div>
            <div className="text-purple-400 font-medium">Previous Company</div>
            <div className="text-neutral-200">{safe(userData.preCompanyName)}</div>
          </div>

          <div>
            <div className="text-purple-400 font-medium">Previous Title</div>
            <div className="text-neutral-200">{safe(userData.preCompanyTitle)}</div>
          </div>
        </div>

        <div className="border-t border-neutral-800 my-5" />

        {/* Skills */}
        <div>
          <div className="text-sm font-semibold text-purple-400 mb-2">Skills</div>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s.skillId}
                  className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-200">
                  {s.skillName}
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
            <div className="text-neutral-200">{safe(userData.bachelorDegree)}</div>
            <div className="text-neutral-400 text-xs">
              {safe(userData.bachelorUniversity)} • {formatPercent(userData.bachelorPercentage)}
              {userData.bachelorPercentage ? "%" : ""}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-purple-400 mb-2">Master’s Degree</div>
            <div className="text-neutral-200">{safe(userData.masterDegree)}</div>
            <div className="text-neutral-400 text-xs">
              {safe(userData.masterUniversity)} • {formatPercent(userData.masterPercentage)}
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
                target="_blank"
                rel="noopener noreferrer"
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
