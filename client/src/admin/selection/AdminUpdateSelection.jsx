import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CommonLoader from "../../components/CommonLoader";
import axiosInstance from "../../routes/axiosInstance";

const AdminUpdateSelection = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [selection, setSelection] = useState({})

    // Fetch Selection by ID
    const fetchSelection = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`Selection/${id}`)
            setSelection(res.data);
        }
        catch (err) {
            toast.error(err.response.data || "Failed to load selection details!");
        }
        finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setSubmitLoading(true);
            const res = await axiosInstance.put(`Selection/update/${selection.selectionId}`, {
                selectionStatus: selection.selectionStatus
            })
            toast.success(res.data.message || "Selection updated successfully!");
            navigate(-1);
        }
        catch (err) {
            toast.error(err.response.data || "Failed to update selection!");
        }
        finally {
            setSubmitLoading(false);
        }
    };

    useEffect(() => {
        fetchSelection();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950">
                <CommonLoader />
            </div>
        );
    }

    return <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100">
        {/* Navbar */}
        <Navbar />

        <div className="flex flex-1 overflow-hidden">

            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Layout */}
            <main className="flex-1 bg-neutral-950 text-white p-6 overflow-y-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Update Selection</h1>
                </div>

                {submitLoading && (
                    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                        <div className="bg-neutral-900 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                            <CommonLoader />
                            <span className="text-neutral-200 text-sm">
                                Updating Selection
                            </span>
                        </div>
                    </div>
                )}

                <form
                    onSubmit={handleUpdate}
                    className={`grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg
                        ${submitLoading ? "pointer-events-none opacity-70" : ""}`}>

                    {/* Selection Id */}
                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm font-medium text-neutral-300">
                            Selection Id
                        </label>
                        <input
                            type="text"
                            value={selection.selectionId}
                            onChange={(e) => setSelection({ ...selection, selectionId: e.target.value })}
                            disabled
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-300 cursor-not-allowed" />
                    </div>

                    {/* Selection Status */}
                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm font-medium text-neutral-300">
                            Selection Status
                        </label>
                        <select
                            value={selection.selectionStatus}
                            onChange={(e) => setSelection({ ...selection, selectionStatus: e.target.value })}
                            className="w-full p-2 rounded bg-neutral-800 border border-neutral-600 text-neutral-300">
                            <option value="Selected" disabled>Selected</option>
                            <option value="Joined">Joined</option>
                            <option value="Not Joined">Not Joined</option>
                            <option value="Hold">Hold</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className={`w-full p-2 rounded font-medium transition
                                ${submitLoading
                                    ? "bg-neutral-600 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-500"
                                }`}>
                            {submitLoading ? "Updating..." : "+ Update Selection "}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    </div>;
};

export default AdminUpdateSelection;
