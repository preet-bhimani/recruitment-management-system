import React, { useState } from "react";
import { User, Eye, EyeOff } from "lucide-react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CommonLoader from "./CommonLoader";

const Register = () => {

  const [submitLoading, setSubmitLoading] = useState(false);

  // All Form Data Fileds
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    city: "",
    country: "",
    dob: "",
    reference: "",
    photo: null
  });

  // Error Messages for Each Fileds
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    city: "",
    country: "",
    dob: "",
    reference: "",
    photo: ""
  });

  const navigate = useNavigate();

  // Password Visibility Toggle
  const [showPassword, setShowPassword] = useState(false);

  // Photo Submit Validation
  const handlePhotoChange = (e) => {

    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, photo: "Only jpg, jpeg, png files are allowed" });
      setFormData({ ...formData, photo: null });
      return;
    }

    if (file.size > maxSize) {
      setErrors({ ...errors, photo: "File size cannot exceed 5 MB" });
      setFormData({ ...formData, photo: null });
      return;
    }

    setErrors({ ...errors, photo: "" });
    setFormData({ ...formData, photo: file });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { ...errors };

    // Full Name Validation
    if (!formData.fullName) {
      newErrors.fullName = "Please enter your name";
      hasError = true;
    }
    else {
      newErrors.fullName = "";
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Please enter email address";
      hasError = true;
    }
    else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
      hasError = true;
    }
    else {
      newErrors.email = "";
    }

    // Passsword Validation
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

    //Phone Validation
    const phoneRegex = /^\+[1-9]\d{7,14}$/;
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Please enter phone number";
      hasError = true;
    }
    else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone must start with + and country code";
      hasError = true;
    }
    else {
      newErrors.phoneNumber = "";
    }

    // City Validation
    if (!formData.city) {
      newErrors.city = "Please enter city";
      hasError = true;
    }
    else {
      newErrors.city = "";
    }

    // Country Validation
    if (!formData.country) {
      newErrors.country = "Please enter country";
      hasError = true;
    }
    else {
      newErrors.country = "";
    }

    // DOB Validation
    if (!formData.dob) {
      newErrors.dob = "Please enter Date of Birth";
      hasError = true;
    }
    else {
      newErrors.dob = "";
    }

    // Reference Validation
    if (!formData.reference) {
      newErrors.reference = "Please enter reference";
      hasError = true;
    }
    else {
      newErrors.reference = "";
    }

    // Photo Validation
    if (!formData.photo) {
      newErrors.photo = "Please upload photo";
      hasError = true;
    }

    // Set Erroer If Any
    setErrors(newErrors);

    // If Error Occurs then Stop Submit
    if (hasError) return;

    // Create New Form Data and Append all Fields
    const submitData = new FormData();
    submitData.append("fullName", formData.fullName);
    submitData.append("email", formData.email.trim());
    submitData.append("password", formData.password);
    submitData.append("phoneNumber", formData.phoneNumber);
    submitData.append("city", formData.city);
    submitData.append("country", formData.country);
    submitData.append("dob", formData.dob);
    submitData.append("reference", formData.reference);
    submitData.append("photo", formData.photo);

    try {
      setSubmitLoading(true);
      const res = await axios.post(`https://localhost:7119/api/Auth/register`, submitData);

      // Show Success Message and Jump to Login Page
      toast.success(res.data.message || "Registration successful!");
      navigate('/login');
    }
    catch (err) {
      toast.error(err.response?.data || "Registration failed!");
    }
    finally {
      setSubmitLoading(false);
    }
  }

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
        </div>

        {submitLoading && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="bg-neutral-900 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
              <CommonLoader />
            </div>
          </div>
        )}

        {/* Form Details */}
        <form
          className={`space-y-4 ${submitLoading ? "pointer-events-none opacity-70" : ""}`}
          onSubmit={handleSubmit}>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Full Name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              placeholder="Enter Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            {errors.fullName && (<p className="text-rose-500 text-sm mt-1">{errors.fullName}</p>)}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Email Address <span className="text-rose-500">*</span></label>
            <input
              type="email"
              placeholder="Enter Email"
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

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Phone Number <span className="text-rose-500">*</span></label>
            <input
              type="tel"
              placeholder="Enter Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            {errors.phoneNumber && (<p className="text-rose-500 text-sm mt-1">{errors.phoneNumber}</p>)}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">City <span className="text-rose-500">*</span></label>
            <input
              type="text"
              placeholder="Enter City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            {errors.city && (<p className="text-rose-500 text-sm mt-1">{errors.city}</p>)}
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Country <span className="text-rose-500">*</span></label>
            <input
              type="text"
              placeholder="Enter Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            {errors.country && (<p className="text-rose-500 text-sm mt-1">{errors.country}</p>)}
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Date of Birth <span className="text-rose-500">*</span></label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            {errors.dob && (<p className="text-rose-500 text-sm mt-1">{errors.dob}</p>)}
          </div>

          {/* Reference */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Reference <span className="text-rose-500">*</span></label>
            <select
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="" disabled>Select Reference</option>
              <option value="Campus drive">Campus drive</option>
              <option value="Walk in drive">Walk in drive</option>
              <option value="Job platform">Job platform</option>
              <option value="Family friends">Family/Friends</option>
              <option value="Internet">Internet</option>
            </select>
            {errors.reference && (<p className="text-rose-500 text-sm mt-1">{errors.reference}</p>)}
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Photo <span className="text-rose-500">*</span></label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handlePhotoChange}
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-purple-700 file:text-white hover:file:bg-purple-800" />
            {errors.photo && (<p className="text-rose-500 text-sm mt-1">{errors.photo}</p>)}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitLoading}
            className={`w-full bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2
              ${submitLoading
                ? "bg-neutral-600 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-500"
              }`}>
            <User className="w-5 h-5" />
            {submitLoading ? "Registering..." : "Register"}
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
