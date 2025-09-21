import React, { useState } from "react";
import { User, Camera, Phone, MapPin, Calendar, Save } from "lucide-react";
import CommonNavbar from "../components/CommonNavbar";
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom'; 

const UpdateProfile = () => {
  const [profileData, setProfileData] = useState({
    name: "Preet",
    phone: "+91 98987677654",
    city: "Rajkot",
    dob: "2003-05-13",
    profilePicture: null
  });

 const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950">
      {/* Navbar */}
      <CommonNavbar isLoggedIn />
      
      {/* Main Layout */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Update Profile</h1>
          </div>

          {/* Form */}
          <div className="bg-neutral-900 rounded-lg p-8">
            <form className="space-y-6">
              {/* Profile Picture */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-neutral-800 rounded-full flex items-center justify-center overflow-hidden border-4 border-neutral-700">
                    <User className="w-16 h-16 text-neutral-400" />
                  </div>
                  
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-10 h-10 bg-purple-700 hover:bg-purple-800 rounded-full flex items-center justify-center transition">
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                  
                  <input
                    id="profilePictureInput"
                    type="file"
                    accept="image/*"
                    className="hidden"/>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={profileData.name}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter Full Name"/>
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={profileData.phone}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter Phone Number"/>
              </div>

              {/* City */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                  <MapPin className="w-4 h-4" />
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  defaultValue={profileData.city}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter City"/>
              </div>

              {/* DOB */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                  <Calendar className="w-4 h-4" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  defaultValue={profileData.dob}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"/>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition">
                  Cancel
                </button>               
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium transition">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};


export default UpdateProfile;
