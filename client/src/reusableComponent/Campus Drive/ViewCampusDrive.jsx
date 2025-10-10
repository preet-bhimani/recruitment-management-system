import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewCampusDrive = () => {

    const navigate = useNavigate();

    const handleBack = () => navigate(-1);

    const campusdrive = {
        cdId: "9834B398-CCC4-57D0-CE34-19EEBF3GFD46",
        title: "Jr. Software Engineer",
        universityName: "RK University",
        DriveDate: "2025-07-16",
    };

    // If There are Missing Data
    const safe = (val) => {
        if (val === null || val === undefined) return "-";
        if (typeof val === "string" && val.trim() === "") return "-";
        return val;
    };

    return <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-6 flex justify-center items-start">

        {/* Back Button */}
        <button
            onClick={handleBack}
            aria-label="Go back"
            className="fixed top-4 left-4 z-50 bg-neutral-800 text-white p-2 rounded-full shadow-md hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
            <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Campus Drive Details */}
        <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-lg p-6 md:p-8 shadow-sm mt-12">
            <div className="grid grid-cols-1 gap-4 text-sm md:text-base text-neutral-300">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-md bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                        {campusdrive.title.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()}
                    </div>
                    <div className="text-lg font-medium text-neutral-100">{safe(campusdrive.title)}</div>
                </div>
                <div>
                    <div className="text-purple-400 text-xs font-medium">Drive ID</div>
                    <div className="text-neutral-200 break-all">{safe(campusdrive.cdId)}</div>
                </div>
                <div>
                    <div className="text-purple-400 text-xs font-medium">University</div>
                    <div className="text-neutral-200">{safe(campusdrive.universityName)}</div>
                </div>
                <div>
                    <div className="text-purple-400 text-xs font-medium">Drive Date</div>
                    <div className="text-neutral-200">{safe(campusdrive.DriveDate)}</div>
                </div>
            </div>
        </div>
    </div>
};

export default ViewCampusDrive;
