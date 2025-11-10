import React, { useState } from "react";
import logo from '../photos/company logo/ROIMA.jpeg';
import { Search, User, FileText, Key, Bell, Briefcase, LogOut, ChevronDown, Upload } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const CommonNavbar = ({ hasPendingDocuments = false, openUploadPopup }) => {

    const [ProfileDropdown, setProfileDropdown] = useState(false);
    const { isLoggedIn, role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-neutral-900 border-b border-neutral-800 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Company Logo */}
                <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                        <img
                            src={logo}
                            alt="Company Logo"
                            className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-md mx-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search jobs"
                            className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                    </div>
                </div>

                {/* Right Section */}
                {isLoggedIn ? (
                    <div className="flex items-center gap-4">

                        {/* Upload Documents Button*/}
                        {role === "Candidate" && hasPendingDocuments && (
                            <button
                                onClick={() => navigate(`/upload-documents/${pendingJAId}`)}
                                className="flex items-center gap-2 px-3 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-sm font-medium transition">
                                <Upload className="w-4 h-4" />
                                Upload Documents
                            </button>
                        )}

                        {/* Profile Section */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileDropdown(!ProfileDropdown)}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-800 transition">
                                <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-neutral-300" />
                                </div>
                                <ChevronDown className="w-4 h-4 text-neutral-400" />
                            </button>

                            {/* Profile Dropdown Menu */}
                            {ProfileDropdown && (
                                <div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg z-50">
                                    <div className="py-2">

                                        {/* Only for Candidate */}
                                        {role === "Candidate" && (
                                            <>
                                                <a
                                                    href="/resume"
                                                    className="flex items-center gap-3 px-4 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white transition">
                                                    <FileText className="w-4 h-4" />
                                                    Resume
                                                </a>
                                                <a
                                                    href="/notifications"
                                                    className="flex items-center gap-3 px-4 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white transition">
                                                    <Bell className="w-4 h-4" />
                                                    Notifications
                                                </a>
                                                <a
                                                    href="/myjobs"
                                                    className="flex items-center gap-3 px-4 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white transition">
                                                    <Briefcase className="w-4 h-4" />
                                                    My Jobs
                                                </a>
                                            </>
                                        )}

                                        {/* Common Sections */}
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
                ) : (
                    <div className="flex items-center gap-3">
                        <a
                            href="/login"
                            className="px-4 py-2 text-neutral-300 hover:text-white transition">
                            Login
                        </a>
                        <a
                            href="/register"
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition">
                            Register
                        </a>
                    </div>
                )}
            </div>

            {/* Close Dropdown Overlay */}
            {ProfileDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdown(false)} />
            )}
        </nav>
    );
};

export default CommonNavbar;
