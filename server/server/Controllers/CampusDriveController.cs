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

            // Check if JobOpening exists
            var jobOpening = await dbContext.JobOpenings.FindAsync(cdDto.JOId);
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
                    JobTitle = cd.JobOpening.Title,
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

        // Update campus drive
        [HttpPut("update/{id:guid}")]
        public async Task<IActionResult> UpdateCampusDrive(CampusDriveDto cdDto, Guid id)
        {

            // Model state validation
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var camp = await dbContext.CampusDrives.FindAsync(id);

            if (camp == null)
            {
                return NotFound("Campus drive not found");
            }

            // Check if JobOpening exists
            var jobOpening = await dbContext.JobOpenings.FindAsync(cdDto.JOId);
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
