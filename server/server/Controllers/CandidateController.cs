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

        [Authorize]
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
    }
}
