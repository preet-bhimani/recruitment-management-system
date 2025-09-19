import React from "react";
import { LogIn } from "lucide-react";

const Login = () => {
    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-neutral-800 rounded-xl shadow-xl p-8">

                {/* Page Content */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <LogIn className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Login Portal</h1>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">Welcome Back</h2>
                    <p className="text-neutral-400">Enter your email and password to access your account</p>
                </div>

                {/* Form Details */}
                <form className="space-y-5">
                    <div>

                        {/* Email */}
                        <label className="block text-sm font-medium text-neutral-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2">
                        <LogIn className="w-5 h-5" />
                        Login
                    </button>
                </form>

                {/* Register Page Link */}
                <div className="text-center mt-6 pt-4 border-t border-neutral-700">
                    <p className="text-neutral-400 text-sm">
                        Don't have an account?{" "}
                        <a href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Create new account
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
