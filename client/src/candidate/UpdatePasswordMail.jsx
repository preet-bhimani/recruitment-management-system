import React, { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import CommonNavbar from "../components/CommonNavbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UpdatePasswordMail = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    // Send OTP
    const sendOtp = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        try {
            const res = await axios.post(`https://localhost:7119/api/Auth/send-otp`, { email: email });
            toast.success("OTP sent to your email!");
            navigate('/update-password-otp', { state: { email } });
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
                        <h1 className="text-4xl font-bold text-white mb-4">Reset Password</h1>
                        <p className="text-neutral-400">Enter Your Email to Receive OTP</p>
                    </div>

                    {/* Form */}
                    <div className="bg-neutral-900 rounded-lg p-8">
                        <form className="space-y-6" onSubmit={sendOtp}>
                            {/* Email */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                                    <Mail className="w-4 h-4" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="Enter Email " />
                            </div>

                            {/* Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    onClick={sendOtp}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium transition">
                                    <ArrowRight className="w-4 h-4" />
                                    Send OTP
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


export default UpdatePasswordMail;
