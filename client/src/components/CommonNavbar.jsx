import React, { useState } from "react";
import logo from '../photos/company logo/ROIMA.jpeg';
import { Search, User, FileText, Key, Bell, Briefcase, LogOut, ChevronDown, Upload } from "lucide-react";

const CommonNavbar = ({ isLoggedIn = false, hasSelectedApplication = false }) => {
    const [ProfileDropdown, setProfileDropdown] = useState(false);

    return (
        <nav className="bg-neutral-800 border-b border-neutral-700 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Company Logo */}
                <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                        <img
                            src={logo}
                            alt="Company Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-md mx-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search jobs"
                            className="w-full pl-10 pr-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Right Section */}
                {isLoggedIn ? (
                    <div className="flex items-center gap-4">
                        
                        {/* Upload Documents Link - Only show if candidate has selected application */}
                        {hasSelectedApplication && (
                            <a
                                href="/upload-documents"
                                className="flex items-center gap-2 px-3 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-sm font-medium transition">
                                <Upload className="w-4 h-4" />
                                Upload Documents
                            </a>
                        )}

                        {/* Profile Section */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileDropdown(!ProfileDropdown)}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-700 transition">
                                <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-neutral-300" />
                                </div>
                                <ChevronDown className="w-4 h-4 text-neutral-400" />
                            </button>

                            {/* Profile Dropdown Menu */}
                            {ProfileDropdown && (
                                <div className="absolute right-0 mt-2 w-56 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-50">
                                    <div className="py-2">
                                        <a
                                            href="/resume"
                                            className="flex items-center gap-3 px-4 py-2 text-neutral-300 hover:bg-neutral-700 hover:text-white transition">
                                            <FileText className="w-4 h-4" />
                                            Resume
                                        </a>
                                        <a
                                            href="/update-profile"
                                            className="flex items-center gap-3 px-4 py-2 text-neutral-300 hover:bg-neutral-700 hover:text-white transition">
                                            <User className="w-4 h-4" />
                                            Update Profile
                                        </a>
                                        <a
                                            href="/update-password-mail"
                                            className="flex items-center gap-3 px-4 py-2 text-neutral-300 hover:bg-neutral-700 hover:text-white transition">
                                            <Key className="w-4 h-4" />
                                            Update Password
                                        </a>
                                        <a
                                            href="/notifications"
                                            className="flex items-center gap-3 px-4 py-2 text-neutral-300 hover:bg-neutral-700 hover:text-white transition">
                                            <Bell className="w-4 h-4" />
                                            Notifications
                                        </a>
                                        <a
                                            href="/my-jobs"
                                            className="flex items-center gap-3 px-4 py-2 text-neutral-300 hover:bg-neutral-700 hover:text-white transition">
                                            <Briefcase className="w-4 h-4" />
                                            My Jobs
                                        </a>
                                        <div className="border-t border-neutral-700 mt-2 pt-2">
                                            <button
                                                onClick={() => console.log("Logout")}
                                                className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-neutral-700 hover:text-red-300 transition w-full text-left">
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

            {/* Drop Down Close*/}
            {ProfileDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdown(false)}/>
            )}
        </nav>
    );
};

export default CommonNavbar;
