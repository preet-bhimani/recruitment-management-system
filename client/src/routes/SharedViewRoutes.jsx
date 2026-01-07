import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ViewCampusDrive from "../reusableComponent/Campus Drive/ViewCampusDrive";
import ViewWalkInDrive from "../reusableComponent/Walk In Drive/ViewWalkInDrive";
import ViewJobOpening from "../reusableComponent/Job Opening/ViewJobOpening";

const SharedViewRoutes = (
    <Route element={<ProtectedRoute allowedRoles={["Admin", "Viewer", "Recruiter"]} />}>
        <Route path="/view-campusdrive/:id" element={<ViewCampusDrive />} />
        <Route path="/view-walkindrive/:id" element={<ViewWalkInDrive />} />
        <Route path="/view-jobopening/:id" element={<ViewJobOpening />} />
    </Route>
);

export default SharedViewRoutes;
