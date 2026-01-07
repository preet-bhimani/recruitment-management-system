import React from "react";
import { useAuth } from "../contexts/AuthContext";;
import { Navigate, Outlet } from "react-router-dom"
import getRedirectPathByRole from "../components/getRedirectPathByRole";

function ProtectedRoute({ allowedRoles }) {
    const { token, role } = useAuth();

    // If No Token Found Send Them to Login Page
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Token Found But No Role Found
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to={getRedirectPathByRole(role)} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
