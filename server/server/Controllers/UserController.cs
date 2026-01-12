using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Dto;
using server.Models.Entities;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly EmailService emailService;
        private readonly EmailTemplateService templateService;
        private const long MaxFileBytes = 5 * 1024 * 1024;
        private static readonly string[] AllowedExt = [".jpg", ".jpeg", ".png"];
        public UserController(AppDbContext dbContext, EmailService emailService, EmailTemplateService templateService)
        {
            this.dbContext = dbContext;
            this.emailService = emailService;
            this.templateService = templateService;
        }

        [Authorize(Roles = "Admin,Recruiter")]
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
                Role = string.IsNullOrWhiteSpace(userDto.Role) ? "Candidate" : userDto.Role,
                IsActive = true,
                IsPasswordSet = true,
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

        // Add user by Excel file
        [Authorize(Roles = "Admin,Recruiter")]
        [HttpPost("import-excel")]
        public async Task<IActionResult> AddUsersByExcel(IFormFile file)
        {
            // File validation
            if (file == null || file.Length == 0)
            {
                return BadRequest("Excel file is required");
            }

            var result = new ExcelImportUserDto();

            // Copy file into memory
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            stream.Position = 0;

            using var reader = ExcelDataReader.ExcelReaderFactory.CreateReader(stream);
            int rowNumber = 0;

            // Read Excel row by row
            while (reader.Read())
            {
                rowNumber++;

                // Skip header row
                if (rowNumber == 1)
                    continue;

                result.TotalRows++;

                try
                {
                    // Read row values
                    var fullName = reader.GetValue(0)?.ToString();
                    var email = reader.GetValue(1)?.ToString()?.Trim().ToLower();
                    var phoneNumber = reader.GetValue(2)?.ToString();
                    var city = reader.GetValue(3)?.ToString();
                    var country = reader.GetValue(4)?.ToString();
                    var dobValue = reader.GetValue(5)?.ToString();

                    // Validations
                    if (string.IsNullOrWhiteSpace(fullName))
                    {
                        throw new Exception("Full name is required");
                    }

                    if (string.IsNullOrWhiteSpace(email))
                    {
                        throw new Exception("Email is required");
                    }

                    if (!DateTime.TryParse(dobValue, out var dob))
                    {
                        throw new Exception("Invalid DOB");
                    }

                    // Check if email exists
                    if (await dbContext.Users.AnyAsync(u => u.Email == email))
                    {
                        throw new Exception("Email already exists");
                    }

                    var user = new User
                    {
                        FullName = fullName,
                        Email = email,
                        PhoneNumber = phoneNumber,
                        City = city,
                        Country = country,
                        DOB = DateOnly.FromDateTime(dob),
                        Role = "Candidate",
                        IsActive = true,
                        IsPasswordSet = false,
                        CreatedAt = DateTime.UtcNow
                    };

                    // Generate password
                    var hasher = new PasswordHasher<User>();
                    user.Password = hasher.HashPassword(user, Guid.NewGuid().ToString());

                    dbContext.Users.Add(user);
                    await dbContext.SaveChangesAsync();

                    // Send email for reset password
                    string subject = "Activate your account - Set your password";
                    string body = templateService.PasswordSetupTemplate(fullName);

                    await emailService.SendEmail(email, subject, body);


                    result.Inserted++;
                }
                catch (Exception ex)
                {
                    // Show Result
                    result.Errors.Add(new ExcelImportUserErrorDto
                    {
                        Row = rowNumber,
                        Email = reader.GetValue(1)?.ToString(),
                        Reason = ex.Message
                    });
                }
            }

            return Ok(result);
        }

        // Fetch all users
        [Authorize(Roles = "Admin,Viewer")]
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
        [Authorize(Roles = "Admin,Viewer,Candidate")]
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
                user.Role,
                user.IsActive,
                user.CreatedAt,
                skills = user.Skills.Select(s => new { skillId = s.SkillId, skillName = s.SkillName }).ToList()
            });
        }

        // Update user
        [Authorize(Roles = "Admin,Candidate")]
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
        [Authorize(Roles = "Admin")]
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

        // Update profile for all users
        [HttpPut("update-profile/{id:guid}")]
        public async Task<IActionResult> UpdateProfileById(Guid id, [FromForm] UpdateProfileDto upDto, [FromForm] IFormFile? photo)
        {
            // Model state validation
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await dbContext.Users
                .Include(u => u.Skills)
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
            {
                return NotFound("User not found.");
            }

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

            user.FullName = upDto.FullName;
            user.PhoneNumber = upDto.PhoneNumber;
            user.City = upDto.City;
            user.Country = upDto.Country;
            user.DOB = DateOnly.FromDateTime(upDto.DOB);

            // Save Changes
            await dbContext.SaveChangesAsync();

            return Ok("Profile updated Scussessfully");
        }
    }
}
