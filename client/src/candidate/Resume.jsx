import React, { useEffect, useState } from "react";
import CommonNavbar from "../components/CommonNavbar";
import { Upload, FileText } from "lucide-react";
import axiosInstance from "../routes/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const Resume = () => {

    const navigate = useNavigate();
    const { userId } = useAuth();

    const [userData, setUserData] = useState({
        userId: "", 
        fullName: "",
        email: "",
        phoneNumber: "",
        city: "",
        country: "",
        dob: "",
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

    const [errors, setErrors] = useState({
        resume: ""
    })

    const [allSkills, setAllSkills] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [selectedSkills, setSelectedSkills] = useState([]);

    // Fetch User Details
    const fetchUserDetails = async () => {
        try {
            const res = await axiosInstance.get(`User/${userId}`);
            const names = (res.data.skills ?? []).map(s => s.skillName);
            setSelectedSkills(names);
            setUserData(prev => ({
                ...prev,
                ...res.data,
            }));
        }
        catch (err) {
            toast.error("Failed to load user details");
        }
    }

    // Fetch Skills
    const fetchSkills = async () => {
        try {
            const res = await axiosInstance.get(`Skill`);
            setAllSkills(res.data || []);
        }
        catch (err) {
            toast.error("Failed to load skills");
        }
    }

    // Skill Add And Remove Logic
    const filteredSkills = allSkills.filter(
        (skill) =>
            skill.skillName.toLowerCase().includes(inputValue.toLowerCase()) &&
            !selectedSkills.includes(skill.skillName)
    )

    const addSkill = (skillName) => {
        if (!selectedSkills.includes(skillName)) {
            setSelectedSkills([...selectedSkills, skillName]);
        }
        setInputValue("");
    }

    const removeSkill = (skillName) => {
        setSelectedSkills(selectedSkills.filter((s) => s !== skillName));
    }

    // Resume Handle
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = { ...errors };

        setErrors(newErrors);
        if (hasError) return;

        const submitData = new FormData();
        submitData.append("FullName", userData.fullName);
        submitData.append("Email", userData.email);
        submitData.append("PhoneNumber", userData.phoneNumber);
        submitData.append("City", userData.city);
        submitData.append("Country", userData.country);
        submitData.append("Reference", userData.reference);
        submitData.append("DOB", userData.dob);

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

        selectedSkills.forEach(skillName => {
            const skill = allSkills.find(s => s.skillName === skillName);
            if (skill) submitData.append("SkillIds", skill.skillId);
        });

        try {
            const res = await axiosInstance.put(`User/update/${userId}`, submitData);
            toast.success(res.data?.message || "User updated successfully");
            navigate(-1);
        }
        catch (err) {
            console.log(err.response?.data);
            toast.error(err.response?.data || "User update failed")
        }
    }

    useEffect(() => {
        fetchUserDetails();
        fetchSkills();
    }, [userId])

    return <div className="flex flex-col h-screen">
        {/* Navbar */}
        < CommonNavbar isLoggedIn role="Candidates" />

        <div className="flex flex-1 overflow-hidden">

            {/* Main Layout */}
            <main className="flex-1 bg-neutral-950 text-white p-3 sm:p-6 overflow-y-auto">
                <h1 className="text-xl text-center sm:text-2xl font-bold mb-4 sm:mb-6 text-white-700">Upload Resume</h1>

                {/* Resume Upload */}
                <form onSubmit={handleSubmit}>
                    <div className="max-w-xl mx-auto mb-6">
                        <div className="bg-neutral-900 p-4 rounded-lg shadow-md">
                            <div className="text-center">
                                <FileText className="mx-auto mb-2 text-neutral-400" size={32} />
                                <h2 className="text-lg font-semibold mb-2">Upload Resume</h2>
                                <p className="text-neutral-400 mb-4 text-sm">
                                    Upload resume file to auto-fill your details
                                </p>

                                {/* File Upload */}
                                <div className="border-2 border-dashed border-neutral-600 rounded-lg p-4 mb-3 hover:border-neutral-500 transition">
                                    <input
                                        id="resume-upload"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleResumeChange}
                                        className="hidden" />
                                    <label
                                        htmlFor="resume-upload"
                                        className="cursor-pointer flex flex-col items-center justify-center">
                                        <div className="flex flex-col items-center">
                                            <Upload className="text-neutral-400 mb-1 mx-auto" size={24} />
                                            <span className="text-neutral-200 block text-sm">Click to upload resume</span>
                                            <span className="text-xs text-neutral-400 mt-1 block">
                                                PDF, DOC, DOCX
                                            </span>
                                        </div>
                                    </label>
                                </div>

                                {/* Upload Button */}
                                <button type="button" className="px-4 py-2 rounded-lg font-medium bg-purple-700 hover:bg-purple-800 text-white transition text-sm">
                                    Process Resume
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg">

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
                                    placeholder="Enter percentage"
                                    value={userData.bachelorPercentage}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
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
                                    placeholder="Enter percentage"
                                    value={userData.masterPercentage}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                            </div>

                            {/* Experience */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">Years of Experience</label>
                                <input
                                    type="number"
                                    name="yearsOfExperience"
                                    placeholder="Enter years"
                                    min="0"
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

                            {/* Submit */}
                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className="w-full bg-purple-700 hover:bg-purple-800 p-3 rounded font-medium transition text-white">
                                    + Add Details
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    </div>
};

export default Resume;
