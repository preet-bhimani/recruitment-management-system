import React, { useState } from "react";
import { LogIn, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: "", password: "" });

    // Password Visibility Toggle
    const [showPassword, setShowPassword] = useState(false);

    // Submit Form
    const handleSubmit = async (e) => {

        e.preventDefault();

        let hasError = false;
        const newErrors = { ...errors };

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "Please enter email address";
            hasError = true;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format";
            hasError = true;
        } else {
            newErrors.email = "";
        }

        // Password Validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!formData.password) {
            newErrors.password = "Please enter your password";
            hasError = true;
        }
        else if (!passwordRegex.test(formData.password)) {
            newErrors.password = "Password must be 8+ chars, include one lowercase, uppercase, number, and symbol";
            hasError = true;
        }
        else {
            newErrors.password = "";
        }

        setErrors(newErrors);
        if (hasError) return;

        try {
            const res = await axios.post(`https://localhost:7119/api/Auth/login`, {
                email: formData.email.trim(),
                password: formData.password
            });

            // Store Token and Role in Session Storage
            sessionStorage.setItem("accessToken", res.data.token);
            sessionStorage.setItem("refreshToken", res.data.refreshToken);
            sessionStorage.setItem("userRole", res.data.role ?? "Candidate");

            toast.success(res.data.message || "Login successful!");

            // Navigate According to Role
            const role = String(res.data.role ?? "Candidate").toLowerCase();
            switch (role) {
                case "admin":
                    navigate("/admin", { replace: true });
                    break;
                case "recruiter":
                    navigate("/recruiter-dashboard", { replace: true });
                    break;
                case "hr":
                    navigate("/hr-feedback", { replace: true });
                    break;
                case "interviewer":
                    navigate("/interviewer-feedback", { replace: true });
                    break;
                case "reviewer":
                    navigate("/reviewer-dashboard", { replace: true });
                    break;
                case "viewer":
                    navigate("/viewer-user", { replace: true });
                    break;
                case "candidate":
                default:
                    navigate("/", { replace: true });
                    break;
            }
        }
        catch (err) {
            toast.error(err.response?.data || "Login failed!");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-neutral-900 rounded-xl shadow-xl p-8">

                {/* Page Content */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-700 rounded-lg flex items-center justify-center">
                            <LogIn className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Login Portal</h1>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">Welcome Back</h2>
                    <p className="text-neutral-400">Enter your email and password to access your account</p>
                </div>

                {/* Form Details */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>

                        {/* Email */}
                        <label className="block text-sm font-medium text-neutral-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        {errors.email && (<p className="text-rose-500 text-sm mt-1">{errors.email}</p>)}
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Password <span className="text-rose-500">*</span></label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 pr-12 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                                className="absolute inset-y-0 right-3 flex items-center justify-center text-neutral-400 hover:text-white">
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (<p className="text-rose-500 text-sm mt-1">{errors.password}</p>)}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2">
                        <LogIn className="w-5 h-5" />
                        Login
                    </button>
                </form>

                {/* Register Page Link */}
                <div className="text-center mt-6 pt-4 border-t border-neutral-800">
                    <p className="text-neutral-400 text-sm">
                        Don't have an account?{" "}
                        <a href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                            Create new account
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
