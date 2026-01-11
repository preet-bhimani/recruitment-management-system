import React, { useState } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";
import axios from 'axios';
import { toast } from 'react-toastify';
import CommonLoader from "../../components/CommonLoader";
import axiosInstance from "../../routes/axiosInstance";

const AddUserExcel = () => {

    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Handle File Change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // File Upload
    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const res = await axiosInstance.post(`User/import-excel`, formData,
                { headers: { "Content-Type": "multipart/form-data" } });

            setResult(res.data);
            setShowModal(true);
        }
        catch (err) {
            toast.error("Failed to upload Excel file!");
        }
        finally {
            setLoading(false);
        }
    };

    return <>
        {loading && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                <div className="bg-neutral-900 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                    <CommonLoader />
                    <span className="text-neutral-200 text-sm">
                        Adding Campus Drive
                    </span>
                </div>
            </div>
        )}
        {/* File Upload Card */}
        <div className="max-w-2xl mx-auto">
            <div className="bg-neutral-900 p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
                <div className="text-center">
                    <FileSpreadsheet className="mx-auto mb-3 sm:mb-4 text-neutral-400" size={40} />
                    <h2 className="text-lg sm:text-xl font-semibold mb-2">Upload Excel File</h2>

                    {/* File Upload Area */}
                    <div className="border-2 border-dashed border-neutral-600 rounded-lg p-6 sm:p-8 mb-4 hover:border-neutral-500 transition">
                        <input
                            id="file-upload"
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileChange}
                            className="hidden" />
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

                    {/* Show File Name */}
                    {file && (
                        <div className="mt-3 text-sm text-neutral-300 flex items-center justify-center gap-2 mb-2">
                            <span className="truncate max-w-xs">
                                {file.name}
                            </span>
                        </div>
                    )}

                    {/* Excel Result */}
                    {showModal && result && (
                        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                            <div className="bg-neutral-900 w-full max-w-3xl rounded-lg shadow-lg p-6 relative">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold">Excel Import Result</h2>

                                    <div className="flex items-center gap-3">

                                        {/* Copy Errors Button */}
                                        {result.errors.length > 0 && (
                                            <button
                                                onClick={() => {
                                                    const text = result.errors
                                                        .map(e => `Row ${e.row} | ${e.email || "-"} | ${e.reason}`)
                                                        .join("\n");
                                                    navigator.clipboard.writeText(text);
                                                }}
                                                className="text-sm px-3 py-1 rounded bg-purple-800 hover:bg-purple-700">
                                                Copy Errors
                                            </button>
                                        )}

                                        {/* Close Button */}
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="text-red-500 hover:text-red-400 text-2xl font-bold"
                                            title="Close">
                                        </button>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                                    <div className="bg-neutral-800 rounded p-3">
                                        <p className="text-neutral-400 text-sm">Total Rows</p>
                                        <p className="text-lg font-semibold">{result.totalRows}</p>
                                    </div>
                                    <div className="bg-neutral-800 rounded p-3">
                                        <p className="text-green-400 text-sm">Inserted</p>
                                        <p className="text-lg font-semibold text-green-400">{result.inserted}</p>
                                    </div>
                                    <div className="bg-neutral-800 rounded p-3">
                                        <p className="text-red-400 text-sm">Failed</p>
                                        <p className="text-lg font-semibold text-red-400">{result.errors.length}</p>
                                    </div>
                                </div>

                                {/* Error Table */}
                                {result.errors.length > 0 && (
                                    <div className="max-h-64 overflow-auto border border-neutral-700 rounded">
                                        <table className="w-full text-sm table-fixed">
                                            <thead className="bg-neutral-800 sticky top-0">
                                                <tr>
                                                    <th className="w-16 px-3 py-2 text-center text-neutral-300"> Row </th>
                                                    <th className="w-1/3 px-3 py-2 text-center text-neutral-300"> Email </th>
                                                    <th className="px-3 py-2 text-center text-neutral-300"> Reason </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.errors.map((err, idx) => (
                                                    <tr key={idx} className="border-t border-neutral-700 hover:bg-neutral-800">
                                                        <td className="px-3 py-2 font-mono">{err.row}</td>
                                                        <td className="px-3 py-2 truncate">{err.email || "-"}</td>
                                                        <td className="px-3 py-2 text-red-400">{err.reason}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Upload Button */}
                    <button className="px-4 sm:px-6 py-2 rounded-lg font-medium bg-purple-700 hover:bg-purple-600 text-white transition text-sm sm:text-base w-full sm:w-auto"
                        onClick={handleUpload}
                        disabled={loading}>
                        {loading ? "Uploading..." : "Upload File"}
                    </button>
                </div>
            </div>
        </div>
    </>;

};

export default AddUserExcel;
