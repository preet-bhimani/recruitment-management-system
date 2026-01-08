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
    public class CandidateController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public CandidateController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // Apply for Job
        [Authorize(Roles ="Candidate")]
        [HttpPost("apply")]
        public async Task<IActionResult> CandidateApplyForJob(JobApplyCandidateDto jaDto)
        {
            // Model Validation
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get UserId from Token not from frontend
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found.");
            }

            var userId = Guid.Parse(userIdClaim);

            // If User is not exist
            var userExist = await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (userExist == null)
            {
                return NotFound("User is not found");
            }

            if (userExist.Role != "Candidate")
            { 
                return Forbid("Only candidates can apply for jobs.");
            }

            // If Job is not exist
            var jobOpeningExist = await dbContext.JobOpenings.AnyAsync(j => j.JOId == jaDto.JOId);
            if (!jobOpeningExist)
            {
                return NotFound("Job Opening is not found");
            }

            // If Candidate have not upload resume and try apply jobs
            if (string.IsNullOrWhiteSpace(userExist.Resume))
            {
                return BadRequest("Upload your resume before applying.");
            }

            // If candidate already applied in this job
            var alreadyApplied = await dbContext.JobApplications.AnyAsync(j => j.UserId == userId && j.JOId == jaDto.JOId);
            if (alreadyApplied)
            {
                return BadRequest("You already have applied for this job");
            }

            var jobapplication = new JobApplication
            {
                UserId = userId,
                JOId = jaDto.JOId,
                CreatedAt = DateTime.UtcNow
            };

            dbContext.JobApplications.Add(jobapplication);
            await dbContext.SaveChangesAsync();

            return Ok("Job application submitted successfully");
        }

        // Get pending document list for candidates
        [Authorize(Roles = "Admin,Candidate")]
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingForCandidate()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found.");
            }
            var userId = Guid.Parse(userIdClaim);

            var result = await dbContext.JobApplications
                .Where(ja => ja.UserId == userId && ja.OverallStatus == "Document Pending")
                .Select(ja => new
                {
                    jaId = ja.JAId,
                    joId = ja.JOId,
                    title = ja.JobOpening.Title
                })
                .ToListAsync();

            return Ok(result);
        }

        // Show notifications
        [Authorize(Roles = "Candidate")]
        [HttpGet("notification")]
        public async Task<IActionResult> ShowNotifications()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found.");
            }

            var userId = Guid.Parse(userIdClaim);

            var jobApplications = await dbContext.JobApplications
            .Where(x => x.UserId == userId)
            .Include(x => x.JobOpening)
            .ToListAsync();

            var notifications = new List<CandidateNotificationDto>();

            // Show details of Job Application
            foreach (var app in jobApplications)
            {
                string jobTitle = app.JobOpening.Title;

                notifications.Add(new CandidateNotificationDto
                {
                    JOId = app.JOId,
                    JobTitle = jobTitle,
                    NotificationType = "Application",
                    Status = app.Status,
                    Date = app.CreatedAt,
                    MeetingLink = null,
                    Feedback = null
                });

                // If exam result released
                if (app.ExamResult != null)
                {
                    notifications.Add(new CandidateNotificationDto
                    {
                        JOId = app.JOId,
                        JobTitle = jobTitle,
                        NotificationType = "Exam",
                        Status = app.ExamResult,
                        Date = app.ExamDate?.ToDateTime(TimeOnly.MinValue) ?? app.CreatedAt,
                        MeetingLink = null,
                        Feedback = app.Feedback,
                        ExamDate = app.ExamDate?.ToString("yyyy-MM-dd")
                    });
                }

                // Show details of Technical Interview
                var techRounds = await dbContext.TechnicalInterviews
                .Where(t => t.JAId == app.JAId)
                .ToListAsync();

                foreach (var round in techRounds)
                {
                    int roundNumber = round.NoOfRound;
                    
                    notifications.Add(new CandidateNotificationDto
                    {
                        JOId = app.JOId,
                        JobTitle = jobTitle,
                        NotificationType = $"Tech Interview Round {roundNumber}",
                        Status = "Scheduled",
                        Date = round.TechDate.ToDateTime(round.TechTime),
                        MeetingLink = round.MeetingLink,
                        Feedback = null,
                        MeetingDate = round.TechDate.ToString("yyyy-MM-dd"),
                        MeetingTime = round.TechTime.ToString("HH:mm")
                    });

                    // When IsClear is not Pending
                    if (round.TechIsClear != "Pending")
                    {
                        notifications.Add(new CandidateNotificationDto
                        {
                            JOId = app.JOId,
                            JobTitle = jobTitle,
                            NotificationType = $"Tech Interview Round {roundNumber}",
                            Status = round.TechIsClear,
                            Date = round.UpdatedAt ?? round.CreatedAt,
                            MeetingLink = null,
                            Feedback = round.TechFeedback,
                            MeetingDate = null,
                            MeetingTime = null
                        });
                    }
                }

                // Show details of HR Interview
                var hr = await dbContext.HRInterviews
                .Where(h => h.JAId == app.JAId)
                .ToListAsync();

                foreach (var h in hr)
                {
                    notifications.Add(new CandidateNotificationDto
                    {
                        JOId = app.JOId,
                        JobTitle = jobTitle,
                        NotificationType = "HR Interview",
                        Status = "Scheduled",
                        Date = h.HRDate.ToDateTime(h.HRTime),
                        MeetingLink = h.MeetingLink,
                        Feedback = null,
                        MeetingDate = h.HRDate.ToString("yyyy-MM-dd"),
                        MeetingTime = h.HRTime.ToString("HH:mm")
                    });

                    // When IsClear is not Pending
                    if (h.HRIsClear != "Pending")
                    {
                        notifications.Add(new CandidateNotificationDto
                        {
                            JOId = app.JOId,
                            JobTitle = jobTitle,
                            NotificationType = "HR Interview",
                            Status = h.HRIsClear,
                            Date = h.UpdatedAt ?? h.CreatedAt,
                            MeetingLink = null,
                            Feedback = h.HRFeedback,
                            MeetingDate = null,
                            MeetingTime = null
                        });
                    }
                }
            }

            var grouped = notifications
            .GroupBy(n => n.JobTitle)
            .ToDictionary(
                g => g.Key,
                g => g.OrderByDescending(n => n.Date).ToList()
            );

            return Ok(grouped);
        }

        // Fetch all previous job that applied
        [Authorize(Roles = "Candidate")]
        [HttpGet("myjobs")]
        public async Task<IActionResult> GetMyJobs()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found.");
            }

            var userId = Guid.Parse(userIdClaim);

            // Get all job application for this userId
            var applications = await dbContext.JobApplications
                .Where(j => j.UserId == userId)
                .Include(j => j.JobOpening)
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();

            // Send result
            var result = applications.Select(app => new
            {
                joId = app.JOId,
                title = app.JobOpening.Title,
                city = app.JobOpening.Location,
                jobType = app.JobOpening.JobType,
                dateApplied = app.CreatedAt.ToString("yyyy-MM-dd"),

                // Status mapping
                status = app.OverallStatus switch
                {
                    "Selected" => "Selected",
                    "Rejected" => "Rejected",
                    _ => "Under Review"
                }
            });

            return Ok(result);
        }
    }
}
