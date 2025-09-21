import React, { useState } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

const AdminAddUserExcel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar fixed at top */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Layout */}
        <main className="flex-1 bg-neutral-950 text-white p-3 sm:p-6 overflow-y-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-blue-400">Add Users via Excel</h1>

          {/* File Upload Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-neutral-900 p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
              <div className="text-center">
                <FileSpreadsheet className="mx-auto mb-3 sm:mb-4 text-neutral-400" size={40} />
                <h2 className="text-lg sm:text-xl font-semibold mb-2">Upload Excel File</h2>
                <p className="text-neutral-400 mb-4 sm:mb-6 text-sm sm:text-base">
                  Select a CSV or Excel file to bulk add users
                </p>

                {/* File Upload Area */}
                <div className="border-2 border-dashed border-neutral-600 rounded-lg p-6 sm:p-8 mb-4 hover:border-neutral-500 transition">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"/>
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center">
                      <Upload className="text-neutral-400 mb-2 mx-auto" size={32} />
                      <span className="text-neutral-200 block text-sm sm:text-base">Click to browse files</span>
                      <span className="text-xs sm:text-sm text-neutral-400 mt-1 block">
                        Supported formats: CSV, Excel (.xlsx, .xls)
                      </span>
                    </div>
                  </label>
                </div>

                {/* Upload Button */}
                <button className="px-4 sm:px-6 py-2 rounded-lg font-medium bg-sky-700 hover:bg-sky-600 text-white transition text-sm sm:text-base w-full sm:w-auto">
                  Upload File
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminAddUserExcel;
