using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Dto;
using server.Models.Entities;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private const long MaxFileBytes = 5 * 1024 * 1024; // 5 MB
        private static readonly string[] AllowedExt = [".jpg", ".jpeg", ".png"];
        public UserController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateUser([FromForm] UserDto userDto, [FromForm] IFormFile? photo, [FromForm] IFormFile? resume)
        {
            // Model state validation
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check if email already exist or not
            var email = (userDto.Email ?? string.Empty).Trim().ToLowerInvariant();
            if (await dbContext.Users.AnyAsync(u => u.Email.ToLower() == email))
                return Conflict("Email already registered.");

            // If reference is Campus drive then allow CDID
            if (userDto.Reference == "Campus drive" && !userDto.CDID.HasValue)
                return BadRequest("CDID is required for Campus drive reference.");

            string? storedFileName = null;

            if (photo == null || photo.Length == 0)
                return BadRequest("Photo is required.");

            // File upload logic
            if (photo != null && photo.Length > 0)
            {
                if (photo.Length > MaxFileBytes)
                    return BadRequest("File too large. Max 5 MB.");

                // Set file name and extension
                var original = Path.GetFileName(photo.FileName);
                var ext = Path.GetExtension(original).ToLowerInvariant();

                // Only below extension
                if (!AllowedExt.Contains(ext))
                    return BadRequest("Only jpg/jpeg/png allowed.");

                // Save to Uploads/User_Upload_Photos folder wit unique name
                var uploads = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "User_Upload_Photos");
                Directory.CreateDirectory(uploads);

                storedFileName = $"{Guid.NewGuid():N}-{original}";
                var fullPath = Path.Combine(uploads, storedFileName);

                using (var fs = new FileStream(fullPath, FileMode.Create))
                {
                    await photo.CopyToAsync(fs);
                }
            }

            // Resume upload logic
            string? storedResumeName = null;
            if (resume != null && resume.Length > 0)
            {
                // Max size is 10MB and allowed extension
                const long MaxResumeBytes = 10 * 1024 * 1024; 
                string[] AllowedResumeExt = [".pdf", ".doc", ".docx"];

                if (resume.Length > MaxResumeBytes)
                    return BadRequest("Resume too large. Max 10 MB allowed.");

                var originalResume = Path.GetFileName(resume.FileName);
                var ext = Path.GetExtension(originalResume).ToLowerInvariant();

                if (!AllowedResumeExt.Contains(ext))
                    return BadRequest("Only PDF, DOC, and DOCX files are allowed for resume.");

                // Save to Uploads/User_Upload_Resumes folder wit unique name
                var resumeUploads = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "User_Upload_Resumes");
                Directory.CreateDirectory(resumeUploads);

                storedResumeName = $"{Guid.NewGuid():N}-{originalResume}";
                var fullResumePath = Path.Combine(resumeUploads, storedResumeName);

                using (var fs = new FileStream(fullResumePath, FileMode.Create))
                {
                    await resume.CopyToAsync(fs);
                }
            }

            // User object to get values
            var user = new User
            {
                FullName = userDto.FullName,
                Email = email,
                PhoneNumber = userDto.PhoneNumber,
                City = userDto.City,
                Country = userDto.Country,
                DOB = DateOnly.FromDateTime(userDto.DOB),
                Photo = storedFileName ?? string.Empty,
                Reference = userDto.Reference,
                Resume = storedResumeName ?? string.Empty,
                BachelorDegree = userDto.BachelorDegree,
                BachelorUniversity = userDto.BachelorUniversity,
                BachelorPercentage = userDto.BachelorPercentage,
                MasterDegree = userDto.MasterDegree,
                MasterUniversity = userDto.MasterUniversity,
                MasterPercentage = userDto.MasterPercentage,
                YearsOfExperience = userDto.YearsOfExperience,
                PreCompanyName = userDto.PreCompanyName,
                PreCompanyTitle = userDto.PreCompanyTitle,
                CDID = userDto.CDID,
                Role = string.IsNullOrWhiteSpace(userDto.Role) ? "Candidate" : userDto.Role,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            // Password hashing logic
            var hasher = new PasswordHasher<User>();
            user.Password = hasher.HashPassword(user, userDto.Password);

            // Assign skills if provided
            if (userDto.Skills != null && userDto.Skills.Any())
            {
                foreach (var skillName in userDto.Skills)
                {
                    var existingSkill = await dbContext.Skills
                        .FirstOrDefaultAsync(s => s.SkillName.ToLower() == skillName.ToLower());

                    if (existingSkill != null)
                    {
                        user.Skills.Add(existingSkill);
                    }
                    else
                    {
                        // Create new skill if not exist
                        var newSkill = new Skill { SkillName = skillName };
                        dbContext.Skills.Add(newSkill);
                        user.Skills.Add(newSkill);
                    }
                }
            }

            // Add user to database
            dbContext.Users.Add(user);
            try
            {
                await dbContext.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return Conflict("Email already registered.");
            }

            return Ok(new
            {
                userId = user.UserId,
                email = user.Email,
                message = "User created successfully"
            });
        }
    }
}
