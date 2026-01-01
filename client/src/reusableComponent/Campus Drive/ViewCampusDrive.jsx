import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CommonLoader from "../../components/CommonLoader";

const ViewCampusDrive = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    const handleBack = () => navigate(-1);

    const [campusdrive, setCampusDrive] = useState(null);

    // If There are Missing Data
    const safe = (val) => {
        if (val === null || val === undefined) return "-";
        if (typeof val === "string" && val.trim() === "") return "-";
        return val;
    };

    // Fetch Campus Drive Data
    const fetchCampusDrive = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`https://localhost:7119/api/CampusDrive/${id}`)
            setCampusDrive(res.data || []);
        }
        catch (err) {
            toast.error("Failed to load Campus Drive details!")
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCampusDrive();
    }, []);

    // Loding
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950">
                <CommonLoader />
            </div>
        );
    }

    // If Campus Drive is Not Found
    if (!campusdrive) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Campus Drive not found
            </div>
        );
    }

    // IsActive Status Change
    const statusText = campusdrive.isActive ? "Active" : "InActive";

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

        {/* Campus Drive Details */}
        <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-lg p-6 md:p-8 shadow-sm mt-12">
            {/* Status */}
            <div className="absolute top-5 right-5">
                <div className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide ${statusStyle(statusText)}`}>{statusText}</div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm md:text-base text-neutral-300">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-md bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                        {campusdrive.title.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()}
                    </div>
                    <div className="text-lg font-medium text-neutral-100">{safe(campusdrive.title)}</div>
                </div>
                <div>
                    <div className="text-purple-400 text-xs font-medium">Drive ID</div>
                    <div className="text-neutral-200 break-all">{safe(campusdrive.cdid)}</div>
                </div>
                <div>
                    <div className="text-purple-400 text-xs font-medium">University</div>
                    <div className="text-neutral-200">{safe(campusdrive.universityName)}</div>
                </div>
                <div>
                    <div className="text-purple-400 text-xs font-medium">Drive Date</div>
                    <div className="text-neutral-200">{safe(campusdrive.driveDate)}</div>
                </div>
            </div>
        </div>
    </div>
};

export default ViewCampusDrive;
