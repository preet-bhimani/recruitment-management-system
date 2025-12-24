import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

function ViewWalkInDrive() {

    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();
    const handleBack = () => navigate(-1);

    const [walkInDrive, setWalkInDrive] = useState(null);

    // Fetch Walk In Drive Data
    const fetchWalkInDrive = async () => {
        try {
            const res = await axios.get(`https://localhost:7119/api/WalkInDrive/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setWalkInDrive(res.data || []);
        }
        catch (err) {
            toast.error("Failed to load Walk In Drive details!")
        }
    }

    useEffect(() => {
        fetchWalkInDrive();
    }, []);

    if (!walkInDrive) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading Walk In Drive Details...
            </div>
        );
    }

    // If There are Missing Data
    const safe = (val) => {
        if (val === null || val === undefined) return "-";
        if (typeof val === "string" && val.trim() === "") return "-";
        return val;
    };

    // IsActive Status Change
    const statusText = walkInDrive.isActive ? "Active" : "InActive";

    // Badge Color
    const statusStyle = (isActive) =>
        isActive === "Active"
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white";

    return <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-6 flex justify-center items-start">

        {/* Back Button */}
        <button
            onClick={handleBack}
            aria-label="Go back"
            className="fixed top-4 left-4 z-50 bg-neutral-800 text-white p-2 rounded-full shadow-md hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
            <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Walk In Drive Details */}
        <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-lg p-6 md:p-8 shadow-sm mt-12">

            {/* Status */}
            <div className="absolute top-4 right-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle(statusText)}`}>
                    {statusText}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm md:text-base text-neutral-300">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-md bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                        {safe(walkInDrive.title).split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                    </div>
                    <div className="text-lg font-medium text-neutral-100">{safe(walkInDrive.title)}</div>
                </div>

                <div>
                    <div className="text-purple-400 text-xs font-medium"> Walk In Drive ID </div>
                    <div className="text-neutral-200 break-all">{safe(walkInDrive.walkId)}</div>
                </div>

                <div>
                    <div className="text-purple-400 text-xs font-medium"> Location </div>
                    <div className="text-neutral-200">{safe(walkInDrive.location)}</div>
                </div>

                <div>
                    <div className="text-purple-400 text-xs font-medium"> Drive Date </div>
                    <div className="text-neutral-200">{safe(walkInDrive.driveDate)}</div>
                </div>
            </div>
        </div>
    </div>;
}

export default ViewWalkInDrive;
