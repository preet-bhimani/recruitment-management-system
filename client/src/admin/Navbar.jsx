import React, { useState } from "react";
import { ChevronDown, Search, User, LogOut, Settings, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {

  const [ProfileDropdown, setProfileDropdown] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Send the Request to the API Endpoint for Google OAuth
  const handleMeetSettingClick = () => {
    const codeClient = google.accounts.oauth2.initCodeClient({
      client_id: "ID",
      scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      ux_mode: "popup",
      redirect_uri: "http://localhost:5173",
      callback: async (response) => {
        try {
          await axios.post(
            "https://localhost:7119/api/GoogleAuth/exchange",
            { code: response.code },
            { headers: { "Content-Type": "application/json" } }
          );
          toast.success("You have successfully logged in!");
        }
        catch (err) {
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

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdown(!ProfileDropdown)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-800 transition">
            <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-neutral-300" />
            </div>
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          </button>

          {ProfileDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg z-50">
              <div className="py-2">

                {/* DropDown */}
                <a
                  href="/update-profile"
                  className="flex items-center gap-3 px-4 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white transition">
                  <User className="w-4 h-4" />
                  Update Profile
                </a>
                <a
                  href="/update-password-mail"
                  className="flex items-center gap-3 px-4 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white transition">
                  <Key className="w-4 h-4" />
                  Update Password
                </a>

                {/* Logout */}
                <div className="border-t border-neutral-800 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-neutral-800 hover:text-red-300 transition w-full text-left">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
