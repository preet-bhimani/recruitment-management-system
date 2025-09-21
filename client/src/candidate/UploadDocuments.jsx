import React from "react";
import CommonNavbar from "../components/CommonNavbar";
import Footer from "../components/Footer";
import { Upload, CreditCard, Building, Hash } from "lucide-react";

const UploadDocuments = () => {
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950">
      {/* Navbar */}
      <CommonNavbar isLoggedIn hasSelectedApplication />

      {/* Main Layout */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Upload Documents</h1>
            <p className="text-neutral-400">Please upload the required documents</p>
          </div>

          <div className="space-y-6">
            
            {/* Document Uploads */}
            <div className="bg-neutral-900 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Required Documents</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Aadhar Card */}
                <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                  <h3 className="text-sm font-medium text-white mb-3">Aadhar Card <span className="text-rose-500">*</span></h3>
                  <div className="border-2 border-dashed border-neutral-600 rounded-lg p-4 text-center hover:border-neutral-500 transition">
                    <input
                      type="file"
                      id="aadharCard"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"/>
                    <label htmlFor="aadharCard" className="cursor-pointer block">
                      <Upload className="w-5 h-5 text-neutral-400 mx-auto mb-2" />
                      <p className="text-xs text-neutral-300 mb-1">Click to upload</p>
                      <p className="text-xs text-neutral-500">PDF, JPG, PNG</p>
                    </label>
                  </div>
                </div>

                {/* PAN Card */}
                <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                  <h3 className="text-sm font-medium text-white mb-3">PAN Card <span className="text-rose-500">*</span></h3>
                  <div className="border-2 border-dashed border-neutral-600 rounded-lg p-4 text-center hover:border-neutral-500 transition">
                    <input
                      type="file"
                      id="panCard"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"/>
                    <label htmlFor="panCard" className="cursor-pointer block">
                      <Upload className="w-5 h-5 text-neutral-400 mx-auto mb-2" />
                      <p className="text-xs text-neutral-300 mb-1">Click to upload</p>
                      <p className="text-xs text-neutral-500">PDF, JPG, PNG</p>
                    </label>
                  </div>
                </div>

                {/* Experience Letter */}
                <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                  <h3 className="text-sm font-medium text-white mb-3">Experience Letter</h3>
                  <div className="border-2 border-dashed border-neutral-600 rounded-lg p-4 text-center hover:border-neutral-500 transition">
                    <input
                      type="file"
                      id="experienceLetter"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"/>
                    <label htmlFor="experienceLetter" className="cursor-pointer block">
                      <Upload className="w-5 h-5 text-neutral-400 mx-auto mb-2" />
                      <p className="text-xs text-neutral-300 mb-1">Click to upload</p>
                      <p className="text-xs text-neutral-500">PDF, JPG, PNG</p>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-neutral-900 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Bank Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    <Building className="w-4 h-4 inline mr-1" />
                    Bank Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Bank Name"
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    <CreditCard className="w-4 h-4 inline mr-1" />
                    Account Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Account Number"
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    <Hash className="w-4 h-4 inline mr-1" />
                    IFSC Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter IFSC Code"
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"/>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-neutral-900 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="text-xs text-neutral-400">
                  <p>• All documents should be clear and readable</p>
                  <p>• Maximum file size: 5MB per document</p>
                </div>
                
                <button className="w-full sm:w-auto px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium transition">
                  Submit Documents
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UploadDocuments;
