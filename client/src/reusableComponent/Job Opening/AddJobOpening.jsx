import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddJobOpening = () => {

    // Form Data
    const [formData, setFormData] = useState({
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
        status: "Open"
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

    // Handle Change
    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = { ...errors };

        // Validate Title
        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
            hasError = true;
        }
        else {
            newErrors.title = "";
        }

        // Validate No Of Opening
        if (!formData.noOfOpening || formData.noOfOpening <= 0) {
            newErrors.noOfOpening = "No of opening must be greater than zero";
            hasError = true;
        }
        else {
            newErrors.noOfOpening = "";
        }

        // Validate Required Skills
        if (!formData.requiredSkills.trim()) {
            newErrors.requiredSkills = "Required skills are required";
            hasError = true;
        }
        else {
            newErrors.requiredSkills = "";
        }

        // Validate Location
        if (!formData.location.trim()) {
            newErrors.location = "Location is required";
            hasError = true;
        }
        else {
            newErrors.location = "";
        }

        // Validate Experience
        if (!formData.experience || formData.experience < 0) {
            newErrors.experience = "Experience must be non-negative";
            hasError = true;
        }
        else {
            newErrors.experience = "";
        }

        // Validate Description
        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
            hasError = true;
        }
        else {
            newErrors.description = "";
        }

        // Validate Qualification
        if (!formData.qualification.trim()) {
            newErrors.qualification = "Qualification is required";
            hasError = true;
        }
        else {
            newErrors.qualification = "";
        }

        // Validate Job Type
        if (!formData.jobType.trim()) {
            newErrors.jobType = "Job type is required";
            hasError = true;
        }
        else {
            newErrors.jobType = "";
        }

        // Validate Status
        if (!formData.status.trim()) {
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
            const res = await axios.post(`https://localhost:7119/api/JobOpening`, formData)
            toast.success(res.data.message || "Job opening added successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add job opening!");
        }
    }

    return <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-6 rounded-lg shadow-lg">
        {/* Title */}
        <div>
            <label className="block mb-1 text-sm font-medium">
                Title <span className="text-rose-500">*</span>
            </label>
            <input
                type="text"
                placeholder="Enter Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                placeholder="Enter No of Opening"
                value={formData.noOfOpening}
                onChange={(e) => setFormData({ ...formData, noOfOpening: parseInt(e.target.value) })}
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
                placeholder="Enter Required Skills"
                value={formData.requiredSkills}
                onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
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
                placeholder="Enter Preferred Skills"
                value={formData.preferredSkills}
                onChange={(e) => setFormData({ ...formData, preferredSkills: e.target.value })}
                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
        </div>

        {/* Location */}
        <div>
            <label className="block mb-1 text-sm font-medium">Location <span className="text-rose-500">*</span></label>
            <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}>
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
                placeholder="Enter Experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
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
                placeholder="Enter Description"
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                placeholder="Enter Comment"
                rows="4"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
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
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
            {errors.qualification && (<p className="text-rose-500 text-sm mt-1">{errors.qualification}</p>)}
        </div>

        {/* Job Type */}
        <div>
            <label className="block mb-1 text-sm font-medium">
                Job Type <span className="text-rose-500">*</span>
            </label>
            <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}>
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
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Hold">Hold</option>
            </select>
            {errors.status && (<p className="text-rose-500 text-sm mt-1">{errors.status}</p>)}
        </div >

        {/* Submit */}
        < div className="md:col-span-2" >
            <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 p-2 rounded font-medium">
                + Add Job Opening
            </button>
        </div >
    </form >
};

export default AddJobOpening;
