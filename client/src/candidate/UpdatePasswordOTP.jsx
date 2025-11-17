import React, { useState, useEffect } from "react";
import { Shield, ArrowRight } from "lucide-react";
import CommonNavbar from "../components/CommonNavbar";
import Footer from "../components/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UpdatePasswordOTP = () => {

    const navigate = useNavigate();

    // OTP States
    const [otp, setOtp] = useState("");
    const location = useLocation();

    const OTP_LIFETIME = 5 * 60;
    const RESEND_COOLDOWN = 90;

    const [secondsLeft, setSecondsLeft] = useState(OTP_LIFETIME);
    const [resendLeft, setResendLeft] = useState(0);
    const [expired, setExpired] = useState(false);
    const [loadingVerify, setLoadingVerify] = useState(false);
    const [loadingResend, setLoadingResend] = useState(false);

    // Email passed from previous page
    const email = location.state?.email || "";

    // Verify OTP
    const verifyOtp = async (e) => {
        e.preventDefault();

        if (!otp) {
            toast.error("Enter OTP");
            return;
        }

        if (expired || secondsLeft <= 0) {
            toast.error("OTP expired. Please resend or request a new OTP.");
            setExpired(true);
            return;
        }

        try {
            setLoadingVerify(true);
            const res = await axios.post("https://localhost:7119/api/Auth/verify-otp", {
                email: email,
                otp: otp
            });

            toast.success(res.data?.message || "OTP Verified!");
            navigate("/update-password", { state: { email } });
        }
        catch (err) {
            toast.error(err.response.data || "Invalid OTP");
        }
        finally {
            setLoadingVerify(false);
        }
    };

    // Resend OTP
    const resendOtp = async () => {
        if (!email) {
            toast.error("Email not found. Go back and enter email again.");
            return;
        }

        try {
            setLoadingResend(true);
            const res = await axios.post("https://localhost:7119/api/Auth/send-otp", { email });
            toast.success(res.data.message || "New OTP sent to your email!");

            // Reset timers: OTP lifetime and resend cooldown
            setSecondsLeft(OTP_LIFETIME);
            setResendLeft(RESEND_COOLDOWN);
            setExpired(false);
        }
        catch (err) {
            toast.error(err.response.data || "Failed to resend OTP");
        }
        finally {
            setLoadingResend(false);
        }
    };

    // Formate for Timining
    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    // Use Effect for Timing
    useEffect(() => {

        if (expired) return;

        // Timer for OTP Expiration
        const interval = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setExpired(true);
                    return 0;
                }
                return prev - 1;
            });

            setResendLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [expired]);

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
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-center text-2xl tracking-widest"
                                    placeholder="000000" />
                            </div>

                            {/* Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    onClick={verifyOtp}
                                    disabled={expired || loadingVerify}
                                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition ${expired ? 'bg-neutral-700 text-neutral-400' : 'bg-purple-700 hover:bg-purple-800 text-white'}`}>
                                    <ArrowRight className="w-4 h-4" />
                                    {loadingVerify ? "Verifying..." : (expired ? "Expired" : "Verify OTP")}
                                </button>
                            </div>
                        </form>

                        {/* Resend Button */}
                        <div className="text-center mt-6">
                            <p className="text-neutral-400 text-sm">
                                {expired ? (
                                    <>
                                        OTP expired.{" "}
                                        <button className="text-purple-400 hover:text-purple-300 font-medium" onClick={resendOtp} disabled={loadingResend}>
                                            Request new OTP
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Time left: <span className="font-mono ml-1">{formatTime(secondsLeft)}</span>
                                        {" — "}
                                        <button
                                            className={`ml-2 ${resendLeft > 0 ? "text-neutral-500" : "text-purple-400 hover:text-purple-300 font-medium"}`}
                                            onClick={resendOtp}
                                            disabled={resendLeft > 0 || loadingResend}>
                                            {resendLeft > 0 ? `Resend in ${resendLeft}s` : (loadingResend ? "Sending..." : "Resend OTP")}
                                        </button>
                                    </>
                                )}
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
