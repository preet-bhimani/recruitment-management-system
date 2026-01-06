import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminCampusDrive from "../admin/Campus Drive/AdminCampusDrive";

function AdminRoutes() {
    return (
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/admin-campusdrive" element={<AdminCampusDrive />} />
        </Route>
    );
}

export default AdminRoutes;
