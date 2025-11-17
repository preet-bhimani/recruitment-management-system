namespace server.Services
{
    public class EmailTemplateService
    {
        // Technical interview template for candidates
        public string TechnicalInterviewCandidateTemplate(
            string candidateName, int round, DateTime date, string time, string interviewerName, string meetingLink)
        {
            return $@"
                <h3>Technical Interview Scheduled</h3>
                <p>Dear {candidateName},</p>
                <p>Your technical interview has been scheduled.</p>

                <p>
                    <b>Round:</b> {round}<br/>
                    <b>Date:</b> {date:dd MMM yyyy}<br/>
                    <b>Time:</b> {time} IST<br/>
                    <b>Meeting Link:</b> 
                    <a href='{meetingLink}' 
                    style=""display:inline-block; background-color:#6a0dad; color:#ffffff; padding:8px 14px; border-radius:6px; text-decoration:none; font-weight:600;"">
                    Join Meeting
                    </a>
                </p>

                <p>Best of luck!</p>
                <p><i>Regards,<br/>Roima Team</i></p>";
        }

        // Technical Interview template for interviewer
        public string TechnicalInterviewInterviewerTemplate(
            string interviewerName, string candidateName, int round, DateTime date, string time, string meetingLink)
        {
            return $@"
                <h3>New Interview Assigned</h3>
                <p>Dear {interviewerName},</p>
                <p>You have been assigned to conduct a technical interview.</p>

                <p>
                    <b>Candidate:</b> {candidateName}<br/>
                    <b>Round:</b> {round}<br/>
                    <b>Date:</b> {date:dd MMM yyyy}<br/>
                    <b>Time:</b> {time} IST<br/>
                    <a href='{meetingLink}' 
                    style=""display:inline-block; background-color:#6a0dad; color:#ffffff; padding:8px 14px; border-radius:6px; text-decoration:none; font-weight:600;"">
                    Join Meeting
                    </a>
                </p>

                <p>Please evaluate the candidate and submit feedback.</p>
                <p><i>Regards,<br/>Roima Team</i></p>";
        }

        // HR interview template for candidate
        public string HRInterviewCandidateTemplate(
            string candidateName, int round, DateTime date, string time, string interviewerName, string meetingLink)
        {
            return $@"
                <h3>HR Interview Scheduled</h3>
                <p>Dear {candidateName},</p>
                <p>Your HR interview has been scheduled.</p>

                <p>
                    <b>Round:</b> {round}<br/>
                    <b>Date:</b> {date:dd MMM yyyy}<br/>
                    <b>Time:</b> {time} IST<br/>
                    <b>Meeting Link:</b> 
                    <a href='{meetingLink}' 
                    style=""display:inline-block; background-color:#0077b6; color:#ffffff; padding:8px 14px; border-radius:6px; text-decoration:none; font-weight:600;"">
                    Join Meeting
                    </a>
                </p>

                <p>Best wishes!</p>
                <p><i>Regards,<br/>Roima Team</i></p>";
        }

        // HR interview template for interviewer
        public string HRInterviewInterviewerTemplate(
            string interviewerName, string candidateName, int round, DateTime date, string time, string meetingLink)
        {
            return $@"
                <h3>New HR Interview Assigned</h3>
                <p>Dear {interviewerName},</p>
                <p>You have been assigned to conduct an HR interview.</p>

                <p>
                    <b>Candidate:</b> {candidateName}<br/>
                    <b>Round:</b> {round}<br/>
                    <b>Date:</b> {date:dd MMM yyyy}<br/>
                    <b>Time:</b> {time} IST<br/>
                    <a href='{meetingLink}' 
                    style=""display:inline-block; background-color:#0077b6; color:#ffffff; padding:8px 14px; border-radius:6px; text-decoration:none; font-weight:600;"">
                    Join Meeting
                    </a>
                </p>

                <p>Please evaluate the candidate and submit your HR feedback.</p>
                <p><i>Regards,<br/>Roima Team</i></p>";
        }

        // Reset password OTP send template
        public string PasswordResetOtpTemplate(string name, string otp)
        {
            return $@"
                <h2>Password Reset Request</h2>

                <p>Hi {name},</p>

                <p>Your OTP for resetting your password is:</p>
                <h1 style='letter-spacing: 4px; color:#6a0dad;'>{otp}</h1>
                <p>This OTP is valid for <b>5 minutes</b>. Do NOT share this code with anyone.</p>
                <p>If you didn’t request this, please ignore this email.</p>

                <p><i>Regards,<br/>Roima Recruitment Team</i></p>";
        }
    }
}
