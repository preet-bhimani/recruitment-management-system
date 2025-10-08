import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const AdminAddJobApplication = () => {

  const [isCollapsed, setIsCollapsed] = useState(false);

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

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-6 rounded-lg shadow-lg">
          {/* User ID */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              User ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter User ID"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
          </div>

          {/* Job Opening ID */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Job Opening ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Job Opening ID"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
          </div>

          {/* Test Result */}
          <div>
            <label className="block mb-1 text-sm font-medium">Test Result</label>
            <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700">
              <option value="" disabled>Select Test Result</option>
              <option value="Pass">Pass</option>
              <option value="Fail">Fail</option>
              <option value="Wait">Wait</option>
            </select>
          </div>

          {/* Exam Date */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Exam Date
            </label>
            <input
              type="date"
              name="exam date"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100" />
          </div>

          {/* Comment */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Comment
            </label>
            <textarea
              placeholder="Enter Comment"
              rows="4"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 resize-none">
            </textarea>
          </div>

          {/* Feedback */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Feedback
            </label>
            <textarea
              placeholder="Enter Feedback"
              rows="4"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 resize-none">
            </textarea>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 text-sm font-medium">Status</label>
            <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700">
              <option value="" disabled>Select Status</option>
              <option value="Applied">Applied</option>
              <option value="Exam">Exam</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Overall Status */}
          <div>
            <label className="block mb-1 text-sm font-medium">Overall Status <span className="text-rose-500">*</span></label>
            <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700">
              <option value="" disabled>Select Overall Status</option>
              <option value="Applied">Applied</option>
              <option value="Exam">Exam</option>
              <option value="Technical interview">Technical interview</option>
              <option value="HR interview">HR interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
              <option value="Hold">Hold</option>
            </select>
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="button"
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
