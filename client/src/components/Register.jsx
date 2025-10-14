import React, { useState } from "react";
import { User } from "lucide-react";

const Register = () => {

  const [reference, setReference] = useState("");

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900 rounded-xl shadow-xl p-8">

        {/* Page Content */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-700 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Registration</h1>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Welcome, Candidate</h2>
          <p className="text-neutral-400">Create a account to Apply Jobs</p>
        </div>

        {/* Form Details */}
        <form className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Full Name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              placeholder="Enter Full Name"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Email Address <span className="text-rose-500">*</span></label>
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Password <span className="text-rose-500">*</span></label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Phone Number <span className="text-rose-500">*</span></label>
            <input
              type="tel"
              placeholder="Enter Phone Number"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">City <span className="text-rose-500">*</span></label>
            <input
              type="text"
              placeholder="Enter City"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Date of Birth <span className="text-rose-500">*</span></label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>

          {/* Reference */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Reference <span className="text-rose-500">*</span></label>
            <select
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="" disabled>Select Reference</option>
              <option value="Campus drive">Campus drive</option>
              <option value="Walk in drive">Walk in drive</option>
              <option value="Job platform">Job platform</option>
              <option value="Family friends">Family/Friends</option>
              <option value="Internet">Internet</option>
            </select>
          </div>

          {/* CDID */}
          {reference === "Campus Drive" && (
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Campus Drive ID <span className="text-rose-500">*</span></label>
              <input
                type="text"
                placeholder="Enter Campus Drive ID"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          )}

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Photo <span className="text-rose-500">*</span></label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-purple-700 file:text-white hover:file:bg-purple-800" />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2">
            <User className="w-5 h-5" />
            Register
          </button>
        </form>

        {/* Login Page Link */}
        <div className="text-center mt-6 pt-4 border-t border-neutral-800">
          <p className="text-neutral-400 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
