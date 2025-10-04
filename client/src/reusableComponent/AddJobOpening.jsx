import React from "react";

const AddJobOpening = () => {
    return <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-6 rounded-lg shadow-lg">
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
                type="number"
                placeholder="Enter No of Opening"
                min="1"
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
                Preferred Skills
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
                type="number"
                placeholder="Enter Experience"
                min="0"
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
                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 resize-none">
            </textarea>
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

        {/* Qualification */}
        <div>
            <label className="block mb-1 text-sm font-medium">
                Qualification <span className="text-rose-500">*</span>
            </label>
            <input
                type="text"
                placeholder="Enter Qualification"
                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
        </div>

        {/* Job Type */}
        <div>
            <label className="block mb-1 text-sm font-medium">
                Job Type <span className="text-rose-500">*</span>
            </label>
            <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700">
                <option value="Full time Job">Full time Job</option>
                <option value="Internship">Internship</option>
            </select>
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
                className="w-full bg-purple-600 hover:bg-purple-500 p-2 rounded font-medium">
                + Add Job Opening
            </button>
        </div>
    </form>
};

export default AddJobOpening;
