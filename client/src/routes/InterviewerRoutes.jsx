import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import InterviewerFeedback from "../interviewer/InterviewerFeedback";
import InterviewerMeetingDetails from "../interviewer/InterviewerMeetingDetails";

const InterviewerRoutes = (
    <Route element={<ProtectedRoute allowedRoles={["Interviewer"]} />}>
        <Route path="/interviewer-feedback" element={<InterviewerFeedback />} />
    </Route>
);

export default InterviewerRoutes;
