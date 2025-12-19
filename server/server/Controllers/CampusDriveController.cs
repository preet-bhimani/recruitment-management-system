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
    public class CampusDriveController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public CampusDriveController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // Add campus drive
        [HttpPost]
        public async Task<IActionResult> AddCampusDrive(CampusDriveDto cdDto)
        {
            // Model state validation
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Drive date cannot be in the past
            if (cdDto.DriveDate < DateOnly.FromDateTime(DateTime.UtcNow))
            {
                return BadRequest("Campus drive date cannot be in the past");
            }

            // Check if JobOpening exists
            var jobOpening = await dbContext.JobOpenings.FirstOrDefaultAsync(j => j.JOId == cdDto.JOId && j.Status == "Open");
            if (jobOpening == null)
                return NotFound("Job opening not found");

            var campusDrive = new CampusDrive
            {
                UniversityName = cdDto.UniversityName,
                JOId = cdDto.JOId,
                JobOpening = jobOpening,
                DriveDate = cdDto.DriveDate,
                IsActive = cdDto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            await dbContext.CampusDrives.AddAsync(campusDrive);
            await dbContext.SaveChangesAsync();

            return Ok("Campus drive created successfully");
        }

        // Fetch campus drive all along with title
        [HttpGet]
        public async Task<IActionResult> GetAllCampusDrive()
        {
            var campusDrives = await dbContext.CampusDrives
                .Include(cd => cd.JobOpening)
                .Select(cd => new
                {
                    cd.CDID,
                    cd.UniversityName,
                    cd.DriveDate,
                    cd.JOId,
                    cd.IsActive,
                    Title = cd.JobOpening.Title,
                })
                .ToListAsync();

            return Ok(campusDrives);
        }

        // Get campus drive by id
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetCampusDriveById(Guid id)
        {
            var camp = await dbContext.CampusDrives.FindAsync(id);

            if(camp == null)
            {
                return NotFound("Campus drive not found");
            }

            return Ok(camp);
        }

        // Get job opening which is pending to add campus drive
        [HttpGet("add-campus")]
        public async Task<IActionResult> GetPendingJobsCampusDrive()
        {
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

        // Get visible campus drives for candidate
        [HttpGet("visible/{joId:guid}")]
        public async Task<IActionResult> GetVisibleCampusDrivesForCandidate(Guid joId)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var visibleFromDays = 1;

            var drives = await dbContext.CampusDrives
                .Where(cd =>
                    cd.JOId == joId &&
                    cd.IsActive &&
                    cd.DriveDate >= today &&
                    cd.DriveDate <= today.AddDays(visibleFromDays)
                )
                .Select(cd => new
                {
                    cd.CDID,
                    cd.UniversityName,
                    cd.DriveDate
                })
                .ToListAsync();

            return Ok(drives);
        }

        // Update campus drive
        [HttpPut("update/{id:guid}")]
        public async Task<IActionResult> UpdateCampusDrive(CampusDriveDto cdDto, Guid id)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var camp = await dbContext.CampusDrives.FindAsync(id);

            if (camp == null)
            {
                return NotFound("Campus drive not found");
            }

            // Check if JobOpening exists
            var jobOpening = await dbContext.JobOpenings.FirstOrDefaultAsync(j => j.JOId == cdDto.JOId && j.Status == "Open");
            if (jobOpening == null)
                return NotFound("Job opening not found");

            camp.JOId = cdDto.JOId;
            camp.UniversityName = cdDto.UniversityName;
            camp.DriveDate = cdDto.DriveDate;
            camp.UpdatedAt = DateTime.UtcNow;
            camp.IsActive = cdDto.IsActive;

            dbContext.CampusDrives.Update(camp);
            await dbContext.SaveChangesAsync();

            return Ok("Campus drive updated Sucessfully");
        }

        // Delete or Inactive Campus Drive
        [HttpDelete("delete/{id:guid}")]
        public async Task<IActionResult> DeleteCampusDriveById(Guid id)
        {
            var camp = await dbContext.CampusDrives.FindAsync(id);

            // If Campus drive not found
            if (camp == null)
            {
                return NotFound("Campus drive not found");
            }

            // If campus drive is already inactive stage
            if (!camp.IsActive)
            {
                return Conflict("Campus drive is already Inactive");
            }

            camp.IsActive = false;
            camp.UpdatedAt = DateTime.UtcNow;

            await dbContext.SaveChangesAsync();
            return Ok("Campus drive inactive sucessfully");
        }
    }
}
