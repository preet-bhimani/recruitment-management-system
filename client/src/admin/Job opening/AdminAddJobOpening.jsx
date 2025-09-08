import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../Sidebar";

const AdminAddJobOpening = () => {

  const [isCollapsed, setIsCollapsed] = useState(false);

  return <div className="flex flex-col h-screen">
    {/* Navbar */}
    <Navbar />

    {/* Main Layout */}
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Page Content */}
      <main className="flex-1 bg-neutral-900 text-white p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 text-blue-400">Add New User</h1>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-950 p-6 rounded-lg shadow-lg">
          {/* Title */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Title"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
          </div>

          {/* No of Opening */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              No of Opening <span className="text-rose-500">*</span>
            </label>
            <input
              type="text area"
              placeholder="Enter No of Opening"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
          </div>

          {/* Required Skills */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Required Skills <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Required Skills"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
          </div>

          {/* Preferred Skills */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Preferred Skills <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Preferred Skills"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Location <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Location"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
          </div>

          {/* Experience */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Experience <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Experience"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              placeholder="Enter Description"
              rows="4"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 resize-none"
            ></textarea>
          </div>

          {/* Comment */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Comment <span className="text-rose-500">*</span>
            </label>
            <textarea
              placeholder="Enter Comment"
              rows="4"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 resize-none"
            ></textarea>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 text-sm font-medium">Status</label>
            <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700">
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Hold">Hold</option>
            </select>
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-medium">
              + Add Job Opening
            </button>
          </div>
        </form>
      </main>
    </div>

  </div>;
};

export default AdminAddJobOpening;
