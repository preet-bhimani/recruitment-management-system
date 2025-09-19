import React, { useState } from "react";
import CommonNavbar from "../components/CommonNavbar";
import Footer from "../components/Footer";
import { MapPin, Briefcase, Plus } from "lucide-react";

const CandidateDashboard = () => {

  const [filters, setFilters] = useState({
    city: "",
    experience: ""
  });

  const location = [
    "Location",
    "Säterinkatu 6",
    "Pori",
    "Seinäjoki",
    "Tampere",
    "Turku",
    "Aalborg",
    "Aarhus",
    "Holte",
    "Göteborg",
    "Linköping",
    "Västerås",
    "Ahmedabad",
    "Mumbai",
    "Bloomingdale, IL (Chicago)"
  ];

  const experienceLevels = [
    "Experience",
    "0",
    "1+",
    "2+",
    "3+"
  ];

  const jobs = [
    {
      joId: "8723A287-BBB3-46C9-BD23-08DDAE2FEC35",
      title: "Sr. Software Engineer",
      city: "Ahmedabad",
      jobType: "Full time",
      experience: "7+ years"
    },
    {
      joId: "9CF256C4-7ECA-4469-8CCE-08DD70ACE5C1",
      title: "Jr. AI Developer",
      city: "Ahmedabad",
      jobType: "Full time",
      experience: "2+ years"
    },
    {
      joId: "4091FDD1-2D1F-44F5-00BB-08DDB922600D",
      title: "Data Scientist",
      city: "Tampere",
      jobType: "Full time",
      experience: "1+ years"
    },
    {
      joId: "8723C287-DDD3-46E9-BF23-08FFCE2HGE35",
      title: "Sr. HR Manager",
      city: "Göteborg",
      jobType: "Full time",
      experience: "4+ years"
    }
  ];

  return <div className="min-h-screen flex flex-col bg-neutral-900">
    {/* Navbar */}
    <CommonNavbar isLoggedIn={true} />

    {/* Main Content */}
    <main className="flex-1 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Wanna Join Us</h1>
          <p className="text-neutral-400">Find Your Next Opportuinty</p>
        </div>

        {/* Filters */}
        <div className="bg-neutral-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Location</label>
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {location.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Experience Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Experience</label>
              <select
                value={filters.experience}
                onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {experienceLevels.map(exp => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            {/* Apply Filters */}
            <div className="flex items-end">
              <button className="w-full px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map(job => (
            <div key={job.id} className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 hover:border-neutral-600 transition">

              {/* Job Details */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{job.title}</h2>

                  <div className="flex items-center gap-4 text-neutral-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{job.city}</span>
                    </div>
                    <span className="text-sm">{job.jobType}</span>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">Experience: {job.experience}</span>
                    </div>
                  </div>
                </div>

                {/* View Job Button */}
                <button
                  onClick={() => console.log(`Viewing job: ${job.title}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition ml-4">
                  <Plus className="w-4 h-4" />
                  View Job
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>

    {/* Footer */}
    <Footer />
  </div>;
};

export default CandidateDashboard;
