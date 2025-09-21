import React from "react";
import { Shield, ArrowRight } from "lucide-react";
import CommonNavbar from "../components/CommonNavbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const UpdatePasswordOTP = () => {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-neutral-950">
            {/* Navbar */}
            <CommonNavbar isLoggedIn />

            {/* Main Layout */}
            <main className="flex-1 py-8 px-4">
                <div className="max-w-md mx-auto">

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-4">Enter OTP</h1>
                        <p className="text-neutral-400">Enter OTP sent to your email</p>
                    </div>

                    {/* Form */}
                    <div className="bg-neutral-900 rounded-lg p-8">
                        <form className="space-y-6">

                            {/* OTP */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                                    <Shield className="w-4 h-4" />
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    maxLength="6"
                                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-center text-2xl tracking-widest"
                                    placeholder="000000" />
                            </div>

                            {/* Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    onClick={() => navigate("/update-password")}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium transition">
                                    <ArrowRight className="w-4 h-4" />
                                    Verify OTP
                                </button>
                            </div>
                        </form>

                        {/* Resend Button */}
                        <div className="text-center mt-6">
                            <p className="text-neutral-400 text-sm">
                                Didn't receive code?{" "}
                                <button className="text-purple-400 hover:text-purple-300 font-medium">
                                    Resend OTP
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};


export default UpdatePasswordOTP;
