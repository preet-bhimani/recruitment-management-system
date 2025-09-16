import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../../components/Navbar";

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
        <h1 className="text-2xl font-bold mb-6 text-blue-400">Add Job Application</h1>

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

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-medium">
              + Add Job Application
            </button>
          </div>
        </form>
      </main>
    </div>
  </div>;
};

export default AdminAddJobApplication;
