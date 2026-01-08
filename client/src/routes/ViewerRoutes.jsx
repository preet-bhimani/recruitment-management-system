import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ViewerCampusDrive from "../viewer/ViewerCampusDrive";
import ViewerWalkInDrive from "../viewer/ViewerWalkInDrive";
import ViewerJobOpening from "../viewer/ViewerJobOpening";
import ViewerJobApplication from "../viewer/ViewerJobApplication";
import ViewerTechnicalInterview from "../viewer/ViewerTechnicalInterview";

const ViewerRoutes = (
    <Route element={<ProtectedRoute allowedRoles={["Viewer"]} />}>
        <Route path="/viewer-campusdrive" element={<ViewerCampusDrive />} />
        <Route path="/viewer-walkindrive" element={<ViewerWalkInDrive />} />
        <Route path="/viewer-jobopening" element={<ViewerJobOpening />} />
        <Route path="/viewer-jobapplication" element={<ViewerJobApplication />} />
        <Route path="/viewer-techinterview" element={<ViewerTechnicalInterview />} />
    </Route>
);

export default ViewerRoutes;
