import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RecruiterCampusDrive from "../recruiter/RecruiterCampusDrive";
import RecruiterAddShowCampusDrive from "../recruiter/RecruiterAddShowCampusDrive";
import RecruiterAddCampusDrive from "../recruiter/RecruiterAddCampusDrive";
import RecruiterWalkInDrive from "../recruiter/RecruiterWalkInDrive";
import RecruiterAddShowWalkInDrive from "../recruiter/RecruiterAddShowWalkInDrive";
import RecruiterAddWalkInDrive from "../recruiter/RecruiterAddWalkInDrive";
import RecruiterJobOpening from "../recruiter/RecruiterJobOpening";
import RecruiterAddJobOpening from "../recruiter/RecruiterAddJobOpening";
import RecruiterUpdateJobOpening from "../recruiter/RecruiterUpdateJobOpening";
import RecruiterMeetingScheduling from "../recruiter/RecruiterMeetingScheduling";
import RecruiterSentOfferLetter from "../recruiter/RecruiterSentOfferLetter";
import RecruiterSkill from "../recruiter/RecruiterSkill";
import RecruiterAddSkill from "../recruiter/RecruiterAddSkill"
import RecruiterUpdateSkill from "../recruiter/RecruiterUpdateSkill";
import RecruiterAddUser from "../recruiter/RecruiterAddUser";
import RecruiterAddUserExcel from "../recruiter/RecruiterAddUserExcel";
import RecruiterCandidate from "../recruiter/RecruiterCandidate";
import RecruiterAddUserResume from "../recruiter/RecruiterAddUserResume";

const RecruiterRoutes = (
    <Route element={<ProtectedRoute allowedRoles={["Recruiter"]} />}>
        <Route path="/recruiter-campusdrive" element={<RecruiterCampusDrive />} />
        <Route path="/recruiter-add-campusdrive" element={<RecruiterAddShowCampusDrive />} />
        <Route path="/recruiter-add-campusdrive/:id" element={<RecruiterAddCampusDrive />} />
        <Route path="/recruiter-walkindrive" element={<RecruiterWalkInDrive />} />
        <Route path="/recruiter-add-walkindrive" element={<RecruiterAddShowWalkInDrive />} />
        <Route path="/recruiter-add-walkindrive/:id" element={<RecruiterAddWalkInDrive />} />
        <Route path="/recruiter-jobopening" element={<RecruiterJobOpening />} />
        <Route path="/recruiter-add-jobopening" element={<RecruiterAddJobOpening />} />
        <Route path="/recruiter-update-jobopening/:id" element={<RecruiterUpdateJobOpening />} />
        <Route path="/recruiter-meeting-scheduling" element={<RecruiterMeetingScheduling />} />
        <Route path="/recruiter-sent-offer-letter/:id" element={<RecruiterSentOfferLetter />} />
        <Route path="/recruiter-skill" element={<RecruiterSkill />} />
        <Route path="/recruiter-add-skill" element={<RecruiterAddSkill />} />
        <Route path="/recruiter-update-skill/:id" element={<RecruiterUpdateSkill />} />
        <Route path="/recruiter-add-candidate" element={<RecruiterAddUser />} />
        <Route path="/recruiter-add-candidate-excel" element={<RecruiterAddUserExcel />} />
        <Route path="/recruiter-candidate" element={<RecruiterCandidate />} />
        <Route path="/recruiter-add-candidate-resume" element={<RecruiterAddUserResume />} />
    </Route>
);

export default RecruiterRoutes;
