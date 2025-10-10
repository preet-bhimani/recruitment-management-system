import React, { useState, useMemo, useEffect } from "react";
import { Eye, Edit, Trash2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CommonPagination, { paginate } from "../CommonPagination";

const Employee = ({ role = "admin" }) => {

    const navigate = useNavigate();

    const employee = [
        {
            empId: "8723A287-BBB3-46C9-BD23-08DDAE2FEC35",
            fullName: "Preet Bhimani",
            email: "preet@gmail.com",
            phone: "9377382731",
            city: "Rajkot",
            dob: "2003-05-13",
            role: "Sr. AI Engineer",
            department: "AI",
            joiningDate: "2024-11-01",
            isActive: "Active",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
        {
            empId: "9CF256C4-7ECA-4469-8CCE-08DD70ACE5C1",
            fullName: "Umang Paneri",
            email: "umang@gmail.com",
            phone: "9273899119",
            city: "Vadodara",
            dob: "2003-12-21",
            role: "Jr. Software Developer",
            department: "Engineering",
            joiningDate: "2025-01-15",
            isActive: "Active",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
        {
            empId: "4091FDD1-2D1F-44F5-00BB-08DDB922600D",
            fullName: "Visva Antala",
            email: "visva@gmail.com",
            phone: "9102938270",
            city: "Surat",
            dob: "2003-03-15",
            role: "HR",
            department: "HR",
            joiningDate: "2023-07-01",
            isActive: "Active",
            photo: "https://img.favpng.com/2/20/9/google-logo-google-search-search-engine-optimization-google-images-png-favpng-mrjKbWHacks0WiKXmVVZugyri.jpg",
        },
    ];

    // Filter
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        role: "",
        joiningFrom: "",
        joiningTo: "",
        department: "",
        city: "",
    });

    // Filters Options Logic
    const roles = useMemo(() => Array.from(new Set(employee.map((e) => e.role).filter(Boolean))).sort(), [employee]);
    const departments = useMemo(() => Array.from(new Set(employee.map((e) => e.department).filter(Boolean))).sort(), [employee]);
    const cities = useMemo(() => Array.from(new Set(employee.map((e) => e.city).filter(Boolean))).sort(), [employee]);

    // Filter Logic
    const filtered = useMemo(() => {
        return employee.filter((e) => {
            if (filters.role && String(e.role || "") !== filters.role) return false;
            if (filters.department && String(e.department || "") !== filters.department) return false;
            if (filters.city && String(e.city || "") !== filters.city) return false;

            if (filters.joiningFrom) {
                if (!e.joiningDate) return false;
                const from = new Date(filters.joiningFrom);
                const jd = new Date(e.joiningDate);
                if (jd < from) return false;
            }
            if (filters.joiningTo) {
                if (!e.joiningDate) return false;
                const to = new Date(filters.joiningTo);
                const jd = new Date(e.joiningDate);
                if (jd > to) return false;
            }
            return true;
        });
    }, [employee, filters]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const pageItems = useMemo(() => paginate(filtered, currentPage, pageSize), [filtered, currentPage, pageSize]);
    useEffect(() => setCurrentPage(1), [filters]);

    return <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-end gap-3 mb-4">
            {role === "admin" && (
                <button
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-sm"
                    onClick={() => navigate("/admin-add-employee")}>
                    + Add Employee
                </button>
            )}
            <button
                className="flex items-center gap-2 px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm"
                onClick={() => setShowFilters((s) => !s)}>
                <Filter size={14} /> Filters
            </button>
        </div>

        {/* Filters UI*/}
        {showFilters && (
            <div className="mb-4 bg-neutral-900 border border-neutral-700 rounded-md p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">

                    {/* Role */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">Role</label>
                        <select
                            value={filters.role}
                            onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                            <option value="">All</option>
                            {roles.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date From */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">Joining From</label>
                        <input
                            type="date"
                            value={filters.joiningFrom}
                            onChange={(e) => setFilters((f) => ({ ...f, joiningFrom: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm" />
                    </div>

                    {/* Date To */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">Joining To</label>
                        <input
                            type="date"
                            value={filters.joiningTo}
                            onChange={(e) => setFilters((f) => ({ ...f, joiningTo: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm" />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">Department</label>
                        <select
                            value={filters.department}
                            onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                            <option value="">All</option>
                            {departments.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">City</label>
                        <select
                            value={filters.city}
                            onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-2 text-sm">
                            <option value="">All</option>
                            {cities.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-3 flex gap-2 justify-end">
                    <button
                        className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
                        onClick={() =>
                            setFilters({
                                role: "",
                                joiningFrom: "",
                                joiningTo: "",
                                department: "",
                                city: "",
                            })}>
                        Clear
                    </button>
                    <div className="px-3 py-1 bg-purple-700 text-white rounded text-sm flex items-center">Download</div>
                </div>
            </div>
        )}

        {/* Employee Details */}
        <div className="space-y-3">
            {pageItems.length === 0 && (
                <div className="text-center py-6 text-neutral-400">No employees found.</div>
            )}

            {pageItems.map((emp) => (
                <div
                    key={emp.empId}
                    className="bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                    <div className="flex items-center gap-3 flex-1 min-w-0">

                        {/* Profile and Other Details */}
                        <img src={emp.photo} alt={emp.fullName} className="w-14 h-14 rounded-full border border-neutral-600 flex-shrink-0 object-cover" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-1 flex-1 min-w-0 text-neutral-300">
                            <p><span className="font-medium text-purple-300">EmpID:</span> <span className="text-neutral-200 break-all">{(emp.empId)}</span></p>
                            <p><span className="font-medium text-purple-300">Name:</span> <span className="text-neutral-200">{(emp.fullName)}</span></p>
                            <p><span className="font-medium text-purple-300">Email:</span> <span className="text-neutral-200">{(emp.email)}</span></p>
                            <p><span className="font-medium text-purple-300">Phone:</span> <span className="text-neutral-200">{(emp.phone)}</span></p>
                            <p><span className="font-medium text-purple-300">City:</span> <span className="text-neutral-200">{(emp.city)}</span></p>
                            <p><span className="font-medium text-purple-300">DOB:</span> <span className="text-neutral-200">{(emp.dob)}</span></p>
                            <p><span className="font-medium text-purple-300">Role:</span> <span className="text-neutral-200">{(emp.role)}</span></p>
                            <p>
                                <span className="font-medium text-purple-300">Status:</span>{" "}
                                <span className={`px-2 py-0.5 rounded text-xs ${emp.isActive === "Active" ? "bg-emerald-800 text-emerald-200" : "bg-rose-800 text-rose-200"}`}>{(emp.isActive)}</span>
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-0 sm:ml-4">
                        <button className="flex items-center gap-1 px-2 py-1 bg-purple-800 hover:bg-purple-700 rounded text-xs" onClick={() => navigate('/view-employee')}>
                            <Eye size={14} /> View
                        </button>

                        {role === "admin" && (
                            <>
                                <button className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs" onClick={() => navigate('/admin-update-employee')}>
                                    <Edit size={14} /> Update
                                </button>
                                <button className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>

        {/* Pagination */}
        <div className="mt-4">
            <CommonPagination
                totalItems={filtered.length}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage} />
        </div>
    </div>;
};

export default Employee;
