using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Dto;
using server.Models.Entities;
using System.Security.Claims;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobApplicationController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public JobApplicationController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddJobApplication(JobApplicationDto jaDto)
        {
            // Model Validation
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }

            // If User is not exist
            var userExist = await dbContext.Users.AnyAsync(u => u.UserId == jaDto.UserId);
            if (!userExist)
            {
                return NotFound("User is not found");
            }

            // If Job is not exist
            var jobOpeningExist = await dbContext.JobOpenings.AnyAsync(j => j.JOId == jaDto.JOId);
            if (!jobOpeningExist)
            {
                return NotFound("Job Opening is not found");
            }

            // If Job status is not open then do not allow to apply
            var job = await dbContext.JobOpenings.FirstAsync(j => j.JOId == jaDto.JOId);

            if (job.Status != "Open")
            {
                return BadRequest("Job opening is not open for applications");
            }

            // If Candidate have not upload resume and try apply jobs
            var resumeExist = await dbContext.Users.AnyAsync(r => r.UserId == jaDto.UserId && !string.IsNullOrEmpty(r.Resume));
            if (!resumeExist)
            {
                return BadRequest("Upload your resume before appling");
            }

            // If candidate already applied in this job
            var alreadyApplied = await dbContext.JobApplications.AnyAsync(j => j.UserId == jaDto.UserId && j.JOId == jaDto.JOId);
            if (alreadyApplied)
            {
                return BadRequest("You already have applied for this job");
            }

            // If candidate added CDID value at that time check if exist or not
            if (jaDto.CDID.HasValue)
            {
                var campusExists = await dbContext.CampusDrives
                    .FirstOrDefaultAsync(cd => cd.CDID == jaDto.CDID && cd.IsActive);

                if (campusExists == null)
                {
                    return BadRequest("Invalid Campus Drive ID");
                }

                if (campusExists.JOId != jaDto.JOId)
                {
                    return BadRequest("Campus Drive does not belong to this job opening");
                }
            }

            // If candidate added WalkId value at that time check if exist or not
            if (jaDto.WalkId.HasValue)
            {
                var walkInExists = await dbContext.WalkInDrives
                    .FirstOrDefaultAsync(w => w.WalkId == jaDto.WalkId && w.IsActive);

                if (walkInExists == null)
                {
                    return BadRequest("Invalid Walk-In Drive ID");
                }

                if (walkInExists.JOId != jaDto.JOId)
                {
                    return BadRequest("Walk-In Drive does not belong to this job opening");
                }
            }

            // Candidate only select walk in drive or campus drive
            if (jaDto.CDID.HasValue && jaDto.WalkId.HasValue)
            {
                return BadRequest("Application can be from either Campus Drive or Walk In Drive not both");
            }

            // Fetch today date
            var today = DateOnly.FromDateTime(DateTime.Now);
            var hasActiveCampus = await dbContext.CampusDrives
                .AnyAsync(cd => cd.JOId == jaDto.JOId && cd.IsActive && cd.DriveDate >= today);

            var hasActiveWalkIn = await dbContext.WalkInDrives
                .AnyAsync(w => w.JOId == jaDto.JOId && w.IsActive && w.DriveDate >= today);

            // If no walk in drive or campus drive for job
            if (!hasActiveCampus && !hasActiveWalkIn)
            {
                return BadRequest("No active Campus or Walk In drive available for this job");
            }

            // If the campus drive date is gone then not allowed to apply.
            if (jaDto.CDID.HasValue)
            {
                var cdDate = await dbContext.CampusDrives
                    .Where(cd => cd.CDID == jaDto.CDID)
                    .Select(cd => cd.DriveDate)
                    .FirstAsync();

                if (cdDate < today)
                    return BadRequest("Campus Drive date has passed");
            }

            // If the walk in drive date is gone then not allowed to apply
            if (jaDto.WalkId.HasValue)
            {
                var wiDate = await dbContext.WalkInDrives
                    .Where(w => w.WalkId == jaDto.WalkId)
                    .Select(w => w.DriveDate)
                    .FirstAsync();

                if (wiDate < today)
                    return BadRequest("Walk-In Drive date has passed");
            }

            var jobapplication = new JobApplication
            {
                UserId = jaDto.UserId,
                JOId = jaDto.JOId,
                ExamDate = jaDto.ExamDate,
                ExamResult = jaDto.ExamResult,
                Feedback = jaDto.Feedback,
                Status = jaDto.Status,
                OverallStatus = jaDto.OverallStatus,
                CDID = jaDto.CDID,
                WalkId = jaDto.WalkId,
                CreatedAt = DateTime.UtcNow
            };

            dbContext.JobApplications.Add(jobapplication);
            await dbContext.SaveChangesAsync();

            return Ok("Job application submitted successfully");
        }

        // Fetch all Job applications
        [Authorize(Roles = "Admin,Recruiter,Reviewer,HR,Interviewer,Viewer,Candidate")]
        [HttpGet]
        public async Task<IActionResult> GetAllJobApplications()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }

            var baseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";
            var baseUrlResume = $"{Request.Scheme}://{Request.Host}/User_Upload_Resumes/";

            var jobapplication = await dbContext.JobApplications
                .Include(ja => ja.User)
                .Include(ja => ja.JobOpening)
                .Select(ja => new
                {
                    ja.JAId,
                    ja.UserId,
                    ja.JOId,
                    ja.ExamDate,
                    ja.ExamResult,
                    ja.Feedback,
                    ja.RejectionStage,
                    AppliedDate = ja.CreatedAt.ToString("yyyy-MM-dd"),
                    ja.OverallStatus,
                    ja.HoldOverallStatus,
                    ja.Status,
                    Photo = !string.IsNullOrEmpty(ja.User.Photo) ? baseUrl + ja.User.Photo : null,
                    Resume = !string.IsNullOrEmpty(ja.User.Resume) ? baseUrlResume + ja.User.Resume : null,
                    ja.User.FullName,
                    ja.User.Email,
                    ja.User.PhoneNumber,
                    ja.JobOpening.Title,
                })
                .ToListAsync();

            return Ok(jobapplication);
        }

        // Get Job Application by Id
        [Authorize(Roles = "Admin,Recruiter")]
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetJobApplicationById(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }

            var baseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";
            var baseUrlResume = $"{Request.Scheme}://{Request.Host}/User_Upload_Resumes/";

            var jobapp = await dbContext.JobApplications
                .Where(ja => ja.JAId == id)
                .Include(ja => ja.User)
                .Include(ja => ja.JobOpening)
                .Select(ja => new
                {
                    ja.JAId,
                    ja.UserId,
                    ja.JOId,
                    ja.ExamDate,
                    ja.ExamResult,
                    AppliedDate = ja.CreatedAt.Date,
                    ja.Status,
                    ja.OverallStatus,
                    ja.Feedback,
                    ja.User.Email,
                    ja.User.FullName,
                    Photo = !string.IsNullOrEmpty(ja.User.Photo) ? baseUrl + ja.User.Photo : null,
                    Resume = !string.IsNullOrEmpty(ja.User.Resume) ? baseUrlResume + ja.User.Resume : null,
                    ja.JobOpening.Title
                })
                .FirstOrDefaultAsync();

            if (jobapp == null)
            {
                return NotFound("Job application not found");
            }

            return Ok(jobapp);
        }

        // Show Options for Apply
        [HttpGet("apply-options/{joId:guid}")]
        public async Task<IActionResult> GetApplyOptions(Guid joId)
        {
            // Check job exists & open
            var job = await dbContext.JobOpenings.FirstOrDefaultAsync(j => j.JOId == joId && j.Status == "Open");

            if (job == null)
            {
                return NotFound("Job opening not available");
            }

            var today = DateOnly.FromDateTime(DateTime.Now);

            // Campus Drives
            var campusDrives = await dbContext.CampusDrives
                .Where(cd =>
                    cd.JOId == joId &&
                    cd.IsActive &&
                    cd.DriveDate >= today)
                .Select(cd => new
                {
                    cd.CDID,
                    cd.UniversityName,
                    cd.DriveDate
                })
                .ToListAsync();

            // Walk-In Drives
            var walkInDrives = await dbContext.WalkInDrives
                .Where(w =>
                    w.JOId == joId &&
                    w.IsActive &&
                    w.DriveDate >= today)
                .Select(w => new
                {
                    w.WalkId,
                    w.Location,
                    w.DriveDate
                })
                .ToListAsync();

            return Ok(new
            {
                allowDirectApply = true,
                campusDrives,
                walkInDrives
            });
        }

        // Update job application based on its status
        [Authorize(Roles = "Admin,Recruiter")]
        [HttpPut("update/{id:guid}")]
        public async Task<IActionResult> UpdateJobApplicationBasedItsStatus(Guid id, JobApplicationDto jaDto)
        {
            // Model Validation
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }

            var jobapp = await dbContext.JobApplications.FindAsync(id);
            if( jobapp == null )
            {
                return NotFound("Job application not found");
            }

            // Fetch today date for comapre exam date
            var today = DateOnly.FromDateTime(DateTime.Now);

            JobApplicationDto SendDto(JobApplication j) => new()
            {
                UserId = j.UserId,
                JOId = j.JOId,
                ExamDate = j.ExamDate,
                ExamResult = j.ExamResult,
                Feedback = j.Feedback,
                Status = j.Status,
                OverallStatus = j.OverallStatus,
                HoldOverallStatus = j.HoldOverallStatus
            };

            // Hold Logic
            if(jaDto.Status == "Hold")
            {
                if(jobapp.Status == "Hold")
                {
                    return BadRequest("This is already in Hold");
                }

                // Remember Current stage and keep evrything as it is
                jobapp.HoldOverallStatus = jobapp.OverallStatus;
                jobapp.Status = "Hold";
                jobapp.OverallStatus = "Hold";
                jobapp.UpdatedAt = DateTime.UtcNow;

                await dbContext.SaveChangesAsync();
                return Ok(SendDto(jobapp));
            }

            // Convert hold to again previous overallstatus
            if(jobapp.Status == "Hold" && jaDto.Status != "Hold")
            {
                jobapp.OverallStatus = jobapp.HoldOverallStatus;
                jobapp.HoldOverallStatus = null;
            }

            // Main logic for status
            switch (jaDto.Status) 
            {
                    case "Applied":
                    {
                        if(jaDto.ExamDate == null && !string.IsNullOrEmpty(jaDto.ExamResult))
                        {
                            return BadRequest("Exam result require exam first");
                        }

                        if(jaDto.ExamDate == null)
                        {
                            jobapp.Status = "Applied";
                            jobapp.OverallStatus = "Applied";
                            jobapp.ExamDate = null;
                            jobapp.ExamResult = null;
                        }
                        else
                        {
                            jobapp.Status = "Exam";
                            jobapp.OverallStatus = "Exam";
                            jobapp.ExamDate = jaDto.ExamDate;
                            jobapp.ExamResult = null;
                        }
                        jobapp.RejectionStage = null;
                        break;
                    }

                    case "Exam":
                    {
                        if(jaDto.ExamDate == null)
                        {
                            return BadRequest("Exam date is require");
                        }

                        // Only allow result for exam date is in past or today
                        if (!string.IsNullOrEmpty(jaDto.ExamResult) && jaDto.ExamDate.Value > today)
                        {
                            return BadRequest("Result only allowed on or after exam date.");
                        }

                        // If only set exam
                        if(string.IsNullOrEmpty(jaDto.ExamResult))
                        {
                            jobapp.Status = "Exam";
                            jobapp.OverallStatus = "Exam";
                            jobapp.ExamDate = jaDto.ExamDate;
                            jobapp.ExamResult = null;
                        }
                        else if (jaDto.ExamResult.Equals("Pass"))
                        {
                            jobapp.ExamDate = jaDto.ExamDate;
                            jobapp.ExamResult = "Pass";
                            jobapp.Status = "Shortlisted";
                            jobapp.OverallStatus = "Technical Interview";
                        }
                        else if (jaDto.ExamResult.Equals("Fail"))
                        {
                            jobapp.ExamDate = jaDto.ExamDate;
                            jobapp.ExamResult = "Fail";
                            jobapp.Status = "Rejected";
                            jobapp.OverallStatus = "Rejected";
                            jobapp.RejectionStage = "Exam";
                        }
                        else
                        {
                            return BadRequest("Invalid exam result.");
                        }

                        if (jaDto.ExamResult != "Fail")
                        {
                            jobapp.RejectionStage = null;
                        }

                        break;
                    }

                    case "Shortlisted":
                    {
                        // Get exam date and exam result if any have
                        var effectiveExamDate = jaDto.ExamDate ?? jobapp.ExamDate;
                        var effectiveExamResult = jaDto.ExamResult ?? jobapp.ExamResult;

                        // Check if exam date is exist but exam result not found 
                        if (effectiveExamDate is not null && string.IsNullOrEmpty(effectiveExamResult))
                        {
                            return BadRequest("Exam result required to shortlist.");
                        }

                        // Shortlist without exam
                        jobapp.Status = "Shortlisted";
                        jobapp.OverallStatus = "Technical Interview";

                        // Check if exam date find but exam result must be pass
                        if (jaDto.ExamDate is not null && !string.IsNullOrEmpty(jaDto.ExamResult))
                        {
                            // Check exam date must be after or on today and exam result must be pass
                            if (jaDto.ExamDate.Value > today)
                            {
                                return BadRequest("Result only allowed on or after exam date.");
                            }
                            if (jaDto.ExamResult != "Pass")
                            {
                                return BadRequest("Exam must be Pass to shortlist.");
                            }

                            jobapp.ExamDate = jaDto.ExamDate;
                            jobapp.ExamResult = "Pass";
                        }

                        jobapp.RejectionStage = null;
                        break;
                    }

                    case "Rejected":
                    {
                        var effectiveExamDate = jaDto.ExamDate ?? jobapp.ExamDate;
                        var effectiveExamResult = jaDto.ExamResult ?? jobapp.ExamResult;

                        // Check if exam is scheduled but result is pending
                        if (effectiveExamDate is not null && string.IsNullOrEmpty(effectiveExamResult))
                        {
                            return BadRequest("Exam result required to reject when exam exists.");
                        }

                        // Check if client sends date and result validate timing
                        if (jaDto.ExamDate is not null && !string.IsNullOrEmpty(jaDto.ExamResult) && jaDto.ExamDate.Value > today)
                        {
                            return BadRequest("Result only allowed on or after exam date.");
                        }
                        // Accept direct reject
                        jobapp.Status = "Rejected";
                        jobapp.OverallStatus = "Rejected";
                        jobapp.RejectionStage = (jaDto.ExamResult == "Fail") ? "Exam" : "Reviewer";

                        // Check if both date and result is not null then result must be fail
                        if (jaDto.ExamDate is not null && !string.IsNullOrEmpty(jaDto.ExamResult))
                        {
                            // Exam result must be fail for reject
                            if (jaDto.ExamResult != "Fail")
                            {
                                return BadRequest("Exam result must be Fail for reject with exam.");
                            }

                            jobapp.ExamDate = jaDto.ExamDate;
                            jobapp.ExamResult = "Fail";
                        }

                        break;
                    }
            }
            jobapp.Feedback = jaDto.Feedback;
            jobapp.UpdatedAt = DateTime.UtcNow;
            await dbContext.SaveChangesAsync();

            return Ok(SendDto(jobapp));
        }
    }
}
