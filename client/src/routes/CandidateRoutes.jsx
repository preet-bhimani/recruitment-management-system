import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MyJobs from "../candidate/MyJobs";
import Notifications from "../candidate/Notifications";

const CandidateRoutes = (
    <Route element={<ProtectedRoute allowedRoles={["Candidate"]} />}>
        <Route path="/myjobs" element={<MyJobs />} />
        <Route path="/notifications" element={<Notifications />} />
    </Route>
);

export default CandidateRoutes;
