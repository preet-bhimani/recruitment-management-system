using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Dto;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SelectionController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public SelectionController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // Get all selected candidates details
        [Authorize(Roles = "Admin,Viewer")]
        [HttpGet]
        public async Task<IActionResult> GetAllSelectedCandidateList()
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";

            var sel = await dbContext.Selections
                .Select(s => new
                {
                    s.SelectionId,
                    s.SelectionStatus,
                    Photo = !string.IsNullOrEmpty(s.User.Photo) ? baseUrl + s.User.Photo : null,
                    s.User.FullName,
                    s.User.Email,
                    s.JobOpening.Title,
                })
                .ToListAsync();

            return Ok(sel);
        }

        // Get candidate from its Id
        [Authorize(Roles = "Admin,Viewer")]
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetSelectedCandidateById(Guid id)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}/Uploads/";

            var sel = await dbContext.Selections
                .Where(s => s.SelectionId == id)
                .Include(s => s.User)
                .Include(s => s.JobOpening)
                .Include(s => s.OfferLetter)
                .Select(s => new
                {
                    s.SelectionId,
                    s.SelectionStatus,
                    s.User.FullName,
                    s.User.Email,
                    s.JobOpening.Title,
                    JobType = s.OfferLetter.TemplateType,
                    s.OfferLetter.OfferLetterFilePath,
                    Photo = s.User.Photo != null
                    ? baseUrl + "User_Upload_Photos/" + s.User.Photo
                    : null,

                    OfferLetter = s.OfferLetter.OfferLetterFilePath != null
                    ? baseUrl + "User_Upload_OfferLetters/" + s.OfferLetter.OfferLetterFilePath
                    : null,
                })
                .FirstOrDefaultAsync();

            if (sel == null)
            {
                return NotFound("Selected candidate not found");
            }

            return Ok(sel);
        }

        // Update Selection
        [Authorize(Roles = "Admin")]
        [HttpPut("update/{id:guid}")]
        public async Task<IActionResult> UpdateSelectionStatus(Guid id, [FromBody] UpdateSelectionDto usDto)
        {
            // Model Validation
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var selection = await dbContext.Selections
                .Include(s => s.JobApplication)
                .FirstOrDefaultAsync(s => s.SelectionId == id);

            if (selection == null)
            {
                return NotFound("Selection not found.");
            }

            var newStatus = usDto.SelectionStatus;

            // Change Status
            switch (newStatus)
            {
                // If Status is joined
                case "Joined":
                    selection.SelectionStatus = "Joined";
                    selection.UpdatedAt = DateTime.UtcNow;

                    // Update JobApplication overall status and clear hold 
                    if (selection.JobApplication != null)
                    {
                        selection.JobApplication.OverallStatus = "Joined";
                        selection.JobApplication.HoldOverallStatus = null;
                    }
                    break;

                // If Status is Not Joined
                case "Not Joined":
                    selection.SelectionStatus = "Not Joined";
                    selection.UpdatedAt = DateTime.UtcNow;

                    if (selection.JobApplication != null)
                    {
                        // Map Not Joined to Rejected per your rule
                        selection.JobApplication.OverallStatus = "Rejected";
                        selection.JobApplication.HoldOverallStatus = null;
                    }
                    break;

                // If Status is Hold
                case "Hold":
                    // Save previous overall if not already Hold
                    if (selection.JobApplication != null)
                    {
                        if (selection.JobApplication.OverallStatus != "Hold")
                        {
                            selection.JobApplication.HoldOverallStatus = selection.JobApplication.OverallStatus;
                        }
                        selection.JobApplication.OverallStatus = "Hold";
                    }

                    selection.SelectionStatus = "Hold";
                    selection.UpdatedAt = DateTime.UtcNow;
                    break;

                default:
                    return BadRequest("Invalid SelectionStatus value");
            }

            // Save changes
            dbContext.Selections.Update(selection);
            if (selection.JobApplication != null)
            {
                dbContext.JobApplications.Update(selection.JobApplication);
            }

            await dbContext.SaveChangesAsync();

            return Ok("Selection Updated Sucessfully");
        }

        // Delete or Hold status
        [Authorize(Roles = "Admin")]
        [HttpPut("hold/{id:guid}")]
        public async Task<IActionResult> MoveSelectionToHold(Guid id)
        {
            var selection = await dbContext.Selections
                .Include(s => s.JobApplication)
                .FirstOrDefaultAsync(s => s.SelectionId == id);

            if (selection == null)
            {
                return NotFound("Selection not found");
            }

            // Save current status to HoldOverallStatus
            if (selection.JobApplication.OverallStatus != "Hold")
            {
                selection.JobApplication.HoldOverallStatus = selection.JobApplication.OverallStatus;
            }

            // Apply Hold status to SelectionStatus and OverallStatus
            selection.SelectionStatus = "Hold";
            selection.JobApplication.OverallStatus = "Hold";
            selection.UpdatedAt = DateTime.UtcNow;

            dbContext.Selections.Update(selection);
            dbContext.JobApplications.Update(selection.JobApplication);
            await dbContext.SaveChangesAsync();

            return Ok("Selection moved to Hold successfully");
        }
    }
}
