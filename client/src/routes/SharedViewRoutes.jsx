import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ViewCampusDrive from "../reusableComponent/Campus Drive/ViewCampusDrive";
import ViewWalkInDrive from "../reusableComponent/Walk In Drive/ViewWalkInDrive";
import ViewJobOpening from "../reusableComponent/Job Opening/ViewJobOpening";
import ViewJobApplication from "../reusableComponent/Job Application/ViewJobApplication";
import ViewTechnicalInterview from "../reusableComponent/Technical Interview/ViewTechnicalInterview";
import ViewHRInterview from "../reusableComponent/Hr Interview/ViewHRInterview";
import ViewDocumentList from "../reusableComponent/Document List/ViewDocumentList";
import ViewOfferLetter from "../reusableComponent/Offer Letter/ViewOfferLetter";
import ViewSelection from "../reusableComponent/Selection/ViewSelection";
import ViewUser from "../reusableComponent/User/ViewUser";

const SharedViewRoutes = (
    <Route element={<ProtectedRoute allowedRoles={["Admin", "Viewer", "Recruiter"]} />}>
        <Route path="/view-campusdrive/:id" element={<ViewCampusDrive />} />
        <Route path="/view-walkindrive/:id" element={<ViewWalkInDrive />} />
        <Route path="/view-jobopening/:id" element={<ViewJobOpening />} />
        <Route path="/view-jobapplication/:id" element={<ViewJobApplication />} />
        <Route path="/view-techinterview/:id" element={<ViewTechnicalInterview />} />
        <Route path="/view-hrinterview/:id" element={<ViewHRInterview />} />
        <Route path="/view-documentlist/:id" element={<ViewDocumentList />} />
        <Route path="/view-offerletter/:id" element={<ViewOfferLetter />} />
        <Route path="/view-selection/:id" element={<ViewSelection />} />
        <Route path="/view-user/:id" element={<ViewUser />} />
    </Route>
);

export default SharedViewRoutes;
