using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Dto;
using server.Models.Entities;
using server.Services;
using System.Security.Claims;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OfferLetterController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly OfferLetterGenerateService generateService;
        private readonly EmailService emailService;

        public OfferLetterController(AppDbContext dbContext, OfferLetterGenerateService generateService, EmailService emailService)
        {
            this.dbContext = dbContext;
            this.generateService = generateService;
            this.emailService = emailService;
        }

        // Generate PDF from form data and sent to email
        [HttpPost("generate")]
        public async Task<IActionResult> GenerateOfferLetter(GenerateOfferLetter golDto)
        {
            // Model Validation
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == golDto.UserId);
            var job = await dbContext.JobOpenings.FirstOrDefaultAsync(j => j.JOId == golDto.JOId);

            // If any of these are null
            if (user == null || job == null)
            {
                return BadRequest("Invalid user or job details.");
            }

            // Set file path
            var storedFileName = await generateService.GenerateOfferLetter(golDto);

            var offerLetter = new OfferLetter
            {
                UserId = golDto.UserId,
                JOId = golDto.JOId,
                JAId = golDto.JAId,
                JoiningDate = golDto.JoiningDate,
                EndDate =   golDto.EndDate,
                BondTime =  golDto.BondTime,
                Salary = golDto.Salary,
                TemplateType = golDto.TemplateType,
                OfferLetterStatus = "Sent",
                OfferLetterFilePath = storedFileName,
                CreatedAt = DateTime.UtcNow
            };

            dbContext.OfferLetters.Add(offerLetter);

            // Change overallstatus to Offer Letter Sent
            var application = await dbContext.JobApplications.FirstOrDefaultAsync(a => a.JAId == golDto.JAId);
            if (application != null)
            {
                application.OverallStatus = "Offer Letter Sent";
                dbContext.JobApplications.Update(application);
            }

            await dbContext.SaveChangesAsync();

            // Sent body message
            string emailBody = $@"
                    <p>Dear {user.FullName},</p>
                    <p>Congratulations! Please find attached your offer letter for the position of <b>{job.Title}</b>.</p>
                    <p>We look forward to welcoming you on <b>{golDto.JoiningDate:dd MMM yyyy}</b>.</p>
                    <p>Best Regards,<br/>xyz pvt. ltd.</p>";

            var finalPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "User_Upload_OfferLetters", storedFileName);

            await emailService.SendEmailWithAttachment(user.Email, "Updated Offer Letter", emailBody, finalPath);

            return Ok("Offer Letter generated and sent sucessfully");
        }

        // Fetch all pending offer letter to sent
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingOfferLetter()
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";

            var result = await dbContext.JobApplications
                .Where(ja => ja.OverallStatus == "Offer Letter Pending")
                .Select(ja => new
                {
                    jaId = ja.JAId,
                    joId = ja.JOId,
                    userId = ja.UserId,
                    overallStatus = ja.OverallStatus,
                    Photo = !string.IsNullOrEmpty(ja.User.Photo) ? baseUrl + ja.User.Photo : null,
                    fullName = ja.User.FullName,
                    email = ja.User.Email,
                    title = ja.JobOpening.Title
                })
                .ToListAsync();

            return Ok(result);
        }

        // Get Job application by ID to set UserId, JAId, JOId
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetOfferLetterByID(Guid id)
        {

            var result = await dbContext.JobApplications
                .Where(ja => ja.JAId == id)
                .Select(ja => new
                {
                    jaId = ja.JAId,
                    joId = ja.JOId,
                    userId = ja.UserId,
                })
                .ToListAsync();

            return Ok(result);
        }

        // Fetch offer letters by ID
        [HttpGet("fetch/{id:guid}")]
        public async Task<IActionResult> GetOfferLetterDataByID(Guid id)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}/Uploads/";

            var offer = await dbContext.OfferLetters
                .Where(o => o.OLId  == id)
                .Include(o => o.JobOpening)
                .Include(o => o.User)
                .Select(o => new
                {
                    o.OLId,
                    o.Salary,
                    o.JoiningDate,
                    o.OfferLetterStatus,
                    o.EndDate,
                    o.BondTime,
                    JobType = o.TemplateType,
                    o.User.FullName,
                    o.User.Email,
                    o.JobOpening.Title,
                    Photo = o.User.Photo != null
                    ? baseUrl + "User_Upload_Photos/" + o.User.Photo
                    : null,

                    OfferLetter = o.OfferLetterFilePath != null
                    ? baseUrl + "User_Upload_OfferLetters/" + o.OfferLetterFilePath
                    : null,
                })
                .FirstOrDefaultAsync();

            if (offer == null) 
            {
                return NotFound("Offer Letter not found");
            }

            return Ok(offer);
        }

        // Fetch all candidates from offerletter table
        [HttpGet]
        public async Task<IActionResult> GetAllOfferLetters()
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";

            var offer = await dbContext.OfferLetters
                .Select(of => new
                {
                    of.OLId,
                    of.JAId,
                    of.Salary,
                    of.TemplateType,
                    of.OfferLetterStatus,
                    of.JoiningDate,
                    of.EndDate,
                    of.BondTime,
                    of.User.FullName,
                    of.User.Email,
                    of.JobApplication.OverallStatus,
                    Photo = !string.IsNullOrEmpty(of.User.Photo) ? baseUrl + of.User.Photo : null,
                    of.JobOpening.Title
                })
                .ToListAsync();

            return Ok(offer);
        }

        // Get offer letter details by OLID
        [HttpGet("details/{id:guid}")]
        public async Task<IActionResult> GetOfferLetterDetailsByID(Guid id)
        {
            var offer = await dbContext.OfferLetters
                .Where(o => o.OLId == id)
                .Select(o => new
                {
                    o.OLId,
                    o.UserId,
                    o.JOId,
                    o.JAId,
                    o.JoiningDate,
                    o.EndDate,
                    o.BondTime,
                    o.Salary,
                    o.TemplateType,
                    o.OfferLetterStatus,
                    o.OfferLetterFilePath,
                    fullName = o.User.FullName,
                    email = o.User.Email,
                    title = o.JobOpening.Title,
                    overallStatus = o.JobApplication.OverallStatus
                })
                .FirstOrDefaultAsync();

            if (offer == null)
            {
                return NotFound("Invalid OfferLetter ID");
            }

            return Ok(offer);
        }


        // Update Offer letter and sent to mail
        [Authorize(Roles = "Admin, Recruiter")]
        [HttpPut("update/{id:guid}")]
        public async Task<IActionResult> UpdateOfferLetter(Guid id, GenerateOfferLetter golDto)
        {
            var offer = await dbContext.OfferLetters
                .Include(o => o.JobApplication)
                .FirstOrDefaultAsync(o => o.OLId == id);

            if (offer == null)
            {
                return NotFound("Offer letter not found.");
            }
            // If currently on Hold and changing to something else
            if (offer.OfferLetterStatus == "Hold" && golDto.OfferLetterStatus != "Hold")
            {
                offer.JobApplication.OverallStatus = offer.JobApplication.HoldOverallStatus;
                offer.JobApplication.HoldOverallStatus = null;
                dbContext.JobApplications.Update(offer.JobApplication);
            }

            switch (golDto.OfferLetterStatus)
            {
                // Change just OverallStatus OfferLetterStatus 
                case "Accepted":
                    offer.OfferLetterStatus = "Accepted";
                    offer.JobApplication.OverallStatus = "Selected";
                    offer.JobApplication.RejectionStage = null;

                    await dbContext.SaveChangesAsync();
                    var existingSelection = await dbContext.Selections
                        .FirstOrDefaultAsync(s => s.OLId == offer.OLId);
                    
                    // Add details into Selection tables
                    if (existingSelection == null)
                    {
                        var newSelection = new Selection
                        {
                            SelectionId = Guid.NewGuid(),
                            UserId = offer.UserId,
                            JOId = offer.JOId,
                            JAId = offer.JAId,
                            OLId = offer.OLId,
                            SelectionStatus = "Selected",
                            CreatedAt = DateTime.UtcNow
                        };

                        dbContext.Selections.Add(newSelection);
                        await dbContext.SaveChangesAsync();
                    }
                    return Ok("Offer letter accepted successfully");

                // Change just OverallStatus OfferLetterStatus 
                case "Rejected":
                    offer.OfferLetterStatus = "Rejected";
                    offer.JobApplication.OverallStatus = "Rejected";
                    offer.JobApplication.RejectionStage = "Offer Letter Rejected";
                    offer.JobApplication.UpdatedAt = DateTime.UtcNow;

                    await dbContext.SaveChangesAsync();
                    return Ok("Offer letter rejected successfully.");
                
                // Change all and send PDF and mail
                case "Sent":
                    offer.JoiningDate = golDto.JoiningDate;
                    offer.EndDate = golDto.EndDate;
                    offer.BondTime = golDto.BondTime;
                    offer.Salary = golDto.Salary;
                    offer.TemplateType = golDto.TemplateType;
                    offer.UpdatedAt = DateTime.UtcNow;
                    offer.OfferLetterStatus = "Sent";
                    offer.JobApplication.OverallStatus = "Offer Letter Sent";

                    // Regenerate PDF
                    var storedFileName = await generateService.GenerateOfferLetter(golDto);
                    offer.OfferLetterFilePath = storedFileName;

                    var user = await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == golDto.UserId);
                    var job = await dbContext.JobOpenings.FirstOrDefaultAsync(j => j.JOId == golDto.JOId);

                    // Send email
                    string emailBody = $@"
                        <p>Dear {user.FullName},</p>
                        <p>Your updated offer letter for <b>{job.Title}</b> has been attached.</p>
                        <p>Joining Date: <b>{golDto.JoiningDate:dd MMM yyyy}</b></p>
                        <p>Best Regards,<br/>XYZ Pvt Ltd</p>";

                    var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "User_Upload_OfferLetters", storedFileName);

                    await emailService.SendEmailWithAttachment(user.Email, "Updated Offer Letter", emailBody, fullPath);

                    await dbContext.SaveChangesAsync();
                    return Ok("Offer letter updated & re-sent successfully.");

                case "Hold":
                    if (offer.JobApplication.OverallStatus != "Hold")
                    {
                        offer.JobApplication.HoldOverallStatus = offer.JobApplication.OverallStatus;
                    }

                    offer.OfferLetterStatus = "Hold";
                    offer.JobApplication.OverallStatus = "Hold";

                    dbContext.JobApplications.Update(offer.JobApplication);
                    await dbContext.SaveChangesAsync();
                    return Ok("Offer letter moved to Hold successfully.");


                default:
                    return BadRequest("Invalid OfferLetterStatus value.");
            }
        }

        // Delete but insted Hold 
        [HttpPut("hold/{id:guid}")]
        public async Task<IActionResult> MoveOfferLetterToHold(Guid id)
        {
            var offer = await dbContext.OfferLetters
                .Include(o => o.JobApplication)
                .FirstOrDefaultAsync(o => o.OLId == id);

            if (offer == null)
                return NotFound("Offer letter not found.");

            // Save previous status if not already Hold
            if (offer.JobApplication.OverallStatus != "Hold")
            {
                offer.JobApplication.HoldOverallStatus = offer.JobApplication.OverallStatus;
            }

            offer.OfferLetterStatus = "Hold";
            offer.JobApplication.OverallStatus = "Hold";

            dbContext.JobApplications.Update(offer.JobApplication);
            await dbContext.SaveChangesAsync();

            return Ok("Offer letter moved to Hold successfully.");
        }

        // Fetch candidate only for assign HR
        [Authorize(Roles = "HR")]
        [HttpGet("hr")]
        public async Task<IActionResult> GetCandidatesAssignedToHR()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found.");
            }

            var userId = Guid.Parse(userIdClaim);

            // Get HR user email
            var hrUser = await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (hrUser == null)
            {
                return Unauthorized("HR user not found.");
            }

            var hrEmail = hrUser.Email;

            // Get all JAIds assigned to this HR from HRInterview table
            var assignedJAIds = await dbContext.HRInterviews
                .Where(h => h.InterviewerEmail == hrEmail)
                .Select(h => h.JAId)
                .Distinct()
                .ToListAsync();

            // Fetch full candidate details from JobApplication
            var baseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";

            var list = await dbContext.JobApplications
                .Where(j => assignedJAIds.Contains(j.JAId))
                .Select(j => new
                {
                    jaId = j.JAId,
                    joId = j.JOId,
                    userId = j.UserId,
                    overallStatus = j.OverallStatus,
                    rejectionStage = j.RejectionStage,
                    offerLetterStatus = dbContext.OfferLetters
                        .Where(o => o.JAId == j.JAId)
                        .OrderByDescending(o => o.CreatedAt)
                        .Select(o => o.OfferLetterStatus)
                        .FirstOrDefault(),
                    fullName = j.User.FullName,
                    email = j.User.Email,
                    title = j.JobOpening.Title,
                    photo = !string.IsNullOrEmpty(j.User.Photo) ? baseUrl + j.User.Photo : null
                })
                .ToListAsync();

            return Ok(list);
        }
    }
}
