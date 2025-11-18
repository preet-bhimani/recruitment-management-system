import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdminUpdateSelection = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const [selection, setSelection] = useState({
        selectionId: "1203R590-HFB8-94B5-DJ78-21URDK3QLZ86",
        selectionStatus: "Selected",
    })

    // Fetch Selection by ID
    const fetchSelection = async () => {
        try {
            const res = await axios.get(`https://localhost:7119/api/Selection/${id}`);
            setSelection(res.data);
        }
        catch (err) {
            toast.error(err.response.data || "Failed to load selection details!");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`https://localhost:7119/api/Selection/update/${selection.selectionId}`, {
                selectionStatus: selection.selectionStatus
            });
            toast.success(res.data.message || "Selection updated successfully!");
            navigate(-1);
        }
        catch (err) {
            toast.error(err.response.data || "Failed to update selection!");
        }
    };

    useEffect(() => {
        fetchSelection();
    }, []);


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

                <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900 p-6 rounded-lg shadow-lg">
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
                            className="w-full bg-purple-600 hover:bg-purple-500 p-2 rounded font-medium">
                            Update Selection Or Sent Mail
                        </button>
                    </div>
                </form>
            </main>
        </div>
    </div>;
};

export default AdminUpdateSelection;
