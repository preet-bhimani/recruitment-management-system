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
    public class WalkInDriveController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public WalkInDriveController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // Add walk in drive
        [Authorize(Roles = "Admin,Recruiter")]
        [HttpPost]
        public async Task<IActionResult> AddWalkInDrive(WalkInDriveDto walkDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }
            var userId = Guid.Parse(userIdClaim);

            if (walkDto.DriveDate < DateOnly.FromDateTime(DateTime.UtcNow))
            {
                return BadRequest("Walk In Drive date cannot be in the past");
            }

            var jobExists = await dbContext.JobOpenings.AnyAsync(j => j.JOId == walkDto.JOId && j.Status == "Open");
            if (!jobExists)
            {
                return BadRequest("Job Opening not found");
            }

            var walk = new WalkInDrive
            {
                Location = walkDto.Location,
                JOId = walkDto.JOId,
                DriveDate = walkDto.DriveDate,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            dbContext.WalkInDrives.Add(walk);
            await dbContext.SaveChangesAsync();

            return Ok("Walk In Drive created successfully");
        }

        // Fetch all walk in drive
        [Authorize(Roles = "Admin,Recruiter,HR,Viewer")]
        [HttpGet]
        public async Task<IActionResult> GetAllWalkInDrives()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }
            var userId = Guid.Parse(userIdClaim);

            var drives = await dbContext.WalkInDrives
                .Include(w => w.JobOpening)
                .Select(w => new
                {
                w.WalkId,
                w.Location,
                w.DriveDate,
                w.IsActive,
                w.JOId,
                Title = w.JobOpening.Title
                })
                .ToListAsync();

            return Ok(drives);
        }

        // Get Job opening for schedule walk in drive
        [Authorize(Roles = "Admin,Recruiter")]
        [HttpGet("add-walk")]
        public async Task<IActionResult> GetPendingWalkInDrive()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }

            var jobs = await dbContext.JobOpenings
                .Where(j => j.Status == "Open")
                .Select(j => new
                {
                    j.JOId,
                    j.Title,
                    j.Location,
                    j.JobType,
                    j.Experience,
                })
                .ToListAsync();

            return Ok(jobs);
        }

        // get walk in drive by ID
        [Authorize(Roles = "Admin,Viewer,Recruiter")]
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetWalkInDriveByID(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }
            var userId = Guid.Parse(userIdClaim);

            var walk = await dbContext.WalkInDrives
                .Where(w => w.WalkId == id)
                .Include(w => w.JobOpening)
                .Select(w => new
                {
                    w.WalkId,
                    w.Location,
                    w.DriveDate,
                    w.JOId,
                    w.IsActive,
                    w.JobOpening.Title,
                })
                .FirstOrDefaultAsync();

            if (walk == null) 
            {
                return NotFound("WalkInDrive not found");
            }
            return Ok(walk);
        }

        // Get visible walk in drives for candidate
        [Authorize(Roles = "Candidate")]
        [HttpGet("visible/{joId:guid}")]
        public async Task<IActionResult> GetVisibleWalkInDrivesForCandidate(Guid joId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }

            var today = DateOnly.FromDateTime(DateTime.Now);
            var visibleFromDays = 1;

            var drives = await dbContext.WalkInDrives
                .Where(w =>
                    w.JOId == joId &&
                    w.IsActive &&
                    w.DriveDate >= today &&
                    w.DriveDate <= today.AddDays(visibleFromDays)
                )
                .Select(w => new
                {
                    w.WalkId,
                    w.Location,
                    w.DriveDate
                })
                .ToListAsync();

            return Ok(drives);
        }

        // Update walk in drive
        [Authorize(Roles = "Admin,Recruiter")]
        [HttpPut("update/{id:guid}")]
        public async Task<IActionResult> UpdateWalkInDrive(Guid id, WalkInDriveDto walkdto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }
            var userId = Guid.Parse(userIdClaim);

            var walk = await dbContext.WalkInDrives.FindAsync(id);
            if (walk == null)
                return NotFound("Walk In Drive not found");

            walk.Location = walkdto.Location;
            walk.DriveDate = walkdto.DriveDate;
            walk.IsActive = walkdto.IsActive;
            walk.UpdatedAt = DateTime.UtcNow;

            await dbContext.SaveChangesAsync();
            return Ok("Walk In Drive updated successfully");
        }

        // Inactive the walk in drive
        [Authorize(Roles = "Admin,Recruiter")]
        [HttpDelete("delete/{id:guid}")]
        public async Task<IActionResult> HoldWalkInDriveById(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }
            var userId = Guid.Parse(userIdClaim);

            var walk = await dbContext.WalkInDrives.FindAsync(id);

            if(walk == null)
            {
                return NotFound("Walk in Drive not found");
            }

            if(!walk.IsActive)
            {
                return BadRequest("Walk in Drive is already inactive");
            }

            walk.IsActive = false;
            walk.UpdatedAt = DateTime.UtcNow;
            
            await dbContext.SaveChangesAsync();
            return Ok("Walk in Drive updated successfully");
        }
    }
}
