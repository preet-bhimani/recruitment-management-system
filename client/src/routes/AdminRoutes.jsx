import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminCampusDrive from "../admin/Campus Drive/AdminCampusDrive";
import AdminAddCampusDrive from "../admin/Campus Drive/AdminAddCampusDrive";
import AdminAddJobCampusDrive from "../admin/Campus Drive/AdminAddJobCampusDrive";
import AdminWalkInDrive from "../admin/Walk In Drive/AdminWalkInDrive";
import AdminAddJobWalkInDrive from "../admin/Walk In Drive/AdminAddJobWalkInDrive";
import AdminAddWalkInDrive from "../admin/Walk In Drive/AdminAddWalkInDrive";
import AdminUpdateWalkInDrive from "../admin/Walk In Drive/AdminUpdateWalkInDrive";
import AdminUpdateCampusDrive from "../admin/Campus Drive/AdminUpdateCampusDrive";
import AdminJobOpening from "../admin/Job opening/AdminJobOpening";
import AdminAddJobOpening from "../admin/Job opening/AdminAddJobOpening";
import AdminUpdateJobOpening from "../admin/Job opening/AdminUpdateJobOpening";
import AdminJobApplication from "../admin/Job Application/AdminJobApplication";
import AdminAddJobApplication from "../admin/Job Application/AdminAddJobApplication";
import AdminUpdateJobApplication from "../admin/Job Application/AdminUpdateJobApplication";
import AdminTechInterview from "../admin/Technical Interview/AdminTechInterview";
import AdminUpdateTechInterview from "../admin/Technical Interview/AdminUpdateTechInterview";

const AdminRoutes = (
    <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route path="/admin-campusdrive" element={<AdminCampusDrive />} />
        <Route path="/admin-add-campusdrive/:id" element={<AdminAddCampusDrive />} />
        <Route path="/admin-add-campusdrive" element={<AdminAddJobCampusDrive />} />
        <Route path="/admin-update-campusdrive/:id" element={<AdminUpdateCampusDrive />} />
        <Route path="/admin-walkindrive" element={<AdminWalkInDrive />} />
        <Route path="/admin-add-walkindrive" element={<AdminAddJobWalkInDrive />} />
        <Route path="/admin-add-walkindrive/:id" element={<AdminAddWalkInDrive />} />
        <Route path="/admin-update-walkindrive/:id" element={<AdminUpdateWalkInDrive />} />
        <Route path="/admin-jobopening" element={<AdminJobOpening />} />
        <Route path="/admin-add-jobopening" element={<AdminAddJobOpening />} />
        <Route path="/admin-update-jobopening/:id" element={<AdminUpdateJobOpening />} />
        <Route path="/admin-jobapplication" element={<AdminJobApplication />} />
        <Route path="/admin-add-jobapplication" element={<AdminAddJobApplication />} />
        <Route path="/admin-update-jobapplication/:id" element={<AdminUpdateJobApplication />} />
        <Route path="/admin-techinterview" element={<AdminTechInterview />} />
        <Route path="/admin-update-techinterview/:id" element={<AdminUpdateTechInterview />} />
    </Route>
);

export default AdminRoutes;
