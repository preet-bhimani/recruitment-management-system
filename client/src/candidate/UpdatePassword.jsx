import React, { useState } from "react";
import { Lock, Save } from "lucide-react";
import CommonNavbar from "../components/CommonNavbar";
import Footer from "../components/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UpdatePassword = () => {

    const navigate = useNavigate();

    // Password States
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const location = useLocation();
    const email = location.state?.email || "";

    // Handle Update Password
    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast.error("Please enter both password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const res = await axios.post(`https://localhost:7119/api/Auth/reset-password`, {
                email: email,
                newPassword: newPassword
            });

            toast.success(res.data || "Password updated successfully!");
            navigate(-1);
        }
        catch (err) {
            toast.error(err.response.data || "Something went wrong!");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-neutral-950">
            {/* Navbar */}
            <CommonNavbar isLoggedIn />

            {/* Main Layout */}
            <main className="flex-1 py-8 px-4">
                <div className="max-w-md mx-auto">

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-4">New Password</h1>
                        <p className="text-neutral-400">Create New Password</p>
                    </div>

                    {/* Form */}
                    <div className="bg-neutral-900 rounded-lg p-8">
                        <form className="space-y-6">

                            {/* New Password */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                                    <Lock className="w-4 h-4" />
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="Enter New Password" />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                                    <Lock className="w-4 h-4" />
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="Confirm Password" />
                            </div>

                            {/* Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    onClick={handleUpdatePassword}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium transition">
                                    <Save className="w-4 h-4" />
                                    Update Password
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


export default UpdatePassword;
