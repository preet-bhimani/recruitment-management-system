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
        private const long MaxFileBytes = 5 * 1024 * 1024;
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

            // Assign existing skills only
            if (userDto.SkillIds != null && userDto.SkillIds.Any())
            {
                var validSkills = await dbContext.Skills
                    .Where(s => userDto.SkillIds.Contains(s.SkillId))
                    .ToListAsync();

                if (validSkills.Count != userDto.SkillIds.Count)
                    return BadRequest("Pleas select skills from dropdown.");

                user.Skills = validSkills;
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

        // Fetch all users
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await dbContext.Users.ToListAsync();

            var baseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";

            foreach (var u in users)
            {
                if (!string.IsNullOrEmpty(u.Photo))
                {
                    u.Photo = baseUrl + u.Photo;
                }
            }

            return Ok(users);
        }

        // Get user based on Id
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var user = await dbContext.Users
                .Include(u => u.Skills)
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
                return NotFound("User not found");

            var photoBaseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";
            if (!string.IsNullOrEmpty(user.Photo))
                user.Photo = photoBaseUrl + user.Photo;

            var resumeBaseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Resumes/";
            if (!string.IsNullOrEmpty(user.Resume))
                user.Resume = resumeBaseUrl + user.Resume;

            return Ok(new
            {
                user.UserId,
                user.FullName,
                user.Email,
                user.PhoneNumber,
                user.City,
                user.Country,
                user.DOB,
                user.Photo,
                user.Reference,
                user.Resume,
                user.BachelorDegree,
                user.BachelorUniversity,
                user.BachelorPercentage,
                user.MasterDegree,
                user.MasterUniversity,
                user.MasterPercentage,
                user.YearsOfExperience,
                user.PreCompanyName,
                user.PreCompanyTitle,
                user.CDID,
                user.Role,
                user.IsActive,
                user.CreatedAt,
                skills = user.Skills.Select(s => new { skillId = s.SkillId, skillName = s.SkillName }).ToList()
            });
        }


        // Update user
        [HttpPut("update/{id:guid}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromForm] UserDto userDto, [FromForm] IFormFile? photo, [FromForm] IFormFile? resume)
        {
            var user = await dbContext.Users
                .Include(u => u.Skills)
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
                return NotFound("User not found.");

            // Prevent to change email
            if (!string.Equals(user.Email.Trim(), (userDto.Email ?? "").Trim(), StringComparison.OrdinalIgnoreCase))
                return BadRequest("Email cannot be changed.");

            // Handle photo upload
            if (photo != null && photo.Length > 0)
            {
                if (photo.Length > MaxFileBytes)
                    return BadRequest("File too large. Max 5 MB allowed.");

                var ext = Path.GetExtension(photo.FileName).ToLowerInvariant();
                if (!AllowedExt.Contains(ext))
                    return BadRequest("Only JPG, JPEG, and PNG allowed.");

                // Delete old photo if exists
                if (!string.IsNullOrEmpty(user.Photo))
                {
                    var oldPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "User_Upload_Photos", user.Photo);
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                // Save new photo
                var uploads = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "User_Upload_Photos");
                Directory.CreateDirectory(uploads);

                var newPhotoName = $"{Guid.NewGuid():N}-{Path.GetFileName(photo.FileName)}";
                var newPhotoPath = Path.Combine(uploads, newPhotoName);

                using (var fs = new FileStream(newPhotoPath, FileMode.Create))
                {
                    await photo.CopyToAsync(fs);
                }

                user.Photo = newPhotoName;
            }

            // Handle resume upload
            if (resume != null && resume.Length > 0)
            {
                const long MaxResumeBytes = 10 * 1024 * 1024;
                string[] AllowedResumeExt = [".pdf", ".doc", ".docx"];

                if (resume.Length > MaxResumeBytes)
                    return BadRequest("Resume too large. Max 10 MB allowed.");

                var ext = Path.GetExtension(resume.FileName).ToLowerInvariant();
                if (!AllowedResumeExt.Contains(ext))
                    return BadRequest("Only PDF, DOC, and DOCX allowed.");

                // Delete old resume if exists
                if (!string.IsNullOrEmpty(user.Resume))
                {
                    var oldResumePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "User_Upload_Resumes", user.Resume);
                    if (System.IO.File.Exists(oldResumePath))
                        System.IO.File.Delete(oldResumePath);
                }

                // Save new resume
                var resumeUploads = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "User_Upload_Resumes");
                Directory.CreateDirectory(resumeUploads);

                var newResumeName = $"{Guid.NewGuid():N}-{Path.GetFileName(resume.FileName)}";
                var newResumePath = Path.Combine(resumeUploads, newResumeName);

                using (var fs = new FileStream(newResumePath, FileMode.Create))
                {
                    await resume.CopyToAsync(fs);
                }

                user.Resume = newResumeName;
            }

            // Update all other simple fields
            user.FullName = userDto.FullName;
            user.PhoneNumber = userDto.PhoneNumber;
            user.City = userDto.City;
            user.Country = userDto.Country;
            user.DOB = DateOnly.FromDateTime(userDto.DOB);
            user.Reference = userDto.Reference;
            user.BachelorDegree = userDto.BachelorDegree;
            user.BachelorUniversity = userDto.BachelorUniversity;
            user.BachelorPercentage = userDto.BachelorPercentage;
            user.MasterDegree = userDto.MasterDegree;
            user.MasterUniversity = userDto.MasterUniversity;
            user.MasterPercentage = userDto.MasterPercentage;
            user.YearsOfExperience = userDto.YearsOfExperience;
            user.PreCompanyName = userDto.PreCompanyName;
            user.PreCompanyTitle = userDto.PreCompanyTitle;
            user.Role = userDto.Role;
            user.IsActive = userDto.IsActive;
            user.UpdatedAt = DateTime.UtcNow;

            // Update existing skills only
            if (userDto.SkillIds != null)
            {
                var validSkills = await dbContext.Skills
                    .Where(s => userDto.SkillIds.Contains(s.SkillId))
                    .ToListAsync();

                if (validSkills.Count != userDto.SkillIds.Count)
                    return BadRequest("Please select skills from dropdown.");

                user.Skills.Clear();
                foreach (var skill in validSkills)
                    user.Skills.Add(skill);
            }

            // Update password if a new one is provided
            if (!string.IsNullOrWhiteSpace(userDto.Password))
            {
                var hasher = new PasswordHasher<User>();
                user.Password = hasher.HashPassword(user, userDto.Password);
            }

            // Save Changes
            await dbContext.SaveChangesAsync();

            return Ok(new
            {
                message = "User updated successfully.",
                userId = user.UserId
            });
        }

        // Delete or just deactive user
        [HttpDelete("delete/{id:guid}")]
        public async Task<IActionResult> DeleteById(Guid id)
        {
            var user = await dbContext.Users.FindAsync(id);
            if (user == null)
                return NotFound("User not found.");

            // Check if user is already in deactive state or not
            if (!user.IsActive)
            {
                return Conflict(new
                {
                    message = "User already inactive.",
                    userId = user.UserId
                });
            }

            // Change IsActive to false for deactive user
            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;

            await dbContext.SaveChangesAsync();

            return Ok(new
            {
                message = "User deactivated successfully.",
                userId = user.UserId
            });
        }
    }
}
