using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Dto;
using server.Models.Entities;

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

        [HttpPost]
        public async Task<IActionResult> AddJobApplication(JobApplicationDto jaDto)
        {
            // Model Validation
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
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

            var jobapplication = new JobApplication
            {
                UserId = jaDto.UserId,
                JOId = jaDto.JOId,
                ExamDate = jaDto.ExamDate,
                ExamResult = jaDto.ExamResult,
                Feedback = jaDto.Feedback,
                Status = jaDto.Status,
                OverallStatus = jaDto.OverallStatus,
                CreatedAt = DateTime.UtcNow
            };

            dbContext.JobApplications.Add(jobapplication);
            await dbContext.SaveChangesAsync();

            return Ok("Job application submitted successfully");
        }

        // Fetch all Job applications
        [HttpGet]
        public async Task<IActionResult> GetAllJobApplications()
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";

            var jobapplication = await dbContext.JobApplications
                .Select(ja => new
                {
                    ja.JAId,
                    AppliedDate = ja.CreatedAt.ToString("yyyy-MM-dd"),
                    ja.OverallStatus,
                    ja.Status,
                    Photo = !string.IsNullOrEmpty(ja.User.Photo) ? baseUrl + ja.User.Photo : null,
                    ja.User.FullName,
                    ja.User.Email,
                    ja.JobOpening.Title,
                })
                .ToListAsync();

            return Ok(jobapplication);
        }

        // Get Job Application by Id
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetJobApplicationById(Guid id)
        {
            var jobapp = await dbContext.JobApplications.FindAsync(id);

            if(jobapp == null)
            {
                return NotFound("Job application not found");
            }

            return Ok(jobapp);
        }

        // Update Job Application
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateJobApplication(JobApplicationDto jaDto, Guid id)
        {
            // Model Validation
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var jobapp = await dbContext.JobApplications.FindAsync(id);

            if (jobapp == null)
            {
                return NotFound("Job application not found");
            }

            // Rule 1: ExamResult updates only allowed if ExamDate is set
            if (!string.IsNullOrEmpty(jaDto.ExamResult) && jaDto.ExamDate == null)
                return BadRequest("Exam Date must be set before setting Exam Result");

            // Rule 2: When ExamDate is set automatically set both Status and OverallStatus to "Exam"
            if (jaDto.ExamDate != null)
            {
                jobapp.Status = "Exam";
                jobapp.OverallStatus = "Exam";
            }

            // Rule 3: When ExamResult is "Fail" both become "Rejected"
            if (jaDto.ExamResult == "Fail")
            {
                jobapp.Status = "Rejected";
                jobapp.OverallStatus = "Rejected";
            }

            // Rule 4: When ExamResult is "Pass" change Status = "Shortlisted", OverallStatus = "Technical Interview"
            else if (jaDto.ExamResult == "Pass")
            {
                jobapp.Status = "Shortlisted";
                jobapp.OverallStatus = "Technical Interview";
            }

            // Rule 5: When Status changes to "Shortlisted" it change OverallStatus = "Technical Interview"
            if (jaDto.Status == "Shortlisted")
                jobapp.OverallStatus = "Technical Interview";

            // Rule 6: If either becomes "Rejected" then both change "Rejected"
            if (jaDto.Status == "Rejected" || jaDto.OverallStatus == "Rejected")
            {
                jobapp.Status = "Rejected";
                jobapp.OverallStatus = "Rejected";
            }

            jobapp.ExamDate = jaDto.ExamDate;
            jobapp.ExamResult = jaDto.ExamResult;
            jobapp.Feedback = jaDto.Feedback;
            jobapp.Status = jaDto.Status ?? jobapp.Status;
            jobapp.OverallStatus = jaDto.OverallStatus ?? jobapp.OverallStatus;
            jobapp.UpdatedAt = DateTime.UtcNow;

            dbContext.JobApplications.Update(jobapp);
            await dbContext.SaveChangesAsync();

            return Ok("Job application updated successfully");
        }
    }
}
