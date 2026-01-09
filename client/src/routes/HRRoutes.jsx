import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import HRFeedback from "../hr/HRFeedback";
import HRDocumentsCheck from "../hr/HRDocumentsCheck";

const HRRoutes = (
    <Route element={<ProtectedRoute allowedRoles={["HR"]} />}>
        <Route path="/hr-feedback" element={<HRFeedback />} />
        <Route path="/hr-documents-check/:candidateId" element={<HRDocumentsCheck />} />
    </Route>
);

export default HRRoutes;
