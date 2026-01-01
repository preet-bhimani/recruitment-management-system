import React, { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CommonLoader from "../../components/CommonLoader";

const UpdateJobOpening = ({ id }) => {

    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    // State for Job Opening Data
    const [jobsData, setJobsData] = useState({
        title: "",
        noOfOpening: "",
        requiredSkills: "",
        preferredSkills: "",
        location: "",
        experience: "",
        description: "",
        comment: "",
        qualification: "",
        jobType: "",
        status: ""
    });

    // Error Message
    const [errors, setErrors] = useState({
        title: "",
        noOfOpening: "",
        requiredSkills: "",
        location: "",
        experience: "",
        description: "",
        qualification: "",
        jobType: "",
        status: "",
    });

    const navigate = useNavigate();

    // Fetch Job Opening
    const fetchJobOpening = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`https://localhost:7119/api/JobOpening/${id}`)
            setJobsData(res.data || []);
        }
        catch (err) {
            toast.error("Failed to load job opening data!")
        }
        finally {
            setLoading(false);
        }
    }

    // Handle Update
    const handleupdate = async (e) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = { ...errors };

        // Validate Title
        if (!jobsData.title.trim()) {
            newErrors.title = "Title is required";
            hasError = true;
        }
        else {
            newErrors.title = "";
        }

        // Validate No Of Opening
        if (!jobsData.noOfOpening || jobsData.noOfOpening <= 0) {
            newErrors.noOfOpening = "No of opening must be greater than zero";
            hasError = true;
        }
        else {
            newErrors.noOfOpening = "";
        }

        // Validate Required Skills
        if (!jobsData.requiredSkills.trim()) {
            newErrors.requiredSkills = "Required skills are required";
            hasError = true;
        }
        else {
            newErrors.requiredSkills = "";
        }

        // Validate Location
        if (!jobsData.location.trim()) {
            newErrors.location = "Location is required";
            hasError = true;
        }
        else {
            newErrors.location = "";
        }

        // Validate Experience
        if (!jobsData.experience || jobsData.experience < 0) {
            newErrors.experience = "Experience must be non-negative";
            hasError = true;
        }
        else {
            newErrors.experience = "";
        }

        // Validate Description
        if (!jobsData.description.trim()) {
            newErrors.description = "Description is required";
            hasError = true;
        }
        else {
            newErrors.description = "";
        }

        // Validate Qualification
        if (!jobsData.qualification.trim()) {
            newErrors.qualification = "Qualification is required";
            hasError = true;
        }
        else {
            newErrors.qualification = "";
        }

        // Validate Job Type
        if (!jobsData.jobType.trim()) {
            newErrors.jobType = "Job type is required";
            hasError = true;
        }
        else {
            newErrors.jobType = "";
        }

        // Validate Status
        if (!jobsData.status.trim()) {
            newErrors.status = "Status is required";
            hasError = true;
        }
        else {
            newErrors.status = "";
        }

        setErrors(newErrors);
        if (hasError) return;

        // Fectch Data
        try {
            setSubmitLoading(true);
            const res = await axios.put(`https://localhost:7119/api/JobOpening/update/${id}`, jobsData)
            toast.success(res.data.message || "Job opening updated successfully!");
            navigate(-1);
        }
        catch (err) {
            toast.error(err.response?.data?.message || "Failed to update job opening!");
        }
        finally {
            setSubmitLoading(false);
        }
    }

    useEffect(() => {
        if (id) fetchJobOpening();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950">
                <CommonLoader />
            </div>
        );
    }

    return <>
        <div className="max-w-6xl mx-auto">

            {submitLoading && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                    <div className="bg-neutral-900 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                        <CommonLoader />
                        <span className="text-neutral-200 text-sm">
                            Job Opening
                        </span>
                    </div>
                </div>
            )}

            <form
                onSubmit={handleupdate}
                className={`grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg
                ${submitLoading ? "pointer-events-none opacity-70" : ""}`}>

                {/* Job Opening ID */}
                <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-neutral-300">
                        Job Opening ID
                    </label>
                    <input
                        type="text"
                        value={jobsData.joId}
                        disabled
                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-300 cursor-not-allowed" />
                </div>

                {/* Title */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={jobsData.title}
                        onChange={(e) => setJobsData({ ...jobsData, title: e.target.value })}
                        placeholder="Enter Title"
                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    {errors.title && (<p className="text-rose-500 text-sm mt-1">{errors.title}</p>)}
                </div>

                {/* No of Opening */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        No of Opening <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="number"
                        value={jobsData.noOfOpening}
                        onChange={(e) => setJobsData({ ...jobsData, noOfOpening: parseInt(e.target.value) })}
                        placeholder="Enter No of Opening"
                        min="1"
                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    {errors.noOfOpening && (<p className="text-rose-500 text-sm mt-1">{errors.noOfOpening}</p>)}
                </div>

                {/* Required Skills */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        Required Skills <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={jobsData.requiredSkills}
                        onChange={(e) => setJobsData({ ...jobsData, requiredSkills: e.target.value })}
                        placeholder="Enter Required Skills"
                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    {errors.requiredSkills && (<p className="text-rose-500 text-sm mt-1">{errors.requiredSkills}</p>)}
                </div>

                {/* Preferred Skills */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        Preferred Skills
                    </label>
                    <input
                        type="text"
                        value={jobsData.preferredSkills}
                        onChange={(e) => setJobsData({ ...jobsData, preferredSkills: e.target.value })}
                        placeholder="Enter Preferred Skills"
                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                </div>

                {/* Location */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Location <span className="text-rose-500">*</span></label>
                    <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
                        value={jobsData.location}
                        onChange={(e) => setJobsData({ ...jobsData, location: e.target.value })}>
                        <option value="" disabled>Select Location</option>
                        <option value="Säterinkatu">Säterinkatu</option>
                        <option value="Pori">Pori</option>
                        <option value="Seinäjoki">Seinäjoki</option>
                        <option value="Tampere">Tampere</option>
                        <option value="Turku">Turku</option>
                        <option value="Aalborg">Aalborg</option>
                        <option value="Aarhus">Aarhus</option>
                        <option value="Holte">Holte</option>
                        <option value="Göteborg">Göteborg</option>
                        <option value="Linköping">Linköping</option>
                        <option value="Västerås">Västerås</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bloomingdale IL Chicago">Bloomingdale IL Chicago</option>
                    </select>
                    {errors.location && (<p className="text-rose-500 text-sm mt-1">{errors.location}</p>)}
                </div>

                {/* Experience */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        Experience <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="number"
                        value={jobsData.experience}
                        onChange={(e) => setJobsData({ ...jobsData, experience: parseInt(e.target.value) })}
                        placeholder="Enter Experience"
                        min="0"
                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    {errors.experience && (<p className="text-rose-500 text-sm mt-1">{errors.experience}</p>)}
                </div>

                {/* Description */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        Description <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                        value={jobsData.description}
                        onChange={(e) => setJobsData({ ...jobsData, description: e.target.value })}
                        placeholder="Enter Description"
                        rows="4"
                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 resize-none">
                    </textarea>
                    {errors.description && (<p className="text-rose-500 text-sm mt-1">{errors.description}</p>)}
                </div>

                {/* Comment */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        Comment
                    </label>
                    <textarea
                        value={jobsData.comment}
                        onChange={(e) => setJobsData({ ...jobsData, comment: e.target.value })}
                        placeholder="Enter Comment"
                        rows="4"
                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 resize-none">
                    </textarea>
                </div>

                {/* Qualification */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        Qualification <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Qualification"
                        value={jobsData.qualification}
                        onChange={(e) => setJobsData({ ...jobsData, qualification: e.target.value })}
                        className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    {errors.qualification && (<p className="text-rose-500 text-sm mt-1">{errors.qualification}</p>)}
                </div>

                {/* Job Type */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        Job Type <span className="text-rose-500">*</span>
                    </label>
                    <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
                        value={jobsData.jobType}
                        onChange={(e) => setJobsData({ ...jobsData, jobType: e.target.value })}>
                        <option value="" disabled>Select Job Type</option>
                        <option value="Full time job">Full time job</option>
                        <option value="Internship">Internship</option>
                    </select>
                    {errors.jobType && (<p className="text-rose-500 text-sm mt-1">{errors.jobType}</p>)}
                </div>

                {/* Status */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Status</label>
                    <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
                        value={jobsData.status}
                        onChange={(e) => setJobsData({ ...jobsData, status: e.target.value })}>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Hold">Hold</option>
                    </select>
                    {errors.status && (<p className="text-rose-500 text-sm mt-1">{errors.status}</p>)}
                </div>

                {/* Submit */}
                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className={`w-full p-2 rounded font-medium transition
                            ${submitLoading
                                ? "bg-neutral-600 cursor-not-allowed"
                                : "bg-purple-600 hover:bg-purple-500"
                            }`}>
                        {submitLoading ? "Updating..." : "+ Update Job Opening"}
                    </button>
                </div>
            </form>
        </div>
    </>;
};

export default UpdateJobOpening;
