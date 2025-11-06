import React from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Settings } from 'lucide-react';
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {

  const navigate = useNavigate();

  // Send the Request to the API Endpoint for Google OAuth
  const handleMeetSettingClick = () => {
    const codeClient = google.accounts.oauth2.initCodeClient({
      client_id: "ID",
      scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      ux_mode: "popup",
      redirect_uri: "http://localhost:5173",
      callback: async (response) => {
        try{
        await axios.post(
          "https://localhost:7119/api/GoogleAuth/exchange",
          { code: response.code },
          { headers: { "Content-Type": "application/json" } }
        );
        toast.success("You have successfully logged in!");
        }
        catch(err)
        {
          toast.error("An error occurred while logging in.");
        }
      },
      prompt: "consent",
    });
    codeClient.requestCode();
  };

  return (
    <header className="bg-neutral-900 text-neutral-100 px-4 py-3 flex items-center justify-between border-b border-neutral-700">
      {/* Company Name */}
      <div className="text-lg font-semibold tracking-wide">
        Dashboard
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-neutral-800 rounded-lg px-2 w-1/2 max-w-md">
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 bg-transparent text-neutral-200 px-2 py-1 focus:outline-none placeholder-neutral-400"
        />
        <Search className="text-neutral-400" size={18} />
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleMeetSettingClick}
          className="flex items-center gap-1 text-sm bg-neutral-800 hover:bg-neutral-700 px-2 py-1 rounded-md border border-neutral-600">
          <Settings size={14} />
          <span>Meet Setting</span>
        </button>
        <span className="hidden sm:inline text-sm text-neutral-300">
          Admin
        </span>
        <img
          src="https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg"
          className="w-10 h-10 rounded-full border-2 border-neutral-600"
          alt="profile"
        />
      </div>
    </header>
  );
};

export default Navbar;
