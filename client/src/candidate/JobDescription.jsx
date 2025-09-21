import React from "react";
import { MapPin, Clock, Briefcase, GraduationCap, Star, Building2, CheckCircle } from "lucide-react";
import CommonNavbar from "../components/CommonNavbar";
import Footer from "../components/Footer";

const JobDescription = () => {
  const jobData = {
    joid: "8723A287-BBB3-46C9-BD23-08DDAE2FEC35",
    title: "Sr. Software Engineer",
    location: "Mumbai",
    experience: "7+ years",
    jobType: "Full Time",
    qualification: "B.Tech CE/IT, M.Tech CE/IT, MCA",
    requiredSkills: [
      "SDK / API productization.",
      "Azure cloud services & infrastructure automation",
      "C/C++",
      "API security & cryptography best practices",
      "SQL"
    ],
    preferredSkills: [
      "Post-Quantum Cryptography (PQC)",
      "Awareness of compliance frameworks (SOC2, ISO 27001)",
      "HSMs, secure enclaves, or developer adoption pipelines",
    ],
    rolesResponsibilities: [
      "Package and distribute SDKs across multiple languages (Python, C#, C/C++).",
      "Deploy SDK services in Azure cloud (VMs, AKS, Key Vault, App Services).",
      "Ensure secure APIs (TLS, OAuth2, JWT, PKI) and strong networking",
      "Implement software licensing & monetization models (subscription/usage-based)",
      "Enable client adoption with CI/CD pipelines, templates, and best practices",
    ],
    aboutCompany: "Roima has a crystal-clear vision. Our mission is to help our clients to achieve sustainable results through cutting-edge supply chain software and services. Our clients can expect noteworthy benefits like increased profitability, resilience, and long-term growth."
  };



  return (
    <div className="min-h-screen flex flex-col bg-neutral-900">
      {/* Navbar */}
      <CommonNavbar isLoggedIn={true} />

      {/* Main Layout */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          <div className="bg-neutral-800 rounded-lg p-8 mb-8">
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
            <button
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-lg transition">
              Apply for This Job
            </button>
          </div>

          {/* Job Details */}
          <div className="space-y-8">

            {/* Qualification */}
            <div className="bg-neutral-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-400" />
                Qualification
              </h2>
              <p className="text-neutral-300">{jobData.qualification}</p>
            </div>

            {/*  Required Skills */}
            <div className="bg-neutral-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {jobData.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-neutral-700 text-neutral-300 rounded-lg text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Skills */}
            <div className="bg-neutral-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                Preferred Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {jobData.preferredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-yellow-900/20 text-yellow-300 rounded-lg text-sm border border-yellow-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Roles & Responsibilities */}
            <div className="bg-neutral-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-purple-400" />
                Roles & Responsibilities
              </h2>
              <ul className="space-y-3">
                {jobData.rolesResponsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-3 text-neutral-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* About Roima */}
            <div className="bg-neutral-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-indigo-400" />
                About Roima
              </h2>
              <p className="text-neutral-300 leading-relaxed">{jobData.aboutCompany}</p>
            </div>

            {/* Apply Button */}
            <div className="text-center pt-6">
              <button
                className="px-12 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-lg transition shadow-lg">
                Apply for This Job
              </button>
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
