using Microsoft.AspNetCore.Authorization;
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
    public class DocumentListController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public DocumentListController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        // Add and Update Document
        [Authorize(Roles = "Admin,Candidate")]
        [HttpPost]
        public async Task<IActionResult> AddAndUpdateDocments([FromForm] DocumentListDto dto, [FromForm] IFormFile? AadharFile, [FromForm] IFormFile? PANFile, [FromForm] IFormFile? ExperienceFile)                                           
        {
            // Model Validation
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found.");
            }

            var userId = Guid.Parse(userIdClaim);

            bool isCandidate = User.IsInRole("Candidate");
            dto.UserId = userId;
            var existing = await dbContext.DocumentLists
            .FirstOrDefaultAsync(d => d.UserId == dto.UserId && d.JAId == dto.JAId);

            string? storedAadharName = existing?.AadharCard;
            string? storedPANName = existing?.PANCard;
            string? storedExpName = existing?.ExperienceLetter;

            // Aadhar card upload
            if (AadharFile != null && AadharFile.Length > 0)
            {
                string aadharExt = Path.GetExtension(AadharFile.FileName).ToLowerInvariant();
                if (aadharExt != ".pdf")
                {
                    return BadRequest("Only PDF allowed for Aadhar Card.");
                }

                if (AadharFile.Length > 5 * 1024 * 1024)
                {
                    return BadRequest("Aadhar Card max allowed size is 5MB.");
                }

                var aadharUploads = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "User_Upload_Aadhar");
                Directory.CreateDirectory(aadharUploads);

                if (!string.IsNullOrWhiteSpace(storedAadharName))
                {
                    var oldPath = Path.Combine(aadharUploads, storedAadharName);
                    if (System.IO.File.Exists(oldPath))
                    {
                        System.IO.File.Delete(oldPath);
                    }
                }

                storedAadharName = $"{Guid.NewGuid():N}-{AadharFile.FileName}";
                var fullAadharPath = Path.Combine(aadharUploads, storedAadharName);

                using (var fs = new FileStream(fullAadharPath, FileMode.Create))
                {
                    await AadharFile.CopyToAsync(fs);
                }
            }
            else if (existing == null)
            {
                return BadRequest("Aadhar Card is required for new upload.");
            }

            // PAN card upload
            if (PANFile != null && PANFile.Length > 0)
            {
                string panExt = Path.GetExtension(PANFile.FileName).ToLowerInvariant();
                if (panExt != ".pdf")
                {
                    return BadRequest("Only PDF allowed for PAN Card.");
                }

                if (PANFile.Length > 5 * 1024 * 1024)
                {
                    return BadRequest("PAN Card max allowed size is 5MB.");
                }

                var panUploads = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "User_Upload_Pan");
                Directory.CreateDirectory(panUploads);

                if (!string.IsNullOrWhiteSpace(storedPANName))
                {
                    var oldPath = Path.Combine(panUploads, storedPANName);
                    if (System.IO.File.Exists(oldPath))
                    {
                        System.IO.File.Delete(oldPath);
                    }
                }

                storedPANName = $"{Guid.NewGuid():N}-{PANFile.FileName}";
                var fullPanPath = Path.Combine(panUploads, storedPANName);

                using (var fs = new FileStream(fullPanPath, FileMode.Create))
                {
                    await PANFile.CopyToAsync(fs);
                }
            }
            else if (existing == null)
            {
                return BadRequest("PAN Card is required for new upload.");
            }


            // Experience letter upload
            if (ExperienceFile != null && ExperienceFile.Length > 0)
            {
                string expExt = Path.GetExtension(ExperienceFile.FileName).ToLowerInvariant();
                string[] allowed = [".pdf", ".doc", ".docx"];

                if (!allowed.Contains(expExt))
                {
                    return BadRequest("Only PDF, DOC, DOCX allowed for Experience Letter.");
                }

                if (ExperienceFile.Length > 10 * 1024 * 1024)
                {
                    return BadRequest("Experience Letter max allowed size is 10MB.");
                }

                var expUploads = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "User_Upload_Experience");
                Directory.CreateDirectory(expUploads);

                if (!string.IsNullOrWhiteSpace(storedExpName))
                {
                    var oldPath = Path.Combine(expUploads, storedExpName);
                    if (System.IO.File.Exists(oldPath))
                    {
                        System.IO.File.Delete(oldPath);
                    }
                }

                storedExpName = $"{Guid.NewGuid():N}-{ExperienceFile.FileName}";
                var fullExpPath = Path.Combine(expUploads, storedExpName);

                using (var fs = new FileStream(fullExpPath, FileMode.Create))
                {
                    await ExperienceFile.CopyToAsync(fs);
                }
            }

            if (existing == null)
            {
                var doc = new DocumentList
                {
                    UserId = userId,
                    JOId = dto.JOId,
                    JAId = dto.JAId,
                    BankAccNo = dto.BankAccNo,
                    BankIFSC = dto.BankIFSC,
                    BankName = dto.BankName,
                    AadharCard = storedAadharName,
                    PANCard = storedPANName,
                    ExperienceLetter = storedExpName
                };

                await dbContext.DocumentLists.AddAsync(doc);
            }
            else
            {
                existing.BankAccNo = dto.BankAccNo;
                existing.BankIFSC = dto.BankIFSC;
                existing.BankName = dto.BankName;
                existing.AadharCard = storedAadharName;
                existing.PANCard = storedPANName;
                existing.ExperienceLetter = storedExpName;
                existing.UpdatedAt = DateTime.UtcNow;
            }

            var jobApp = await dbContext.JobApplications.FirstOrDefaultAsync(j => j.JAId == dto.JAId);
            if (jobApp != null && jobApp.OverallStatus == "Document Pending")
            {
                jobApp.OverallStatus = "Offer Letter";
            }

            await dbContext.SaveChangesAsync();

            return Ok("Documents uploaded successfully.");
        }

        // Get pending candidates for admin
        [Authorize(Roles = "Admin")]
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingForAdmin()
        {
            var result = await dbContext.JobApplications
                .AsNoTracking()
                .Where(ja => ja.OverallStatus == "Document Pending")
                .Select(ja => new
                {
                    jaId = ja.JAId,
                    joId = ja.JOId,
                    userId = ja.UserId,
                    appliedDate = ja.CreatedAt,
                    overallStatus = ja.OverallStatus,
                    photo = ja.User.Photo,
                    fullName = ja.User.FullName,
                    email = ja.User.Email,
                    title = ja.JobOpening.Title
                })
                .ToListAsync();

            return Ok(result);
        }

        // Get Document list by ID
        [Authorize(Roles = "Admin,Candidate")]
        [HttpGet("{jaId:guid}")]
        public async Task<IActionResult> GetDocumentListByJAId(Guid jaId)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found.");
            }

            var userId = Guid.Parse(userIdClaim);
            bool isCandidate = User.IsInRole("Candidate");
            bool isAdmin = User.IsInRole("Admin");

            var doc = await dbContext.DocumentLists
                .Where(d => d.JAId == jaId)
                .Select(d => new
                {
                    userId = d.UserId,
                    joId = d.JOId,
                    jaId = d.JAId,
                    bankAccNo = d.BankAccNo,
                    bankIFSC = d.BankIFSC,
                    bankName = d.BankName,
                    aadharCard = d.AadharCard,
                    panCard = d.PANCard,
                    experienceLetter = d.ExperienceLetter
                })
                .FirstOrDefaultAsync();

            // If no record found:
            if (doc == null)
            {
                return NotFound("No document data found for this Job Application.");
            }

            // Candidate should only be able to fetch their own data
            if (isCandidate && doc.userId != userId)
            {
                return StatusCode(403, "Access Denied");
            }

            return Ok(doc);
        }

        // Get all documents list 
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllDocuments()
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";

            var docs = await dbContext.DocumentLists
                .Select(d => new
                {
                    d.DLId,
                    Photo = !string.IsNullOrEmpty(d.User.Photo) ? baseUrl + d.User.Photo : null,
                    d.User.FullName,
                    d.User.Email,
                    d.JobOpening.Title,
                    d.JobApplication.JAId,
                })
                .ToListAsync();

            return Ok(docs);
        }
    }
}
