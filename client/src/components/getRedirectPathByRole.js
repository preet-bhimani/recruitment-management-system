const roleRedirectPaths = {
  Admin: "/admin",
  Reviewer: "/reviewer-dashboard",
  Recruiter: "/recruiter-candidate",
  Interviewer: "/interviewer-feedback",
  HR: "/hr-feedback",
  Candidate: "/",
  Viewer: "/viewer-user",
};

export default function getRedirectPathByRole(role) {
  return roleRedirectPaths[role] || "/login";
}
