import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SentOfferLetter = ({ id }) => {

    const navigate = useNavigate();

    // Form Data
    const [formData, setFormData] = useState({
        userId: "",
        joId: "",
        jaId: id || "",
        joiningDate: "",
        endDate: "",
        bondTime: "",
        salary: "",
        templateType: "",
        offerLetterStatus: "Sent",
        offerLetterFilePath: "temp.pdf",
    });

    // Errors
    const [errors, setErrors] = useState({
        joiningDate: "",
        bondTime: "",
        salary: "",
        templateType: "",
    });

    // Fetch UserId, JOId using JAId
    const fetchCandidateIds = async () => {
        try {
            const res = await axios.get(`https://localhost:7119/api/OfferLetter/${id}`);
            if (res.data) {
                const data = Array.isArray(res.data) ? res.data[0] : res.data;
                setFormData((prev) => ({
                    ...prev,
                    userId: data.userId,
                    joId: data.joId,
                    jaId: data.jaId,
                }));
            }
        }
        catch (error) {
            toast.error("Failed to load candidate details.");
        }
    };

    useEffect(() => {
        fetchCandidateIds();
    }, [id]);

    // Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = { ...errors };

        // Joining Date Validation
        if (!formData.joiningDate.trim()) {
            newErrors.joiningDate = "Joining Date is required";
            hasError = true;
        }
        else {
            newErrors.joiningDate = "";
        }

        // End Date Validation
        if (formData.templateType === "Internship" && !formData.endDate.trim()) {
            newErrors.endDate = "End Date is required for internship";
            hasError = true;
        }
        else {
            newErrors.endDate = "";
        }

        // Bond Time Validation
        if (!formData.bondTime.trim()) {
            newErrors.bondTime = "Bond Time is required";
            hasError = true;
        }
        else {
            newErrors.bondTime = "";
        }

        // Salary Validation
        if (!formData.salary || formData.salary <= 0) {
            newErrors.salary = "Salary must be greater than 0";
            hasError = true;
        }
        else {
            newErrors.salary = "";
        }

        // Template Type Validation
        if (!formData.templateType.trim()) {
            newErrors.templateType = "Template Type is required";
            hasError = true;
        }
        else {
            newErrors.templateType = "";
        }

        setErrors(newErrors);
        if (hasError) return;

        try {
            const res = await axios.post(`https://localhost:7119/api/OfferLetter/generate`, formData);

            toast.success(res.data.message || "Offer letter generated and sent successfully!");
            navigate(-1);
        }
        catch (error) {
            toast.error(error.response?.data?.message || "Failed to generate offer letter!");
        }
    };

    return <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-6 rounded-lg shadow-lg text-neutral-100">
        {/* Joining Date */}
        <div>
            <label className="block mb-1 text-sm font-medium">
                Joining Date <span className="text-rose-500">*</span>
            </label>
            <input
                type="date"
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"/>
            {errors.joiningDate && <p className="text-rose-500 text-sm mt-1">{errors.joiningDate}</p>}
        </div>

        {/* End Date */}
        <div>
            <label className="block mb-1 text-sm font-medium">
                End Date (Only for Internship)
            </label>
            <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
        </div>

        {/* Bond Time */}
        <div>
            <label className="block mb-1 text-sm font-medium">
                Bond Time <span className="text-rose-500">*</span>
            </label>
            <input
                type="text"
                placeholder="e.g. 6 months"
                value={formData.bondTime}
                onChange={(e) => setFormData({ ...formData, bondTime: e.target.value })}
                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
            {errors.bondTime && <p className="text-rose-500 text-sm mt-1">{errors.bondTime}</p>}
        </div>

        {/* Salary */}
        <div>
            <label className="block mb-1 text-sm font-medium">
                Salary (INR) <span className="text-rose-500">*</span>
            </label>
            <input
                type="number"
                placeholder="Enter Salary"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
            {errors.salary && <p className="text-rose-500 text-sm mt-1">{errors.salary}</p>}
        </div>

        {/* Template Type */}
        <div>
            <label className="block mb-1 text-sm font-medium">
                Template Type <span className="text-rose-500">*</span>
            </label>
            <select
                value={formData.templateType}
                onChange={(e) => setFormData({ ...formData, templateType: e.target.value })}
                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700">
                <option value="" disabled>Select Template Type</option>
                <option value="Internship">Internship</option>
                <option value="Job">Job</option>
            </select>
            {errors.templateType && <p className="text-rose-500 text-sm mt-1">{errors.templateType}</p>}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
            <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 p-2 rounded font-medium">
                + Generate and Send Offer Letter
            </button>
        </div>
    </form>;
};

export default SentOfferLetter;
