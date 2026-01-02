import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import CommonLoader from "../../components/CommonLoader";

const UpdateOfferLetter = ({ id }) => {

    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        userId: "",
        joId: "",
        jaId: "",
        joiningDate: "",
        endDate: null,
        bondTime: "",
        salary: "",
        templateType: "",
        offerLetterStatus: "",
        offerLetterFilePath: "",
    });

    // Errors
    const [errors, setErrors] = useState({
        joiningDate: "",
        bondTime: "",
        salary: "",
        templateType: "",
        offerLetterStatus: "",
    });

    // Pnly Allow to Change When offerLetterStatus is Sent
    const isEditable =
        formData.offerLetterStatus === "Sent" ||
        formData.offerLetterStatus === "";

    // Fetch Offer Letter Details
    const fetchOfferLetter = async () => {
        try {
            setLoading(true);
            const result = await axios.get(
                `https://localhost:7119/api/OfferLetter/details/${id}`
            );

            if (!result.data) {
                toast.error("Invalid Offer Letter ID");
                return;
            }

            const data = Array.isArray(result.data) ? result.data[0] : result.data;

            setFormData({
                userId: data.userId,
                joId: data.joId,
                jaId: data.jaId,
                joiningDate: data.joiningDate?.split("T")[0] || "",
                endDate: data.endDate?.split("T")[0] || null,
                bondTime: data.bondTime || "",
                salary: data.salary || "",
                templateType: data.templateType || "",
                offerLetterStatus: data.offerLetterStatus || "",
                offerLetterFilePath: data.offerLetterFilePath || "",
            });
        }
        catch (err) {
            toast.error("Failed to load offer letter details.");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOfferLetter();
    }, [id]);

    // Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = { ...errors };

        // Joiniing Date Validation
        if (formData.offerLetterStatus === "Sent") {
            if (!formData.joiningDate.trim()) {
                newErrors.joiningDate = "Joining Date is required";
                hasError = true;
            }
            else {
                newErrors.joiningDate = "";
            }

            // End Date Validation
            if (formData.templateType === "Internship" && !formData.endDate.trim()) {
                newErrors.endDate = "End Date is required";
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
        }

        // Common validation
        if (!formData.offerLetterStatus.trim()) {
            newErrors.offerLetterStatus = "Offer Letter Status is required";
            hasError = true;
        } else newErrors.offerLetterStatus = "";

        setErrors(newErrors);
        if (hasError) return;

        try {
            setSubmitLoading(true);
            const res = await axios.put(
                `https://localhost:7119/api/OfferLetter/update/${id}`,
                formData, {
                headers: { Authorization: `Bearer ${token}` }
            }
            );
            toast.success(res.data || "Offer letter updated successfully!");
            navigate(-1);
        }
        catch (err) {
            toast.error(err.response?.data || "Failed to update offer letter!");
        }
        finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950">
                <CommonLoader />
            </div>
        );
    }

    return <>
        {submitLoading && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                <div className="bg-neutral-900 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                    <CommonLoader />
                </div>
            </div>
        )}

        <form
            onSubmit={handleSubmit}
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg
                ${submitLoading ? "pointer-events-none opacity-70" : ""}`}>

            {/* Offer Letter Status */}
            <div>
                <label className="block mb-1 text-sm font-medium">
                    Offer Letter Status <span className="text-rose-500">*</span>
                </label>
                <select
                    value={formData.offerLetterStatus}
                    onChange={(e) => setFormData({ ...formData, offerLetterStatus: e.target.value })}
                    className="w-full p-2 rounded bg-neutral-800 border border-neutral-700">
                    <option value="" disabled>
                        Select Status
                    </option>
                    <option value="Sent">Update</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Hold">Hold</option>
                </select>
                {errors.offerLetterStatus && (<p className="text-rose-500 text-sm mt-1">{errors.offerLetterStatus}</p>)}
            </div>

            {/* Joining Date */}
            <div>
                <label className="block mb-1 text-sm font-medium">
                    Joining Date {isEditable && <span className="text-rose-500">*</span>}
                </label>
                <input
                    type="date"
                    disabled={!isEditable}
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className={`w-full p-2 rounded bg-neutral-800 border border-neutral-700 ${!isEditable ? "opacity-50 cursor-not-allowed" : ""}`} />
                {errors.joiningDate && (<p className="text-rose-500 text-sm mt-1">{errors.joiningDate}</p>)}
            </div>

            {/* End Date */}
            <div>
                <label className="block mb-1 text-sm font-medium">
                    End Date (Only for Internship)
                </label>
                <input
                    type="date"
                    disabled={!isEditable}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className={`w-full p-2 rounded bg-neutral-800 border border-neutral-700 ${!isEditable ? "opacity-50 cursor-not-allowed" : ""}`} />
            </div>

            {/* Bond Time */}
            <div>
                <label className="block mb-1 text-sm font-medium">
                    Bond Time {isEditable && <span className="text-rose-500">*</span>}
                </label>
                <input
                    type="text"
                    disabled={!isEditable}
                    placeholder="e.g. 6 months"
                    value={formData.bondTime}
                    onChange={(e) => setFormData({ ...formData, bondTime: e.target.value })}
                    className={`w-full p-2 rounded bg-neutral-800 border border-neutral-700 ${!isEditable ? "opacity-50 cursor-not-allowed" : ""}`} />
                {errors.bondTime && (<p className="text-rose-500 text-sm mt-1">{errors.bondTime}</p>)}
            </div>

            {/* Salary */}
            <div>
                <label className="block mb-1 text-sm font-medium">
                    Salary (INR) {isEditable && <span className="text-rose-500">*</span>}
                </label>
                <input
                    type="number"
                    disabled={!isEditable}
                    placeholder="Enter Salary"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className={`w-full p-2 rounded bg-neutral-800 border border-neutral-700 ${!isEditable ? "opacity-50 cursor-not-allowed" : ""}`} />
                {errors.salary && (<p className="text-rose-500 text-sm mt-1">{errors.salary}</p>)}
            </div>

            {/* Template Type */}
            <div>
                <label className="block mb-1 text-sm font-medium">
                    Template Type {isEditable && <span className="text-rose-500">*</span>}
                </label>
                <select
                    disabled={!isEditable}
                    value={formData.templateType}
                    onChange={(e) => setFormData({ ...formData, templateType: e.target.value })}
                    className={`w-full p-2 rounded bg-neutral-800 border border-neutral-700 ${!isEditable ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <option value="" disabled>
                        Select Template Type
                    </option>
                    <option value="Internship">Internship</option>
                    <option value="Job">Job</option>
                </select>
                {errors.templateType && (<p className="text-rose-500 text-sm mt-1">{errors.templateType}</p>)}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
                <button
                    type="submit"
                    disabled={submitLoading}
                    className={`w-full p-2 rounded font-medium transition
                        ${submitLoading
                            ? "bg-neutral-600 cursor-not-allowed"
                            : "bg-purple-600 hover:bg-purple-500"
                        }`}>
                    {submitLoading ? "Updating..." : "+ Update Offer Letter "}
                </button>
            </div>
        </form>
    </>;
};

export default UpdateOfferLetter;
