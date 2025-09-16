import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../../components/Navbar";

const AdminSentMailSelection = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const [sentMail, setSentMail] = useState({
        selectionId: "1203R590-HFB8-94B5-DJ78-21URDK3QLZ86",
        fullName: "Kush Vadodariya",
        title: " Jr. Data Analyst",
        email: "kush@gamil.com",
        startdate: "",
        enddate: "",
        phoneNumber: "9377382731",
        city: "Ahmedabad",
        templateType: "",
        bond: "",
        salary: "",
    })

    return <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100">
        {/* Navbar */}
        <Navbar />

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Page Content */}
            <main className="flex-1 bg-neutral-950 text-white p-6 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-6 text-blue-400">Sent Offer Letter</h1>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-6 rounded-lg shadow-lg">
                    {/* Selection Id */}
                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm font-medium text-neutral-300">
                            Selection Id
                        </label>
                        <input
                            type="text"
                            defaultValue={sentMail.selectionId}
                            disabled
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-300 cursor-not-allowed" />
                    </div>
                    {/* Full Name */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            defaultValue={sentMail.fullName}
                            placeholder="Enter full name"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={sentMail.email}
                            placeholder="Enter email"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="phoneNumber"
                            defaultValue={sentMail.phoneNumber}
                            placeholder="Enter phone number"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                    </div>

                    {/* City */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            City <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="city"
                            defaultValue={sentMail.city}
                            placeholder="Enter city"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Title <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            defaultValue={sentMail.title}
                            placeholder="Enter Title"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                    </div>

                    {/* Start Date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-neutral-200">
                            Start Date <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="date"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-200
                                           focus:outline-none focus:ring-2 focus:ring-sky-600"/>
                    </div>

                    {/* End Date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-neutral-200">
                            End Date
                        </label>
                        <input
                            type="date"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-200
                                           focus:outline-none focus:ring-2 focus:ring-sky-600"/>
                    </div>

                    {/* Bond Time */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Bond Time <span className="text-rose-500">*</span></label>
                        <input
                            type="number"
                            placeholder="Enter Bond Time"
                            min="0"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Salary */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Salary <span className="text-rose-500">*</span></label>
                        <input
                            type="number"
                            placeholder="Enter Salary"
                            min="0"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700" />
                    </div>

                    {/* Template Type */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Template Type <span className="text-rose-500">*</span>
                        </label>
                        <select
                            name="Template Type"
                            className="w-full p-2.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-100">
                            <option value="" disabled>Select Template Type</option>
                            <option value="Campus Drive">Internship</option>
                            <option value="Walk in drive">Job</option>
                            <option value="Recruitment Apps">Internship + Job</option>
                        </select>
                    </div>
                    {/* Submit */}
                    <div className="md:col-span-2">
                        <button
                            type="button"
                            className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-medium">
                            Sent Mail
                        </button>
                    </div>
                </form>
            </main>
        </div>
    </div>;
};

export default AdminSentMailSelection;
