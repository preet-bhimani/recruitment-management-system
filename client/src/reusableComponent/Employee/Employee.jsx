import React, { useState, useMemo, useEffect } from "react";
import { Eye, Edit, Trash2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CommonPagination, { paginate } from "../CommonPagination";
import axios from "axios";
import { toast } from "react-toastify";

const Employee = ({ role = "admin" }) => {

    const navigate = useNavigate();

    const [employee, setEmployee] = useState([]);

    // Fetch Employees
    const fetchEmployees = async () => {
        try {
            const res = await axios.get(`https://localhost:7119/api/Employee/`);
            setEmployee(res.data);
        }
        catch (err) {
            toast.error("Error fetching data!");
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Filter
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        role: "",
        joiningFrom: "",
        joiningTo: "",
        city: "",
    });

    // Filters Options Logic
    const roles = useMemo(() => Array.from(new Set(employee.map((e) => e.jobTitle).filter(Boolean))).sort(), [employee]);
    const cities = useMemo(() => Array.from(new Set(employee.map((e) => e.city).filter(Boolean))).sort(), [employee]);

    // Filter Logic
    const filtered = useMemo(() => {
        return employee.filter((e) => {
            if (filters.role && String(e.jobTitle || "") !== filters.role) return false;
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
            {/* {role === "admin" && (
                <button
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-sm"
                    onClick={() => navigate("/admin-add-employee")}>
                    + Add Employee
                </button>
            )} */}
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
                    key={emp.employeeId}
                    className="bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                    <div className="flex items-center gap-3 flex-1 min-w-0">

                        {/* Profile and Other Details */}
                        <img src={emp.photo} alt={emp.fullName} className="w-14 h-14 rounded-full border border-neutral-600 flex-shrink-0 object-cover" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-1 flex-1 min-w-0 text-neutral-300">
                            <p><span className="font-medium text-purple-300">EmpID:</span> <span className="text-neutral-200 break-all">{(emp.employeeId)}</span></p>
                            <p><span className="font-medium text-purple-300">Name:</span> <span className="text-neutral-200">{(emp.fullName)}</span></p>
                            <p><span className="font-medium text-purple-300">Email:</span> <span className="text-neutral-200">{(emp.email)}</span></p>
                            <p><span className="font-medium text-purple-300">Phone:</span> <span className="text-neutral-200">{(emp.phoneNumber)}</span></p>
                            <p><span className="font-medium text-purple-300">City:</span> <span className="text-neutral-200">{(emp.city)}</span></p>
                            <p><span className="font-medium text-purple-300">Title:</span> <span className="text-neutral-200">{(emp.jobTitle)}</span></p>
                            <p>
                                <span className="font-medium text-purple-300">Status:</span>{" "}
                                <span className={`px-2 py-0.5 rounded text-xs ${emp.employmentStatus === "Active" ? "bg-emerald-800 text-emerald-200" : "bg-rose-800 text-rose-200"}`}>{(emp.employmentStatus)}</span>
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-0 sm:ml-4">
                        <button className="flex items-center gap-1 px-2 py-1 bg-purple-800 hover:bg-purple-700 rounded text-xs" onClick={() => navigate('/view-employee')}>
                            <Eye size={14} /> View
                        </button>

                        {/* {role === "admin" && (
                            <>
                                <button className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs" onClick={() => navigate('/admin-update-employee')}>
                                    <Edit size={14} /> Update
                                </button>
                                <button className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </>
                        )} */}
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
