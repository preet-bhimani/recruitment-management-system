import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../Sidebar";

const AdminAddDocuments = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);

    const [document, setDocument] = useState({
        DLId: "1203M590-NOB8-94P5-QR78-21STUV3QWX86",
        AadharCard: "",
        PANCard: "",
        BankAccNo: "",
        BankIFSC: "",
        BankName: "",
        ExperienceLetter: "",
        Status: "",
    })

    return <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100">
        {/* Navbar fixed at top */}
        <Navbar />

        {/* Main wrapper */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Page Content */}
            <main className="flex-1 bg-neutral-950 text-white p-6 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-6 text-blue-400">Add Documents</h1>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-6 rounded-lg shadow-lg">
                    {/* Document List Id */}
                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm font-medium text-neutral-300">
                            Document List Id
                        </label>
                        <input
                            type="text"
                            defaultValue={document.DLId}
                            disabled
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-300 cursor-not-allowed" />
                    </div>

                    {/* Aadhar Card */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Aadhar Card <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="file"
                            className="w-full p-1.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-200
                                           file:h-8.5 file:px-3 file:rounded file:border-0 
                                         file:bg-neutral-600 file:text-white hover:file:bg-sky-800 cursor-pointer"/>
                    </div>

                    {/* PAN Card */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            PAN Card <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="file"
                            className="w-full p-1.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-200
                                           file:h-8.5 file:px-3 file:rounded file:border-0 
                                         file:bg-neutral-600 file:text-white hover:file:bg-sky-800 cursor-pointer"/>
                    </div>

                    {/* Bank Name */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Bank Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="Bank Name"
                            defaultValue={document.BankName}
                            placeholder="Enter Bank Name"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                    </div>

                    {/* Bank Acc No */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Bank Acc No <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="Bank Acc No"
                            defaultValue={document.BankAccNo}
                            placeholder="Enter Bank Acc No"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                    </div>

                    {/* Bank IFSC Code */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Bank IFSC Code <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="Bank IFSC Code"
                            defaultValue={document.BankIFSC}
                            placeholder="Enter Bank IFSC Code"
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-100 placeholder-neutral-400" />
                    </div>

                    {/* Experience Letter */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Experience Letter <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="file"
                            className="w-full p-1.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-200
                                           file:h-8.5 file:px-3 file:rounded file:border-0 
                                         file:bg-neutral-600 file:text-white hover:file:bg-sky-800 cursor-pointer"/>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Status</label>
                        <select className="w-full p-2 rounded bg-neutral-800 border border-neutral-700">
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2">
                        <button
                            type="button"
                            className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-medium">
                            Add Documents
                        </button>
                    </div>
                </form>
            </main>
        </div>
    </div>;
};

export default AdminAddDocuments;
