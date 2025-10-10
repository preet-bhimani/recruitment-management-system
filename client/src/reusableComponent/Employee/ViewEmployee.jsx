import React from "react";
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewEmployee = () => {
    const navigate = useNavigate();

    const handleBack = () => navigate(-1);

    const employeeData = {
        empId: "8723A287-BBB3-46C9-BD23-08DDAE2FEC35",
        fullName: "Preet Bhimani",
        email: "preet@gmail.com",
        phone: "9377382731",
        city: "Rajkot",
        dob: "2003-05-13",
        salary: 50000,
        probationtime: "",
        role: "Sr. AI Engineer",
        department: "AI",
        joiningDate: "2024-11-01",
        isActive: "Active",
        photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
    };

    // When There are Missing Data
    const safe = (val) => {
        if (val === null || val === undefined || val === "") return "-";
        return val;
    };

    // DOB Formating
    const formattedDOB = (() => {
        const v = employeeData.dob;
        if (!v) return "-";
        try {
            const iso = new Date(v).toISOString().split("T")[0];
            return iso.replace(/-/g, "/");
        } catch {
            return safe(v);
        }
    })();

    // Joining Date Formating
    const formattedJoining = (() => {
        const v = employeeData.joiningDate;
        if (!v) return "-";
        try {
            const iso = new Date(v).toISOString().split("T")[0];
            return iso.replace(/-/g, "/");
        } catch {
            return safe(v);
        }
    })();

    return <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-6 flex justify-center items-start">

        {/* Back Button */}
        <button
            onClick={handleBack}
            aria-label="Go back"
            className="fixed top-4 left-4 z-50 bg-neutral-800 text-white p-2 rounded-full shadow-md hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
            <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-lg p-5 md:p-8 shadow-sm mt-12">

            {/* Photo and Other Details */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                    <div className="w-16 h-16 rounded-md bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 overflow-hidden">
                        {employeeData.photo ? (
                            <img
                                src={employeeData.photo}
                                alt={safe(employeeData.fullName)}
                                className="w-full h-full object-cover"/>
                        ) : (
                            <span>{employeeData.fullName.slice(0, 2).toUpperCase()}</span>
                        )}
                    </div>

                    <div className="min-w-0">
                        <h1 className="text-xl md:text-3xl font-extrabold leading-tight text-white truncate">
                            {safe(employeeData.fullName)}
                        </h1>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-neutral-400">
                            <span className="flex items-center gap-1">
                                <Mail size={14} className="text-purple-400" /> {safe(employeeData.email)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Phone size={14} className="text-purple-400" /> {safe(employeeData.phone)}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin size={14} className="text-purple-400" /> {safe(employeeData.city)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size={14} className="text-purple-400" /> {formattedDOB}
                            </span>
                        </div>
                        <div className="mt-3 h-0.5 w-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-400" />
                    </div>
                </div>

                <div className="w-full md:w-auto flex justify-center md:justify-end">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${employeeData.isActive === "Active" ? "bg-green-600" : "bg-red-600"}`}>
                        {safe(employeeData.isActive)}
                    </div>
                </div>
            </div>

            <div className="border-t border-neutral-800 my-5" />

            {/* Employee Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs md:text-sm text-neutral-400">
                <div>
                    <div className="text-purple-400 font-medium">Employee ID</div>
                    <div className="text-neutral-200 break-all">{safe(employeeData.empId)}</div>
                </div>
                <div>
                    <div className="text-purple-400 font-medium">Role</div>
                    <div className="text-neutral-200">{safe(employeeData.role)}</div>
                </div>
                <div>
                    <div className="text-purple-400 font-medium">Department</div>
                    <div className="text-neutral-200">{safe(employeeData.department)}</div>
                </div>
                <div>
                    <div className="text-purple-400 font-medium">Joining Date</div>
                    <div className="text-neutral-200">{formattedJoining}</div>
                </div>
                <div>
                    <div className="text-purple-400 font-medium">Salary</div>
                    <div className="text-neutral-200">{safe(employeeData.salary)}</div>
                </div>
                <div>
                    <div className="text-purple-400 font-medium">Probation Time</div>
                    <div className="text-neutral-200">{safe(employeeData.probationtime)}</div>
                </div>
            </div>
        </div>
    </div>;
};

export default ViewEmployee;
