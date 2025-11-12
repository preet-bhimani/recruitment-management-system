namespace server.Services
{
    public class OfferLetterTemplateService
    {
        // Internship offer letter
        public string InternshipOfferLetterTemplate(
            string companyName,
            string fullName,
            string city,
            string title,
            string joiningDate,
            string endDate,
            string bondTime,
            string salary)
        {
            string todayDate = DateTime.UtcNow.ToString("dd MMMM yyyy");

            return $@"
                <div style='font-family: Arial, sans-serif; line-height:1.6; color:#000;'>
                    <h2 style='text-align:center;'>{companyName}</h2>
                    <h3 style='text-align:center;'>Internship Letter</h3>
                    <p style='text-align:right;'>Date: {todayDate}</p>
                    <p><b>{fullName}</b><br/>{city}</p>

                    <p>Dear {fullName},</p>

                    <p>
                        We are pleased to offer you an internship at {companyName}. 
                        Your internship shall commence on {joiningDate} and will end on {endDate} ({bondTime}) 
                        for {title}. The duration of the internship will be {bondTime} and the dates can vary. 
                        The terms and conditions of your internship with the Company are set forth below:
                    </p>

                    <p>1. Subject to your acceptance of the terms and conditions contained herein, your project and responsibilities during the Term will be determined by the supervisor assigned to you for the duration of the internship.</p>
                    <p>2. You are eligible for a stipend of INR {salary} per month during the internship which shall be bound to completion of the tasks assigned to you during your internship to the satisfaction of the Company.</p>
                    <p>3. Your working hours will be 40 hours weekly from Monday to Friday. You shall be available for services 24 X 7 for on-call support.</p>

                    <p>Please be sure to bring the required documents mentioned below with you on your first day to complete your profile.</p>

                    <ul>
                        <li>Education Qualification certificates with mark sheets. (10th, 12th, Graduation & PG)</li>
                        <li>Previous Internship letters / Experience certificates. (If any)</li>
                        <li>Permanent Residence Proof.</li>
                        <li>Personal ID Proof. (PAN / Passport/ Aadhar)</li>
                        <li>Certificate/Letter from College for Internship</li>
                        <li>College ID Proof.</li>
                    </ul>

                    <p>4. You will sign an NDA with the company before you commence your internship.</p>
                    <p>5. The internship cannot be construed as employment or an offer of employment with {companyName}.</p>

                    <p style='margin-top:60px;'>Sign By Intern</p>
                </div>";
        }

        // Job offer letter template
        public string JobOfferLetterTemplate(
            string companyName,
            string fullName,
            string city,
            string title,
            string joiningDate,
            string bondTime,
            string salary)
        {
            string todayDate = DateTime.UtcNow.ToString("dd MMMM yyyy");

            return $@"
                <div style='font-family: Arial, sans-serif; line-height:1.6; color:#000;'>
                    <h2 style='text-align:center;'>{companyName}</h2>
                    <h3 style='text-align:center;'>Job Letter</h3>
                    <p style='text-align:right;'>Date: {todayDate}</p>
                    <p><b>{fullName}</b><br/>{city}</p>

                    <p>Dear {fullName},</p>

                    <p>
                        We are pleased to offer you a job at {companyName}. 
                        Your employment shall commence on {joiningDate} for {title}. 
                        The duration of the bond will be {bondTime} and the dates can vary. 
                        The terms and conditions of your employment with the Company are set forth below:
                    </p>

                    <p>1. Subject to your acceptance of the terms and conditions contained herein, your project and responsibilities during the Term will be determined by the supervisor assigned to you for the duration of the employment.</p>
                    <p>2. You are eligible for a salary of INR {salary} per month during the employment which shall be bound to completion of the tasks assigned to you during your tenure to the satisfaction of the Company.</p>
                    <p>3. Your working hours will be 40 hours weekly from Monday to Friday. You shall be available for services 24 X 7 for on-call support.</p>

                    <p>Please be sure to bring the required documents mentioned below with you on your first day to complete your profile.</p>

                    <ul>
                        <li>Education Qualification certificates with mark sheets. (10th, 12th, Graduation & PG)</li>
                        <li>Previous Internship letters / Experience certificates. (If any)</li>
                        <li>Permanent Residence Proof.</li>
                        <li>Personal ID Proof. (PAN / Passport/ Aadhar)</li>
                        <li>Certificate/Letter from College for Internship</li>
                        <li>College ID Proof.</li>
                    </ul>

                    <p>4. You will sign an NDA with the company before you commence your employment.</p>
                    <p>5. The employment cannot be construed as an offer of further employment with {companyName}.</p>

                    <p style='margin-top:60px;'>Sign By Employee</p>
                </div>";
        }
    }
}
