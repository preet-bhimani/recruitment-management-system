import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import axios from "axios";
import { toast } from "react-toastify";

const AdminAddJobApplication = () => {

  const [isCollapsed, setIsCollapsed] = useState(false);

  const [formData, setFormData] = useState(
    {
      userId: "",
      joId: "",
      examResult: "",
      examDate: null,
      feedback: "",
      status: "",
      overallStatus: ""
    });

  const [errors, setErrors] = useState(
    {
      userId: "",
      joId: "",
      status: "",
    });

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { ...errors };

    if (!formData.userId.trim()) {
      newErrors.userId = "User ID cannot be empty.";
      hasError = true;
    }
    else {
      newErrors.userId = "";
    }

    if (!formData.joId.trim()) {
      newErrors.joId = "Job Opening ID cannot be empty.";
      hasError = true;
    }
    else {
      newErrors.joId = "";
    }

    if (!formData.status.trim()) {
      newErrors.status = "Status cannot be empty.";
      hasError = true;
    }
    else {
      newErrors.status = "";
    }

    setErrors(newErrors);
    if (hasError) return;

    // Endpoint Logic
    try {
      const res = await axios.post(`https://localhost:7119/api/JobApplication`, formData);
      toast.success(res.data.message || "Job application submitted successfully!");
    } 
    catch (err) {
      toast.error(err.response.data || "Failed to submit job application!");
    }
  }

  return <div className="flex flex-col h-screen">
    {/* Navbar */}
    <Navbar />

    {/* Main Layout */}
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Page Content */}
      <main className="flex-1 bg-neutral-950 text-white p-6 overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Add Job Application</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-6 rounded-lg shadow-lg">
          {/* User ID */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              User ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              placeholder="Enter User ID"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
            {errors.userId && (<p className="text-rose-500 text-sm mt-1">{errors.userId}</p>)}
          </div>

          {/* Job Opening ID */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Job Opening ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.joId}
              onChange={(e) => setFormData({ ...formData, joId: e.target.value })}
              placeholder="Enter Job Opening ID"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
            {errors.joId && (<p className="text-rose-500 text-sm mt-1">{errors.joId}</p>)}
          </div>

          {/* Exam Result */}
          <div>
            <label className="block mb-1 text-sm font-medium">Exam Result</label>
            <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
              value={formData.examResult}
              onChange={(e) => setFormData({ ...formData, examResult: e.target.value })}>
              <option value="" disabled>Select Exam Result</option>
              <option value="Pass">Pass</option>
              <option value="Fail">Fail</option>
            </select>
          </div>

          {/* Exam Date */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Exam Date
            </label>
            <input
              type="date"
              value={formData.examDate}
              onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
              name="exam date"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100" />
          </div>

          {/* Feedback */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Feedback
            </label>
            <textarea
              placeholder="Enter Feedback"
              value={formData.feedback}
              onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
              rows="4"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 resize-none">
            </textarea>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 text-sm font-medium">Status <span className="text-rose-500">*</span></label>
            <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <option value="" disabled>Select Status</option>
              <option value="Applied">Applied</option>
              <option value="Exam">Exam</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
              <option value="Hold">Hold</option>
            </select>
            {errors.status && (<p className="text-rose-500 text-sm mt-1">{errors.status}</p>)}
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 p-2 rounded font-medium">
              + Add Job Application
            </button>
          </div>
        </form>
      </main>
    </div>
  </div>;
};

export default AdminAddJobApplication;
