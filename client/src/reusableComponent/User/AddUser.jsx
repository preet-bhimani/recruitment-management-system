import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import CommonLoader from "../../components/CommonLoader";

const AddUser = ({ role = "admin" }) => {

    // All Form Data Fields
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        city: "",
        country: "",
        dob: "",
        reference: "",
        cdid: "",
        bachelorDegree: "",
        bachelorUniversity: "",
        bachelorPercentage: "",
        masterDegree: "",
        masterUniversity: "",
        masterPercentage: "",
        yearsOfExperience: "",
        preCompanyName: "",
        preCompanyTitle: "",
        photo: null,
        role: role && role.trim() !== "" ? role : "Candidate",
        selectedSkillIds: [],
        isActive: true,
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
        cdid: "",
        photo: "",
        company: "",
        resume: "",
        bachelorPercentage: "",
        masterPercentage: "",
    });

    // Password Visibility Toggle
    const [showPassword, setShowPassword] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

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

    // Resume Submit Validation
    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ["application/pdf", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        const maxSize = 10 * 1024 * 1024;

        if (!file) return;

        if (!allowedTypes.includes(file.type)) {
            setErrors({ ...errors, resume: "Only PDF or Word files are allowed" });
            setFormData({ ...formData, resume: null });
            return;
        }

        if (file.size > maxSize) {
            setErrors({ ...errors, resume: "File size cannot exceed 10 MB" });
            setFormData({ ...formData, resume: null });
            return;
        }

        setErrors({ ...errors, resume: "" });
        setFormData({ ...formData, resume: file });
    };

    // Skills Fetch and Set Skills Logic
    const [allSkills, setAllSkills] = useState([]);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await axios.get("https://localhost:7119/api/Skill");
                setAllSkills(res.data || []);
            }
            catch (err) {
                toast.error(err.response?.data || "Failed to load skills");
            }
        };
        fetchSkills();
    }, [])

    const [inputValue, setInputValue] = useState("");
    const [selectedSkills, setSelectedSkills] = useState([]);

    const filteredSkills = allSkills
        .filter(
            (skill) =>
                skill.skillName.toLowerCase().includes(inputValue.toLowerCase()) &&
                !selectedSkills.includes(skill));

    const addSkill = (skill) => {
        setSelectedSkills((prev) => {
            if (!prev.some((s) => s.skillId === skill.skillId)) {
                return [...prev, { skillId: skill.skillId, skillName: skill.skillName }];
            }
            return prev;
        });
        setInputValue("");
    };

    const removeSkill = (skill) => {
        setSelectedSkills((prev) => prev.filter((s) => s.skillId !== skill.skillId));
    };

    // Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = { ...errors };

        // Full Name Validation
        if (!formData.fullName) {
            newErrors.fullName = "Please enter full name";
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

        // Password Validation
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!formData.password) {
            newErrors.password = "Please enter password";
            hasError = true;
        }
        else if (!passwordRegex.test(formData.password)) {
            newErrors.password =
                "Password must be 8+ chars, include one lowercase, uppercase, number, and symbol";
            hasError = true;
        }
        else {
            newErrors.password = "";
        }

        // Phone Validation
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
            newErrors.dob = "Please select Date of Birth";
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

        // CDID Validation
        if (formData.reference === "Campus drive" && !formData.cdid) {
            newErrors.cdid = "Please enter Campus Drive ID";
            hasError = true;
        }
        else {
            newErrors.cdid = "";
        }

        // Photo Validation
        if (!formData.photo) {
            newErrors.photo = "Please upload photo";
            hasError = true;
        }
        else {
            newErrors.photo = "";
        }

        // Bachelor Percentage Validation
        if (!/^\d{1,3}(\.\d{1,2})?$/.test(formData.bachelorPercentage)) {
            newErrors.bachelorPercentage = "Maximum 2 digits allowed after decimal.";
        }
        else if (parseFloat(formData.bachelorPercentage) > 100 || parseFloat(formData.bachelorPercentage) < 0) {
            newErrors.bachelorPercentage = "Minimum 0% to maximum 100% allowed.";
        }

        // Master Percentage Validation
        if (!/^\d{1,3}(\.\d{1,2})?$/.test(formData.masterPercentage)) {
            newErrors.masterPercentage = "Maximum 2 digits allowed after decimal.";
        }
        else if (parseFloat(formData.masterPercentage) > 100 || parseFloat(formData.masterPercentage) < 0) {
            newErrors.masterPercentage = "Minimum 0% to maximum 100% allowed.";
        }

        // Set Error and Stop Execution If Any Errors Found
        setErrors(newErrors);
        if (hasError) return;

        // Create form data and append all fields
        const submitData = new FormData();
        submitData.append("FullName", formData.fullName.trim());
        submitData.append("Email", formData.email.trim());
        submitData.append("Password", formData.password);
        submitData.append("PhoneNumber", formData.phoneNumber.trim());
        submitData.append("City", formData.city.trim());
        submitData.append("Country", formData.country.trim());
        submitData.append("DOB", formData.dob);
        submitData.append("Reference", formData.reference);
        submitData.append("Role", formData.role);
        submitData.append("photo", formData.photo);
        submitData.append("IsActive", formData.isActive ? "true" : "false");

        if (formData.reference === "Campus Drive" && formData.cdid)
            submitData.append("CDID", formData.cdid);

        // Optional Fiedls
        if (formData.bachelorDegree)
            submitData.append("BachelorDegree", formData.bachelorDegree);
        if (formData.bachelorUniversity)
            submitData.append("BachelorUniversity", formData.bachelorUniversity);
        if (formData.bachelorPercentage)
            submitData.append("BachelorPercentage", formData.bachelorPercentage);
        if (formData.masterDegree)
            submitData.append("MasterDegree", formData.masterDegree);
        if (formData.masterUniversity)
            submitData.append("MasterUniversity", formData.masterUniversity);
        if (formData.masterPercentage)
            submitData.append("MasterPercentage", formData.masterPercentage);
        if (formData.yearsOfExperience)
            submitData.append("YearsOfExperience", formData.yearsOfExperience);
        if (formData.preCompanyName)
            submitData.append("PreCompanyName", formData.preCompanyName);
        if (formData.preCompanyTitle)
            submitData.append("PreCompanyTitle", formData.preCompanyTitle);
        if (formData.resume)
            submitData.append("resume", formData.resume);

        if (selectedSkills.length > 0) {
            selectedSkills.forEach(skill => {
                submitData.append("SkillIds", skill.skillId);
            });
        }

        try {
            setSubmitLoading(true);
            const res = await axios.post(
                "https://localhost:7119/api/User/create",
                submitData
            );
            toast.success(res.data.message || "User created successfully!");
        }
        catch (err) {
            toast.error(err.response?.data?.message || "User creation failed!");
        }
        finally {
            setSubmitLoading(false);
        }
    };

    return <>
        {submitLoading && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                <div className="bg-neutral-900 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                    <CommonLoader />
                    <span className="text-neutral-200 text-sm">
                        Adding User
                    </span>
                </div>
            </div>
        )}

        <form
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg
                ${submitLoading ? "pointer-events-none opacity-70" : ""}`}
            onSubmit={handleSubmit}>

            {/* Full Name */}
            <div>
                <label className="block mb-1 text-sm font-medium">
                    Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
                <label className="block mb-1 text-sm font-medium">
                    Email <span className="text-rose-500">*</span>
                </label>
                <input
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
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
                        className="w-full p-2 bg-neutral-800 border rounded border-neutral-700 text-white placeholder-neutral-400" />
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
                <label className="block mb-1 text-sm font-medium">
                    Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
            </div>

            {/* City */}
            <div>
                <label className="block mb-1 text-sm font-medium">
                    City <span className="text-rose-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
            </div>

            {/* Country */}
            <div>
                <label className="block mb-1 text-sm font-medium">Country <span className="text-rose-500">*</span></label>
                <input
                    type="text"
                    placeholder="Enter Country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                {errors.country && (<p className="text-rose-500 text-sm mt-1">{errors.country}</p>)}
            </div>

            {/* DOB */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-200">
                    Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-200" />
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
                        {filteredSkills.slice(0, 4).map((skill) => (
                            <li
                                key={skill.skillId}
                                onClick={() => addSkill(skill)}
                                className="p-2 hover:bg-purple-700 cursor-pointer">
                                {skill.skillName}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Selected Skills */}
                <div className="mt-2 flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                        <span
                            key={skill.skillId}
                            className="bg-purple-600 text-white px-3 py-1 rounded-full flex items-center gap-1">
                            {skill.skillName}
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
                    accept=".jpg,.jpeg,.png"
                    onChange={handlePhotoChange}
                    className="w-full p-1.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-200
                    file:h-8.5 file:px-3 file:rounded file:border-0 
                  file:bg-neutral-600 file:text-white hover:file:bg-purple-800 cursor-pointer"/>
                {errors.photo && <p className="text-red-500 text-xs">{errors.photo}</p>}
            </div>

            {/* Resume */}
            <div>
                <label className="block mb-1 text-sm font-medium">
                    Resume
                </label>
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    className="w-full p-1.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-200
                    file:h-8.5 file:px-3 file:rounded file:border-0 
                  file:bg-neutral-600 file:text-white hover:file:bg-purple-800 cursor-pointer"/>
                {errors.resume && <p className="text-red-500 text-xs">{errors.resume}</p>}
            </div>

            {/* Bachelor Details */}
            <div>
                <label className="block mb-1 text-sm font-medium">Bachelor Degree</label>
                <input
                    type="text"
                    placeholder="Enter degree"
                    value={formData.bachelorDegree}
                    onChange={(e) => setFormData({ ...formData, bachelorDegree: e.target.value })}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Bachelor University</label>
                <input
                    type="text"
                    placeholder="Enter university"
                    value={formData.bachelorUniversity}
                    onChange={(e) => setFormData({ ...formData, bachelorUniversity: e.target.value })}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Bachelor %</label>
                <input
                    type="text"
                    placeholder="Enter percentage"
                    value={formData.bachelorPercentage}
                    onChange={(e) => setFormData({ ...formData, bachelorPercentage: e.target.value })}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                {errors.bachelorPercentage && <p className="text-red-500 text-xs">{errors.bachelorPercentage}</p>}
            </div>

            {/* Master Details */}
            <div>
                <label className="block mb-1 text-sm font-medium">Master Degree</label>
                <input
                    type="text"
                    placeholder="Enter degree"
                    value={formData.masterDegree}
                    onChange={(e) => setFormData({ ...formData, masterDegree: e.target.value })}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Master University</label>
                <input
                    type="text"
                    placeholder="Enter university"
                    value={formData.masterUniversity}
                    onChange={(e) => setFormData({ ...formData, masterUniversity: e.target.value })}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Master %</label>
                <input
                    type="text"
                    placeholder="Enter percentage"
                    value={formData.masterPercentage}
                    onChange={(e) => setFormData({ ...formData, masterPercentage: e.target.value })}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                {errors.masterPercentage && <p className="text-red-500 text-xs">{errors.masterPercentage}</p>}
            </div>

            {/* Experience */}
            <div>
                <label className="block mb-1 text-sm font-medium">Years of Experience</label>
                <input
                    type="number"
                    placeholder="Enter years"
                    min="0"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Previous Company Name</label>
                <input
                    type="text"
                    placeholder="Enter company"
                    value={formData.preCompanyName}
                    onChange={(e) => setFormData({ ...formData, preCompanyName: e.target.value })}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Previous Company Title</label>
                <input
                    type="text"
                    placeholder="Enter title"
                    value={formData.preCompanyTitle}
                    onChange={(e) => setFormData({ ...formData, preCompanyTitle: e.target.value })}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
            </div>

            {/* Reference */}
            <div>
                <label className="block mb-1 text-sm font-medium">
                    Reference <span className="text-rose-500">*</span>
                </label>
                <select
                    name="reference"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100">
                    <option value="" disabled>Select Reference</option>
                    <option value="Campus drive">Campus drive</option>
                    <option value="Walk in drive">Walk in drive</option>
                    <option value="Job platform">Job platform</option>
                    <option value="Family friends">Family/Friends</option>
                    <option value="Internet">Internet</option>
                </select>
                {errors.reference && <p className="text-red-500 text-xs">{errors.reference}</p>}
            </div>

            {/* CDID */}
            <div>
                <label className="block mb-1 text-sm font-medium">CDID</label>
                <input
                    type="text"
                    placeholder="Enter CDID"
                    value={formData.cdid}
                    onChange={(e) => setFormData({ ...formData, cdid: e.target.value })}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                {errors.cdid && <p className="text-red-500 text-xs">{errors.cdid}</p>}
            </div>

            {role === 'admin' && (
                <>
                    {/* Role */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100">
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

                    {/* Status */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Status</label>
                        <select
                            value={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700">
                            <option value={true}>Active</option>
                            <option value={false}>Inactive</option>
                        </select>
                    </div>
                </>
            )}
            {/* Submit */}
            <div className="md:col-span-2">
                <button
                    type="submit"
                    disabled={submitLoading}
                    className={`w-full p-2 rounded font-medium transition
                        ${submitLoading
                            ? "bg-purple-400 cursor-not-allowed"
                            : "bg-purple-600 hover:bg-purple-500"
                        }`}>
                    {submitLoading ? "Adding..." : "+ Add User"}
                </button>
            </div>
        </form>
    </>;
};

export default AddUser;
