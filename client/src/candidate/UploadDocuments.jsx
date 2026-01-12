import React, { useEffect, useState } from "react";
import CommonNavbar from "../components/CommonNavbar";
import Footer from "../components/Footer";
import { Upload, CreditCard, Building, Hash } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../admin/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import CommonLoader from "../components/CommonLoader";
import axiosInstance from "../routes/axiosInstance";

const UploadDocuments = () => {

  const { jaId } = useParams();
  const navigate = useNavigate();
  const [jaIdFinal, setJaIdFinal] = useState(jaId || "");
  const { userId, role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    userId: "",
    joId: "",
    bankName: "",
    bankAccNo: "",
    bankIFSC: "",
    aadharFile: null,
    panFile: null,
    expFile: null
  });

  // Error Message
  const [errors, setErrors] = useState({
    bankName: "",
    bankAccNo: "",
    bankIFSC: "",
    aadharFile: "",
    panFile: ""
  });

  // Fetch Data if Already Exists
  const fetchExistingData = async (finalJAId) => {
    if (!finalJAId) {
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.get(`DocumentList/${finalJAId}`)

      if (res.data) {
        setFormData((prev) => ({
          ...prev,
          userId: res.data.userId || prev.userId,
          joId: res.data.joId || prev.joId,
          bankName: res.data.bankName || "",
          bankAccNo: res.data.bankAccNo || "",
          bankIFSC: res.data.bankIFSC || "",
          aadharFile: res.data.aadharCard ? { name: res.data.aadharCard } : null,
          panFile: res.data.panCard ? { name: res.data.panCard } : null,
          expFile: res.data.experienceLetter ? { name: res.data.experienceLetter } : null,
        }));
      }
    }
    catch (err) {
      toast.error(err.response?.data || "Somthing Went wrong!");
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!role) return;

    // Ftech Existing Data Based on Role
    const runFetch = async () => {

      if (!jaId && role === "Candidate") {
        try {
          const pendingRes = await axios.get(`Candidate/pending`)

          if (pendingRes.data?.length > 0) {
            const first = pendingRes.data[0];
            setJaIdFinal(first.jaId);
            setFormData((prev) => ({
              ...prev,
              joId: first.joId,
              userId: first.userId,
            }));

            await fetchExistingData(first.jaId);
          }
        } catch (err) {
          toast.error(err.response?.data || "Somthing Went Wrong! ");
        }
      }

      else if (jaId) {
        await fetchExistingData(jaId);
      }

      // If no JAId Found
      else {
        toast.error("No JAId found to fetch documents!");
      }
    };

    runFetch();
  }, [jaId, role]);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { ...errors };

    if (!formData.bankName.trim()) {
      newErrors.bankName = "Bank Name is required.";
      hasError = true;
    }
    else {
      newErrors.bankName = "";
    }

    if (!formData.bankAccNo.trim()) {
      newErrors.bankAccNo = "Account Number is required.";
      hasError = true;
    }
    else {
      newErrors.bankAccNo = "";
    }

    if (!formData.bankIFSC.trim()) {
      newErrors.bankIFSC = "IFSC Code is required.";
      hasError = true;
    }
    else {
      newErrors.bankIFSC = "";
    }

    const hasOldAadhar = formData.aadharFile && formData.aadharFile.name && !(formData.aadharFile instanceof File);
    const hasOldPAN = formData.panFile && formData.panFile.name && !(formData.panFile instanceof File);

    if ((!formData.aadharFile || !(formData.aadharFile instanceof File)) && !hasOldAadhar) {
      newErrors.aadharFile = "Aadhar Card is frontend required.";
      hasError = true;
    }

    if ((!formData.panFile || !(formData.panFile instanceof File)) && !hasOldPAN) {
      newErrors.panFile = "PAN Card is frontend required.";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    // FormData Logic
    const data = new FormData();
    data.append("UserId", userId);
    data.append("JAId", jaIdFinal);
    data.append("BankAccNo", formData.bankAccNo);
    data.append("BankIFSC", formData.bankIFSC);
    data.append("BankName", formData.bankName);

    if (formData.aadharFile instanceof File)
      data.append("AadharFile", formData.aadharFile);
    if (formData.panFile instanceof File)
      data.append("PANFile", formData.panFile);
    if (formData.expFile instanceof File)
      data.append("ExperienceFile", formData.expFile);

    try {
      setSubmitLoading(true);
      const res = await axiosInstance.post(`DocumentList`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })

      toast.success("Documents uploaded successfully!");
      navigate(-1);

    }
    catch (err) {
      toast.error(err.response?.data || "Failed to upload documents!");
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

  return <div className="min-h-screen flex flex-col bg-neutral-950">

    {/* Navbar */}
    {role === "Admin" ? (
      <Navbar />
    ) : (
      <CommonNavbar hasPendingDocuments={true} />
    )}

    {/* Main Layout */}
    <main className="flex-1 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {role === "Admin" ? "Upload Candidate Documents" : "Upload Your Documents"}
          </h1>
        </div>

        {submitLoading && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="bg-neutral-900 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
              <CommonLoader />
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={`space-y-6 ${submitLoading ? "pointer-events-none opacity-70" : ""}`}>

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
                    accept=".pdf"
                    className="hidden"
                    id="aadharCard"
                    onChange={e => setFormData({ ...formData, aadharFile: e.target.files[0] })} />
                  <label htmlFor="aadharCard" className="cursor-pointer block">
                    <Upload className="w-5 h-5 text-neutral-400 mx-auto mb-2" />
                    <p className="text-xs text-neutral-300 mb-1">Click to upload</p>
                    <p className="text-xs text-neutral-500">PDF Only</p>
                  </label>
                </div>
                {formData.aadharFile instanceof File && (<p className="text-xs text-green-400 mt-1">{formData.aadharFile.name}</p>)}
                {errors.aadharFile && (<p className="text-rose-500 text-sm mt-1">{errors.aadharFile}</p>)}
              </div>

              {/* PAN Card */}
              <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                <h3 className="text-sm font-medium text-white mb-3">PAN Card <span className="text-rose-500">*</span></h3>
                <div className="border-2 border-dashed border-neutral-600 rounded-lg p-4 text-center hover:border-neutral-500 transition">
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    id="panCard"
                    onChange={e => setFormData({ ...formData, panFile: e.target.files[0] })} />
                  <label htmlFor="panCard" className="cursor-pointer block">
                    <Upload className="w-5 h-5 text-neutral-400 mx-auto mb-2" />
                    <p className="text-xs text-neutral-300 mb-1">Click to upload</p>
                    <p className="text-xs text-neutral-500">PDF Only</p>
                  </label>
                </div>
                {formData.panFile instanceof File && (<p className="text-xs text-green-400 mt-1">{formData.panFile.name}</p>)}
                {errors.panFile && (<p className="text-rose-500 text-sm mt-1">{errors.panFile}</p>)}
              </div>

              {/* Experience Letter */}
              <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                <h3 className="text-sm font-medium text-white mb-3">Experience Letter</h3>
                <div className="border-2 border-dashed border-neutral-600 rounded-lg p-4 text-center hover:border-neutral-500 transition">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="experienceLetter"
                    onChange={e => setFormData({ ...formData, expFile: e.target.files[0] })} />
                  <label htmlFor="experienceLetter" className="cursor-pointer block">
                    <Upload className="w-5 h-5 text-neutral-400 mx-auto mb-2" />
                    <p className="text-xs text-neutral-300 mb-1">Click to upload</p>
                    <p className="text-xs text-neutral-500">PDF, DOC, DOCX</p>
                  </label>
                </div>
                {formData.expFile instanceof File && (<p className="text-xs text-green-400 mt-1">{formData.expFile.name}</p>)}
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
                  value={formData.bankName}
                  onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="Enter Bank Name"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-300" />
                {errors.bankName && (<p className="text-rose-500 text-sm mt-1">{errors.bankName}</p>)}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  <CreditCard className="w-4 h-4 inline mr-1" />
                  Account Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.bankAccNo}
                  onChange={e => setFormData({ ...formData, bankAccNo: e.target.value })}
                  placeholder="Enter Account Number"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-300" />
                {errors.bankAccNo && (<p className="text-rose-500 text-sm mt-1">{errors.bankAccNo}</p>)}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  <Hash className="w-4 h-4 inline mr-1" />
                  IFSC Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.bankIFSC}
                  onChange={e => setFormData({ ...formData, bankIFSC: e.target.value })}
                  placeholder="Enter IFSC Code"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-300" />
                {errors.bankIFSC && (<p className="text-rose-500 text-sm mt-1">{errors.bankIFSC}</p>)}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-neutral-900 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-xs text-neutral-400">
                <p>• All documents should be clear and readable</p>
                <p>• Maximum file size: 5MB for Aadhar & PAN, 10MB for Experience</p>
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className={`px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium transition
                  ${submitLoading
                    ? "bg-neutral-600 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-500"
                  }`}>
                {submitLoading ? "Adding..." : "+ Add Documents "}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>

    {/* Footer */}
    <Footer />
  </div>;
};

export default UploadDocuments;
