import React, { use, useEffect, useState } from "react";
import { MapPin, Clock, Briefcase, GraduationCap, Star, Building2, CheckCircle } from "lucide-react";
import CommonNavbar from "../components/CommonNavbar";
import Footer from "../components/Footer";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const JobDescription = () => {

  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);

  const aboutCompany = "xxxyyyzzz has a crystal-clear vision. Our mission is to help our clients to achieve sustainable results through cutting-edge supply chain software and services. Our clients can expect noteworthy benefits like increased profitability, resilience, and long-term growth.";
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchJob = async () => {
    try {
      const res = await axios.get(`https://localhost:7119/api/JobOpening/${id}`);
      const data = res.data;
      setJobData({
        ...data,
        requiredSkills: data.requiredSkills ? data.requiredSkills.split(",") : [],
        preferredSkills: data.preferredSkills ? data.preferredSkills.split(",") : [],
        description: data.description
          ? data.description.split(/\n+/).map(line => line.trim()).filter(Boolean)
          : [],
      });
    } catch (err) {
      toast.error("Error to fetch job details!");
    }
    finally {
      setLoading(false);
    }
  }

  const { userId, role, token } = useAuth();
  const applyForJob = async () => {
    if (!userId) {
      toast.error("Please login to apply for this job");
      navigate("/login");
      return;
    }

    if (role !== "Candidate") {
      toast.error("Only candidates can apply for jobs");
      return;
    }

    try {
      const res = await axios.post(`https://localhost:7119/api/Candidate/apply`, { joId: id }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Applied Successfully!');
      navigate(-1);
    }
    catch (err) {
      toast.error(err.response.data || ("Failed to apply!"))
    }
  }

  useEffect(() => {
    fetchJob();
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        Loading job details...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950">
      {/* Navbar */}
      <CommonNavbar isLoggedIn={true} role="Candidates" />

      {/* Main Layout */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-neutral-900 rounded-lg p-8 mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">{jobData.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-neutral-400 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{jobData.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{jobData.jobType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                <span>{jobData.experience} experience</span>
              </div>
            </div>

            {/* Apply Button */}
            {!userId ? (
              <button
                className="px-12 py-4 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold text-lg transition shadow-lg"
                onClick={() => navigate("/login")}>
                Login to Apply
              </button>
            ) : role !== "Candidate" ? (
              <button
                className="px-12 py-4 bg-gray-600 text-white rounded-lg font-semibold text-lg cursor-not-allowed opacity-50"
                disabled>
                Only Candidates Can Apply
              </button>
            ) : (
              <button
                className="px-12 py-4 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold text-lg transition shadow-lg"
                onClick={applyForJob}>
                Apply for This Job
              </button>
            )}
          </div>

          {/* Job Details */}
          <div className="space-y-8">

            {/* Qualification */}
            <div className="bg-neutral-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-400" />
                Qualification
              </h2>
              <p className="text-neutral-300">{jobData.qualification}</p>
            </div>

            {/*  Required Skills */}
            <div className="bg-neutral-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {jobData.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-neutral-800 text-neutral-300 rounded-lg text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Skills */}
            <div className="bg-neutral-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                Preferred Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {jobData.preferredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-yellow-900/20 text-yellow-300 rounded-lg text-sm border border-yellow-800">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Roles & Responsibilities */}
            <div className="bg-neutral-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-purple-400" />
                Roles & Responsibilities
              </h2>
              <ul className="space-y-3">
                {jobData.description.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-3 text-neutral-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Comment */}
            <div className="bg-neutral-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-cyan-400" />
                Comment
              </h2>
              <p className="text-neutral-300">{jobData?.comment || "No comments available."}</p>
            </div>


            {/* About xxxyyyzzz */}
            <div className="bg-neutral-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-indigo-400" />
                About xxxyyyzzz
              </h2>
              <p className="text-neutral-300 leading-relaxed">{aboutCompany}</p>
            </div>

            {/* Apply Button */}
            <div className="text-center pt-6">
              {/* Apply Button */}
              {!userId ? (
                <button
                  className="px-12 py-4 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold text-lg transition shadow-lg"
                  onClick={() => navigate("/login")}>
                  Login to Apply
                </button>
              ) : role !== "Candidate" ? (
                <button
                  className="px-12 py-4 bg-gray-600 text-white rounded-lg font-semibold text-lg cursor-not-allowed opacity-50"
                  disabled>
                  Only Candidates Can Apply
                </button>
              ) : (
                <button
                  className="px-12 py-4 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold text-lg transition shadow-lg"
                  onClick={applyForJob}>
                  Apply for This Job
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default JobDescription;
