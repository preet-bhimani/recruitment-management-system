import React, { useMemo, useState, useEffect } from "react";
import { Eye, Edit, Trash2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CommonPagination, { paginate } from "../CommonPagination";
import axios from "axios";
import { toast } from "react-toastify";

const AllUsers = ({ role = "admin" }) => {

    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    // Fetch Users
    const fetchUsers = async () => {
        try {
            const res = await axios.get("https://localhost:7119/api/User");
            setUsers(res.data || []);
        }
        catch (err) {
            toast.error("failed to load users")
        }
    }

    // Filters
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        city: "",
        yearsOfExperience: "",
        role: "",
    });

    const cities = useMemo(
        () => Array.from(new Set(users.map((u) => u.city))).sort(),
        [users]
    );

    const roles = ["Candidate", "Recruiter", "Reviewer", "Viewer", "HR", "Interviewer", "Admin"];

    // Filters Logic
    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const byCity = filters.city ? u.city === filters.city : true;
            const byRole = filters.role ? u.role === filters.role : true;
            const byYoe = filters.yearsOfExperience
                ? Number(u.yearsOfExperience) >= Number(filters.yearsOfExperience)
                : true;
            return byCity && byRole && byYoe;
        });
    }, [users, filters]);

    // Pagination Logic
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const totalItems = filteredUsers.length;
    const pageItems = useMemo(() => paginate(filteredUsers, currentPage, pageSize), [
        filteredUsers,
        currentPage,
        pageSize,
    ]);

    // Delete User or Just Deactivate User
    const handleDelete = async (userId) => {
        const ok = window.confirm("Are you sure you want to deactivate this user?");
        if (!ok) return;

        try {
            await axios.delete(`https://localhost:7119/api/User/delete/${userId}`);
            fetchUsers();
            toast.success(res.data.message || "User deactivated successfully");
        } catch (err) {
            toast.error(err.response?.data || "Delete failed");
        }
    };

    // Reset Page Filter on Change
    useEffect(() => {
        fetchUsers();
        setCurrentPage(1);
    }, [filters]);

    return <>
        <div className="flex-1 p-4 overflow-y-auto">

            {/* Add New User */}
            <div className="flex flex-wrap gap-3 mb-4 justify-end">
                {role === "admin" && (
                    <>
                        <button
                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-sm"
                            onClick={() => navigate("/admin-add-user")}>
                            + Add User
                        </button>
                        <button
                            className="px-3 py-1 bg-sky-700 hover:bg-sky-600 rounded text-sm"
                            onClick={() => navigate("/admin-add-user-excel")}>
                            + Add Excel
                        </button>
                        <button
                            className="px-3 py-1 bg-fuchsia-700 hover:bg-fuchsia-600 rounded text-sm"
                            onClick={() => navigate("/admin-add-user-resume")}>
                            + Add Resume
                        </button>
                    </>
                )}

                {/* Filter Button */}
                <button
                    className="flex items-center gap-1 px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm"
                    onClick={() => setShowFilters((s) => !s)}>
                    <Filter size={14} /> Filters
                </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="mb-4 bg-neutral-900 border border-neutral-700 rounded-md p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                            <label className="block mb-1 text-xs text-neutral-200">City</label>
                            <select
                                value={filters.city}
                                onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm">
                                <option value="">All</option>
                                {cities.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Expernience Filter */}
                        <div>
                            <label className="block mb-1 text-xs text-neutral-200">Years of Experience</label>
                            <input
                                type="number"
                                min="0"
                                value={filters.yearsOfExperience}
                                onChange={(e) =>
                                    setFilters((f) => ({ ...f, yearsOfExperience: e.target.value }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm" />
                        </div>

                        {/* Role Filter */}
                        <div>
                            <label className="block mb-1 text-xs text-neutral-200">Role</label>
                            <select
                                value={filters.role}
                                onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm">
                                <option value="">All</option>
                                {roles.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                className="px-3 py-1 bg-purple-700 hover:bg-purple-600 rounded text-sm"
                                onClick={() => setShowFilters(false)}>
                                Download
                            </button>
                            <button
                                className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
                                onClick={() => setFilters({ city: "", yearsOfExperience: "", role: "" })}>
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* User Details */}
            <div className="space-y-2">
                {pageItems.map((user, idx) => (
                    <div
                        key={`${user.userId}-${idx}`}
                        className="bg-neutral-900 border border-neutral-700 rounded-md p-3 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                        <div className="flex items-center gap-3 flex-1">
                            <img
                                src={user.photo}
                                alt={user.fullName}
                                className="w-10 h-10 rounded-full border border-neutral-600" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-1 flex-1">
                                <p><span className="font-medium text-purple-300">UserID:</span> {user.userId || "-"}</p>
                                <p><span className="font-medium text-purple-300">Name:</span> {user.fullName || "-"}</p>
                                <p><span className="font-medium text-purple-300 ">Email:</span> <span className="break-all">{user.email || "-"}</span></p>
                                <p><span className="font-medium text-purple-300">Phone:</span> {user.phoneNumber || "-"}</p>
                                <p><span className="font-medium text-purple-300">City:</span> {user.city || "-"}</p>
                                <p><span className="font-medium text-purple-300">DOB:</span> {user.dob || "-"}</p>
                                <p><span className="font-medium text-purple-300">Role:</span> {user.role || "-"}</p>
                                <p><span className="font-medium text-purple-300">Status:</span>{" "}
                                    <span className={`px-2 py-0.5 rounded text-xs ${user.isActive
                                        ? "bg-emerald-800 text-emerald-200"
                                        : "bg-rose-800 text-rose-200"
                                        }`}>
                                        {user.isActive ? "Active" : "Deactive"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2 ml-0 sm:ml-4">
                            <button
                                className="flex items-center gap-1 px-2 py-1 bg-purple-800 hover:bg-purple-700 rounded text-xs"
                                onClick={() => navigate("/view-user")}>
                                <Eye size={14} /> View
                            </button>

                            {role === "admin" && (
                                <>
                                    <button
                                        className="flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 rounded text-xs"
                                        onClick={() => navigate(`/admin-user-update/${user.userId}`)}>
                                        <Edit size={14} /> Update
                                    </button>

                                    {user.isActive && (
                                        <button className="flex items-center gap-1 px-2 py-1 bg-rose-800 hover:bg-rose-700 rounded text-xs"
                                            onClick={() => handleDelete(user.userId)}>
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination UI */}
            <div className="mt-4">
                <CommonPagination
                    totalItems={totalItems}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage} />
            </div>
        </div>
    </>;
};

export default AllUsers;
