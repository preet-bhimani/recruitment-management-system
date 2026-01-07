import React, { useState, useEffect, useRef } from "react";
import { User, Camera, Phone, MapPin, Calendar, Save } from "lucide-react";
import CommonNavbar from "../components/CommonNavbar";
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import CommonLoader from "../components/CommonLoader";
import axiosInstance from "../routes/axiosInstance";

const UpdateProfile = () => {

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Profile Data
  const [profileData, setProfileData] = useState({
    fullName: "",
    phoneNumber: "",
    country: "",
    city: "",
    dob: "",
    photo: null,
    photoPreview: null
  });

  // Error Message
  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
    country: "",
    city: "",
    dob: "",
    photo: "",
  });

  const { userId } = useAuth();
  const fileInputRef = useRef(null);

  // Fetch Users Data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`User/${userId}`);
      setProfileData((prev) => ({
        ...prev,
        ...res.data,
        photoPreview: res.data.photo,
        photo: null
      }));
    }
    catch (err) {
      toast.error("failed to load users")
    }
    finally {
      setLoading(false);
    }
  };

  // Photo Submit Validation
  const handlePhotoChange = (e) => {

    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024;

    if (!file) {
      setErrors((prev) => ({ ...prev, photo: "" }));
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, photo: "Only jpg, jpeg, png files are allowed" });
      setProfileData({ ...profileData, photo: null });
      return;
    }

    if (file.size > maxSize) {
      setErrors({ ...errors, photo: "File size cannot exceed 5 MB" });
      setProfileData({ ...profileData, photo: null });
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setProfileData((prev) => ({
      ...prev,
      photo: file,
      photoPreview: previewUrl,
    }));

    setErrors({ ...errors, photo: "" });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { ...errors };

    // Full Name Validation
    if (!profileData.fullName) {
      newErrors.fullName = "Please enter full name";
      hasError = true;
    }
    else {
      newErrors.fullName = "";
    }

    // Phone Validation
    const phoneRegex = /^\+[1-9]\d{7,14}$/;
    if (!profileData.phoneNumber) {
      newErrors.phoneNumber = "Please enter phone number";
      hasError = true;
    }
    else if (!phoneRegex.test(profileData.phoneNumber)) {
      newErrors.phoneNumber = "Phone must start with + and country code";
      hasError = true;
    }
    else {
      newErrors.phoneNumber = "";
    }

    // City Validation
    if (!profileData.city) {
      newErrors.city = "Please enter city";
      hasError = true;
    }
    else {
      newErrors.city = "";
    }

    // Country Validation
    if (!profileData.country) {
      newErrors.country = "Please enter country";
      hasError = true;
    }
    else {
      newErrors.country = "";
    }

    // DOB Validation
    if (!profileData.dob) {
      newErrors.dob = "Please select Date of Birth";
      hasError = true;
    }
    else {
      newErrors.dob = "";
    }

    // Set Error and Stop Execution If Any Errors Found
    setErrors(newErrors);
    if (hasError) return;

    const formData = new FormData();
    formData.append("fullName", profileData.fullName);
    formData.append("phoneNumber", profileData.phoneNumber);
    formData.append("country", profileData.country);
    formData.append("city", profileData.city);
    formData.append("dob", profileData.dob);
    if (profileData.photo instanceof File)
      formData.append("photo", profileData.photo);

    try {
      setSubmitLoading(true);
      const res = await axiosInstance.post(`User/update-profile/${userId}`, formData)
      toast.success(res.data.message || "User profile updated successfully!");
      navigate(-1);
    }
    catch (err) {
      toast.error(err.response.data || "Something went wrong!");
    }
    finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUsers();
    }
  }, [userId]);

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <CommonLoader />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950">
      {/* Navbar */}
      <CommonNavbar isLoggedIn />

      {/* Main Layout */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Update Profile</h1>
          </div>

          {submitLoading && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
              <div className="bg-neutral-900 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                <CommonLoader />
              </div>
            </div>
          )}

          {/* Form */}
          <div className="bg-neutral-900 rounded-lg p-8">
            <form className={`space-y-6${submitLoading ? "pointer-events-none opacity-70" : ""}`}>
              {/* Profile Picture */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-neutral-800 rounded-full flex items-center justify-center overflow-hidden border-4 border-neutral-700">
                    {profileData.photoPreview ? (
                      <img
                        src={profileData.photoPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-neutral-400" />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-purple-700 hover:bg-purple-800 rounded-full flex items-center justify-center transition">
                    <Camera className="w-5 h-5 text-white" />
                  </button>

                  <input
                    id="photoInput"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handlePhotoChange} />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  defaultValue={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter Full Name" />
                {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={profileData.phoneNumber}
                  onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter Phone Number" />
                {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
              </div>

              {/* Country */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                  <MapPin className="w-4 h-4" />
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  defaultValue={profileData.country}
                  onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter Country" />
                {errors.country && <p className="text-red-500 text-xs">{errors.country}</p>}
              </div>

              {/* City */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                  <MapPin className="w-4 h-4" />
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  defaultValue={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter City" />
                {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
              </div>

              {/* DOB */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                  <Calendar className="w-4 h-4" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  defaultValue={profileData.dob}
                  onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" />
                {errors.dob && <p className="text-red-500 text-xs">{errors.dob}</p>}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium transition
                    ${submitLoading
                      ? "bg-neutral-600 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-500"
                    }`}
                  onClick={handleSubmit}>
                  <Save className="w-4 h-4" />
                  {submitLoading ? "Updating..." : "+ Update Profile "}
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


export default UpdateProfile;
