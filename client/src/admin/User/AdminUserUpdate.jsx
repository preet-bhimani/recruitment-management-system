import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CommonLoader from "../../components/CommonLoader";

const AdminUserUpdate = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [password, setPassword] = useState("");

  // Set Users Data State
  const [userData, setUserData] = useState({
    userId: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    city: "",
    country: "",
    dob: "",
    role: "",
    isActive: "",
    photo: null,
    resume: null,
    reference: "",
    skills: [],
    bachelorDegree: "",
    bachelorUniversity: "",
    bachelorPercentage: "",
    masterDegree: "",
    masterUniversity: "",
    masterPercentage: "",
    yearsOfExperience: "",
    preCompanyName: "",
    preCompanyTitle: "",
  });

  // Error Messages for Each Fields
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    city: "",
    country: "",
    dob: "",
    reference: "",
    photo: "",
    company: "",
    resume: "",
    bachelorPercentage: "",
    masterPercentage: "",
  });

  // Fetch Users Data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://localhost:7119/api/User/${id}`);
      const names = (res.data.skills ?? []).map(s => s.skillName);
      setSelectedSkills(names);
      setUserData(res.data || {});
      setPassword("");
    }
    catch (err) {
      toast.error("failed to load users")
    }
    finally {
      setLoading(false);
    }
  };

  // Fetch Skills
  const fetchSkills = async () => {
    try {
      const res = await axios.get("https://localhost:7119/api/Skill");
      setAllSkills(res.data || []);
    } catch (err) {
      toast.error("Failed to load skills");
    }
  };

  // Skill States and Logic
  const [allSkills, setAllSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

  const filteredSkills = allSkills.filter(
    (skill) =>
      skill.skillName.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedSkills.includes(skill.skillName)
  );

  const addSkill = (skillName) => {
    if (!selectedSkills.includes(skillName)) {
      setSelectedSkills([...selectedSkills, skillName]);
    }
    setInputValue("");
  };

  const removeSkill = (skillName) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skillName));
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
      setUserData({ ...userData, photo: null });
      return;
    }

    if (file.size > maxSize) {
      setErrors({ ...errors, photo: "File size cannot exceed 5 MB" });
      setUserData({ ...userData, photo: null });
      return;
    }

    setErrors({ ...errors, photo: "" });
    setUserData({ ...userData, photo: file });
  };

  // Resume Submit Validation
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const maxSize = 10 * 1024 * 1024;

    if (!file) {
      setErrors((prev) => ({ ...prev, resume: "" }));
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, resume: "Only PDF or Word files are allowed" });
      setUserData({ ...userData, resume: null });
      return;
    }

    if (file.size > maxSize) {
      setErrors({ ...errors, resume: "File size cannot exceed 10 MB" });
      setUserData({ ...userData, resume: null });
      return;
    }

    setErrors({ ...errors, resume: "" });
    setUserData({ ...userData, resume: file });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // Handle Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { ...errors };

    // Full Name Validation
    if (!userData.fullName) {
      newErrors.fullName = "Please enter full name";
      hasError = true;
    }
    else {
      newErrors.fullName = "";
    }

    // Password Validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (password && !passwordRegex.test(password)) {
      newErrors.password =
        "Password must be 8+ chars, include one lowercase, uppercase, number, and symbol";
      hasError = true;
    }
    else {
      newErrors.password = "";
    }

    // Phone Validation
    const phoneRegex = /^\+[1-9]\d{7,14}$/;
    if (!userData.phoneNumber) {
      newErrors.phoneNumber = "Please enter phone number";
      hasError = true;
    }
    else if (!phoneRegex.test(userData.phoneNumber)) {
      newErrors.phoneNumber = "Phone must start with + and country code";
      hasError = true;
    }
    else {
      newErrors.phoneNumber = "";
    }

    // City Validation
    if (!userData.city) {
      newErrors.city = "Please enter city";
      hasError = true;
    }
    else {
      newErrors.city = "";
    }

    // Country Validation
    if (!userData.country) {
      newErrors.country = "Please enter country";
      hasError = true;
    }
    else {
      newErrors.country = "";
    }

    // DOB Validation
    if (!userData.dob) {
      newErrors.dob = "Please select Date of Birth";
      hasError = true;
    }
    else {
      newErrors.dob = "";
    }

    // Reference Validation
    if (!userData.reference) {
      newErrors.reference = "Please enter reference";
      hasError = true;
    }
    else {
      newErrors.reference = "";
    }

    // Bachelor Percentage Validation
    if (!/^\d{1,3}(\.\d{1,2})?$/.test(userData.bachelorPercentage)) {
      newErrors.bachelorPercentage = "Maximum 2 digits allowed after decimal.";
    }
    else if (parseFloat(userData.bachelorPercentage) > 100 || parseFloat(userData.bachelorPercentage) < 0) {
      newErrors.bachelorPercentage = "Minimum 0% to maximum 100% allowed.";
    }

    // Master Percentage Validation
    if (!/^\d{1,3}(\.\d{1,2})?$/.test(userData.masterPercentage)) {
      newErrors.masterPercentage = "Maximum 2 digits allowed after decimal.";
    }
    else if (parseFloat(userData.masterPercentage) > 100 || parseFloat(userData.masterPercentage) < 0) {
      newErrors.masterPercentage = "Minimum 0% to maximum 100% allowed.";
    }

    // Set Error and Stop Execution If Any Errors Found
    setErrors(newErrors);
    if (hasError) return;

    // Create Form Data to Add New User
    const submitData = new FormData();
    submitData.append("FullName", userData.fullName.trim());
    submitData.append("Email", userData.email.trim());
    if (password.trim() !== "") {
      submitData.append("Password", password);
    }
    submitData.append("PhoneNumber", userData.phoneNumber.trim());
    submitData.append("City", userData.city.trim());
    submitData.append("Country", userData.country.trim());
    submitData.append("DOB", userData.dob);
    submitData.append("Reference", userData.reference);
    if (userData.photo instanceof File)
      submitData.append("photo", userData.photo);

    // Optional Fiedls
    if (userData.bachelorDegree)
      submitData.append("BachelorDegree", userData.bachelorDegree);
    if (userData.bachelorUniversity)
      submitData.append("BachelorUniversity", userData.bachelorUniversity);
    if (userData.bachelorPercentage)
      submitData.append("BachelorPercentage", userData.bachelorPercentage);
    if (userData.masterDegree)
      submitData.append("MasterDegree", userData.masterDegree);
    if (userData.masterUniversity)
      submitData.append("MasterUniversity", userData.masterUniversity);
    if (userData.masterPercentage)
      submitData.append("MasterPercentage", userData.masterPercentage);
    if (userData.yearsOfExperience)
      submitData.append("YearsOfExperience", userData.yearsOfExperience);
    if (userData.preCompanyName)
      submitData.append("PreCompanyName", userData.preCompanyName);
    if (userData.preCompanyTitle)
      submitData.append("PreCompanyTitle", userData.preCompanyTitle);
    if (userData.resume)
      submitData.append("resume", userData.resume);
    if (userData.role)
      submitData.append("Role", userData.role);

    selectedSkills.forEach(skillName => {
      const skill = allSkills.find(s => s.skillName === skillName);
      if (skill) submitData.append("SkillIds", skill.skillId);
    });

    if (userData.isActive !== undefined && userData.isActive !== null) {
      submitData.append("IsActive", userData.isActive);
    }

    try {
      setSubmitLoading(true);
      const res = await axios.put(
        `https://localhost:7119/api/User/update/${id}`,
        submitData
      );
      toast.success(res.data.message || "User updated successfully!");
      navigate("/admin-user");
    }
    catch (err) {
      toast.error(err.response?.data?.message || "User update failed!");
    }
    finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSkills();
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <CommonLoader />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Content */}
        <main className="flex-1 bg-neutral-950 text-white p-3 sm:p-6 overflow-y-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Admin User Update</h1>
          </div>

          {submitLoading && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
              <div className="bg-neutral-900 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                <CommonLoader />
              </div>
            </div>
          )}

          {/* User Update Form */}
          <div className="max-w-6xl mx-auto">
            <form
              onSubmit={handleSubmit}
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg
                ${submitLoading ? "pointer-events-none opacity-70" : ""}`}>

              {/* User ID */}
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium text-neutral-300">
                  User ID
                </label>
                <input
                  type="text"
                  value={userData.userId}
                  disabled
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-300 cursor-not-allowed" />
              </div>

              {/* Full Name */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={userData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  disabled
                  value={userData.email}
                  placeholder="Enter email"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
              </div>

              {/* City */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  City <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={userData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
              </div>

              {/* Country */}
              <div>
                <label className="block mb-1 text-sm font-medium">Country <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="Enter Country"
                  value={userData.country}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                {errors.country && (<p className="text-rose-500 text-sm mt-1">{errors.country}</p>)}
              </div>

              {/* DOB */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={userData.dob}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100" />
                {errors.dob && <p className="text-red-500 text-xs">{errors.dob}</p>}
              </div>

              {/* Skills */}
              <div>
                <label className="block mb-1 text-sm font-medium">Skills</label>
                <input
                  type="text"
                  placeholder="Type to search skills"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />

                {/* Suggestions for Skills */}
                {inputValue && filteredSkills.length > 0 && (
                  <ul className="bg-neutral-800 border border-neutral-700 rounded mt-1 max-h-40 overflow-y-auto">
                    {filteredSkills
                      .filter((skill) =>
                        skill.skillName.toLowerCase().includes(inputValue.toLowerCase())
                      )
                      .slice(0, 4)
                      .map((skill) => (
                        <li
                          key={skill.skillId}
                          onClick={() => addSkill(skill.skillName)}
                          className="p-2 hover:bg-purple-700 cursor-pointer">
                          {skill.skillName}
                        </li>
                      ))}
                  </ul>
                )}

                {/* Selected Skills */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-purple-600 text-white px-3 py-1 rounded-full flex items-center gap-1">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)}>
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Photo */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Photo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="file"
                  name="photo"
                  accept=".jpg,.jpeg,.png"
                  onChange={handlePhotoChange}
                  className="w-full p-1.5 rounded bg-neutral-800 border border-neutral-600 text-neutral-100
                  file:h-8.5 file:px-3 file:rounded file:border-0 
                  file:bg-neutral-700 file:text-white hover:file:bg-purple-800 cursor-pointer"/>
                {errors.photo && <p className="text-red-500 text-xs">{errors.photo}</p>}
              </div>

              {/* Resume */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Resume <span className="text-rose-500">*</span>
                </label>
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  className="w-full p-1.5 rounded bg-neutral-800 border border-neutral-600 text-neutral-100
                  file:h-8.5 file:px-3 file:rounded file:border-0 
                  file:bg-neutral-700 file:text-white hover:file:bg-purple-800 cursor-pointer"/>
                {errors.resume && <p className="text-red-500 text-xs">{errors.resume}</p>}
              </div>

              {/* Bachelor Details */}
              <div>
                <label className="block mb-1 text-sm font-medium">Bachelor Degree</label>
                <input
                  type="text"
                  name="bachelorDegree"
                  placeholder="Enter degree"
                  value={userData.bachelorDegree}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Bachelor University</label>
                <input
                  type="text"
                  name="bachelorUniversity"
                  placeholder="Enter university"
                  value={userData.bachelorUniversity}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Bachelor %</label>
                <input
                  type="number"
                  name="bachelorPercentage"
                  min="0"
                  placeholder="Enter percentage"
                  value={userData.bachelorPercentage}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                {errors.bachelorPercentage && <p className="text-red-500 text-xs">{errors.bachelorPercentage}</p>}
              </div>

              {/* Master Details */}
              <div>
                <label className="block mb-1 text-sm font-medium">Master Degree</label>
                <input
                  type="text"
                  name="masterDegree"
                  placeholder="Enter degree"
                  value={userData.masterDegree}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Master University</label>
                <input
                  type="text"
                  name="masterUniversity"
                  placeholder="Enter university"
                  value={userData.masterUniversity}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Master %</label>
                <input
                  type="number"
                  name="masterPercentage"
                  min="0"
                  placeholder="Enter percentage"
                  value={userData.masterPercentage}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                {errors.masterPercentage && <p className="text-red-500 text-xs">{errors.masterPercentage}</p>}
              </div>

              {/* Experience */}
              <div>
                <label className="block mb-1 text-sm font-medium">Years of Experience</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  min="0"
                  placeholder="Enter years"
                  value={userData.yearsOfExperience}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Previous Company Name</label>
                <input
                  type="text"
                  name="preCompanyName"
                  placeholder="Enter company"
                  value={userData.preCompanyName}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Previous Company Title</label>
                <input
                  type="text"
                  name="preCompanyTitle"
                  placeholder="Enter title"
                  value={userData.preCompanyTitle}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
              </div>

              {/* Reference */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Reference <span className="text-rose-500">*</span>
                </label>
                <select
                  name="reference"
                  value={userData.reference}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100">
                  <option value="" disabled>Select Reference</option>
                  <option value="Campus drive">Campus drive</option>
                  <option value="Walk in drive">Walk in drive</option>
                  <option value="Job platform">Job platform</option>
                  <option value="Family friends">Family/Friends</option>
                  <option value="Internet">Internet</option>
                </select>
                {errors.reference && <p className="text-red-500 text-xs">{errors.reference}</p>}
              </div>

              {/* Role */}
              <div>
                <label className="block mb-1 text-sm font-medium">Role</label>
                <select
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100">
                  <option value="" disabled>Select Role</option>
                  <option value="Candidate">Candidate</option>
                  <option value="Recruiter">Recruiter</option>
                  <option value="HR">HR</option>
                  <option value="Interviewer">Interviewer</option>
                  <option value="Reviewer">Reviewer</option>
                  <option value="Viewer">Viewer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {/* IsActive */}
              <div>
                <label className="block mb-1 text-sm font-medium">Status</label>
                <select
                  name="isActive"
                  value={userData.isActive}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100">
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>

              {/* Update Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className={`w-full p-2 rounded font-medium transition
                        ${submitLoading
                      ? "bg-neutral-600 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-500"
                    }`}>
                  {submitLoading ? "Updating..." : "+ Update User "}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUserUpdate;
