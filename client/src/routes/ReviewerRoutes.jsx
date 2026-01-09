import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ReviewerDashboard from "../reviewer/ReviewerDashboard";

const ReviewerRoutes = (
    <Route element={<ProtectedRoute allowedRoles={["Reviewer"]} />}>
        <Route path="/reviewer-dashboard" element={<ReviewerDashboard />} />
    </Route>
);

export default ReviewerRoutes;
