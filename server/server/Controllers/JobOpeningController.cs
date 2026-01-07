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
    public class JobOpeningController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public JobOpeningController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // Add job opening
        [Authorize(Roles = "Admin,Recruiter")]
        [HttpPost]
        public async Task<IActionResult> AddJobOpening(JobOpeningDto jobDto)
        {
            // Model state validation
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }

            var job = new JobOpening
            {
                Title = jobDto.Title,
                Description = jobDto.Description,
                Qualification = jobDto.Qualification,
                NoOfOpening = jobDto.NoOfOpening,
                RequiredSkills = jobDto.RequiredSkills,
                PreferredSkills = jobDto.PreferredSkills,
                Location = jobDto.Location,
                Comment = jobDto.Comment,
                JobType = jobDto.JobType,
                Experience = jobDto.Experience,
                Status = jobDto.Status,
                CreatedAt = DateTime.UtcNow
            };

            await dbContext.AddAsync(job);
            await dbContext.SaveChangesAsync();
            return Ok(new
            {
                joId = job.JOId,
                message = "Job opening created successfully"
            });
        }

        // Get all Job opening
        [Authorize(Roles ="Admin,Recruiter,Candidate,Viewer")]
        [HttpGet]
        public async Task<IActionResult> GetAllJobOpening()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }

            return Ok(dbContext.JobOpenings.ToList());
        }

        // Get Job opening by Id
        [Authorize(Roles = "Admin,Recruiter,Candidate,Viewer")]
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetJobOpeningById(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }

            var job = await dbContext.JobOpenings.FindAsync(id);

            if (job == null)
            {
                return NotFound("Job Opening not found");
            }

            return Ok(job);
        }

        // Fetch Job Opening only which status is open
        [Authorize(Roles = "Admin,Recruiter,Candidate,Viewer")]
        [HttpGet("jobopen")]
        public async Task<IActionResult> GetJobOpeningStatusOpen()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }

            var job = await dbContext.JobOpenings.Where(j => j.Status == "Open").ToListAsync();

            if(!job.Any())
            {
                return NotFound("No job opening found");
            }

            return Ok(job);
        }

        // Update Job opening
        [Authorize(Roles = "Admin,Recruiter")]
        [HttpPut("update/{id:guid}")]
        public async Task<IActionResult> UpdateJobOpening(JobOpeningDto jobDto, Guid id)
        {
            // Model state validation
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }

            var existingJob = await dbContext.JobOpenings.FindAsync(id);

            if (existingJob == null)
            {
                return NotFound("Job Opening not found");
            }

            existingJob.Title = jobDto.Title;
            existingJob.Description = jobDto.Description;
            existingJob.Qualification = jobDto.Qualification;
            existingJob.NoOfOpening = jobDto.NoOfOpening;
            existingJob.RequiredSkills = jobDto.RequiredSkills;
            existingJob.PreferredSkills = jobDto.PreferredSkills;
            existingJob.Location = jobDto.Location;
            existingJob.Comment = jobDto.Comment;
            existingJob.JobType = jobDto.JobType;
            existingJob.Experience = jobDto.Experience;
            existingJob.Status = jobDto.Status ?? existingJob.Status;
            existingJob.UpdatedAt = DateTime.UtcNow;

            dbContext.JobOpenings.Update(existingJob);
            await dbContext.SaveChangesAsync();

            return Ok(new
            {
                joId = existingJob.JOId,
                message = "Job opening updated successfully"
            });
        }

        // Delete or closed job opening
        [Authorize(Roles = "Admin,Recruiter")]
        [HttpDelete("delete/{id:guid}")]
        public async Task<IActionResult> DeleteJobOpening(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }

            var existingJob = await dbContext.JobOpenings.FindAsync(id);

            if (existingJob == null)
            {
                return NotFound("Job Opening not found");
            }

            // if status is already closed
            if (existingJob.Status == "Closed")
            {
                return Conflict(new
                {
                    joId = existingJob.JOId,
                    message = "Job Opening is already closed"
                });
            }

            existingJob.Status = "Closed";
            existingJob.UpdatedAt = DateTime.UtcNow;

            await dbContext.SaveChangesAsync();

            return Ok(new
            {
                joId = existingJob.JOId,
                message = "Job opening is closed successfully"
            });
        }
    }
}
