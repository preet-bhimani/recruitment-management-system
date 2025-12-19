using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.Models;
using server.Models.Dto;
using server.Models.Entities;
using server.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // File must be less then 5 MB and .jpg, .jpeg, .png formate
        private readonly AppDbContext dbContext;
        private readonly IConfiguration config;
        private readonly EmailService emailService;
        private readonly EmailTemplateService templateService;
        private const long MaxFileBytes = 5 * 1024 * 1024; 
        private static readonly string[] AllowedExt = new[] { ".jpg", ".jpeg", ".png" };

        public AuthController(AppDbContext dbContext, IConfiguration configuration, EmailService emailService, EmailTemplateService templateService)
        {
            this.dbContext = dbContext;
            config = configuration;
            this.emailService = emailService;
            this.templateService = templateService;
        }

        [HttpPost("register")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Register([FromForm] UserDto userDto, [FromForm] IFormFile photo)
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

            // User object to get values
            var user = new User
            {
                FullName = userDto.FullName,
                Email = email,
                PhoneNumber = userDto.PhoneNumber,
                City = userDto.City,
                Country = userDto.Country,
                DOB = DateOnly.FromDateTime(userDto.DOB),
                Photo = storedFileName,
                Reference = userDto.Reference,
                Role = "Candidate",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            // Password hashing logic
            var hasher = new PasswordHasher<User>();
            user.Password = hasher.HashPassword(user, userDto.Password);

            // Add User to Database
            dbContext.Users.Add(user);
            try
            {
                await dbContext.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return Conflict("Email already registered.");
            }

            return Ok(new { userId = user.UserId, email = user.Email, message = "Registered Sucessfully" });

        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // Get email
            var email = loginDto.Email.Trim().ToLower();

            // If user not found with this email
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email);
            if (user == null) 
            {
                return Unauthorized("Invalid email or password");
            }

            // Hash passowrd and check if password is correct or not
            var hasher = new PasswordHasher<User>();
            var result = hasher.VerifyHashedPassword(user, user.Password, loginDto.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Invalid email or password.");
            }

            string token = CreateToken(user);
            string refreshToken = await GenerateRefreshTokenAsync(user);

            // Send message and token
            return Ok(new
            {
                userId = user.UserId,
                fullName = user.FullName,
                email = user.Email,
                message = "Login sucessful",
                role = user.Role ?? "Candidate",
                token = token,
                refreshToken = refreshToken,
            });
        }

        private string CreateToken (User user)
        {
            // Create Claims
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Role, user.Role ?? "Candidate"),
            };

            // Create JWT token
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(config.GetValue<string>("Jwt:Token")!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: config.GetValue<string>("Jwt:Issuer"),
                audience: config.GetValue<string>("Jwt:Audience"),
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }

        [Authorize]
        [HttpGet]
        public IActionResult AuthenticatedOnlyEndpoint()
        {
            return Ok("You are welcomed");
        }


        // Generate refresh token
        private string GenerateRefreshToken()
        {
            var randomNumber = new Byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private async Task<string> GenerateRefreshTokenAsync (User user)
        {
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await dbContext.SaveChangesAsync();
            return refreshToken;
        }

        //Send refresh token
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(RefreshTokenRequestDto refreshTokenRequest)
        {
            var user = await dbContext.Users.FindAsync(refreshTokenRequest.UserId);
            if(user == null || user.RefreshToken != refreshTokenRequest.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return Unauthorized("Invalid or token expired");
            }

            var newAccessToken = CreateToken(user);
            var newRefreshToken = GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            await dbContext.SaveChangesAsync();

            return Ok(new
            {
                token = newAccessToken,
                refreshToken = newRefreshToken,
            });
        }

        // Send OTP
        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] ResetPasswordRequestDto rprDto)
        {
            // Model Validation
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var email = rprDto.Email.Trim().ToLower();
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email);

            if (user == null)
                return NotFound("No account found with this email.");

            // Generate OTP
            var otp = new Random().Next(100000, 999999).ToString();

            // Save OTP
            user.ResetOtp = otp;
            user.ResetOtpExpiry = DateTime.UtcNow.AddMinutes(5);

            await dbContext.SaveChangesAsync();

            // Prepare email
            string subject = "Your OTP for Password Reset";
            string body = templateService.PasswordResetOtpTemplate(user.FullName, otp);

            // Send email using EmailService
            await emailService.SendEmail(user.Email, subject, body);

            return Ok(new { message = "OTP has been sent to your email." });
        }

        // Verify OTP
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyResetOtp(VerifyOtpDto voDto)
        {
            // Model Validation
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var email = voDto.Email;

            var user = await dbContext.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email);

            if (user == null)
                return NotFound("No account found with this email");

            // Check if OTP is correct
            if (user.ResetOtp != voDto.Otp)
                return BadRequest("Invalid OTP.");

            // Check if OTP expired
            if (user.ResetOtpExpiry == null || user.ResetOtpExpiry < DateTime.UtcNow)
                return BadRequest("OTP expired. Please request a new one");

            return Ok("OTP verified successfully");
        }

        // Reset password
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto rpDto)
        {
            // Model Validation
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var email = rpDto.Email;

            var user = await dbContext.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email);

            if (user == null)
                return NotFound("Account not found with this email");

            // Ensure OTP was verified
            if (string.IsNullOrEmpty(user.ResetOtp))
                return BadRequest("OTP verification required");

            // If OTP expired
            if (user.ResetOtpExpiry == null || user.ResetOtpExpiry < DateTime.UtcNow)
                return BadRequest("OTP expired. Please request again");

            // Hash new password
            var hasher = new PasswordHasher<User>();
            user.Password = hasher.HashPassword(user, rpDto.NewPassword);

            // Clear OTP after password reset
            user.ResetOtp = null;
            user.ResetOtpExpiry = null;

            await dbContext.SaveChangesAsync();

            return Ok("Password updated successfully");
        }
    }
}
