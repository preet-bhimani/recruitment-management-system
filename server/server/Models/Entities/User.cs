using System.ComponentModel.DataAnnotations;

namespace server.Models.Entities
{
    public class User
    {
        public Guid UserId { get; set; } = Guid.NewGuid();

        [Required, StringLength(150, MinimumLength = 2)]
        public required string FullName { get; set; }


        [Required, EmailAddress, StringLength(256)]
        public required string Email { get; set; }

        [Required, StringLength(512)]
        public string Password { get; set; }

        [Required]
        [RegularExpression(@"^\+[1-9]\d{7,14}$", ErrorMessage = "Phone must be start with + sing country code.")]
        [StringLength(32)]
        public required string PhoneNumber { get; set; }

        [Required, StringLength(100)]
        public required string City { get; set; }

        [Required, StringLength(100)]
        public required string Country { get; set; }

        [Required, DataType(DataType.Date)]
        public required DateOnly DOB { get; set; }

        [StringLength(500)]
        public string? Photo { get; set; }

        [StringLength(200)]
        public string? Reference { get; set; }

        [StringLength(500)]
        public string? Resume { get; set; }

        [StringLength(150)]
        public string? BachelorDegree { get; set; }

        [StringLength(250)]
        public string? BachelorUniversity { get; set; }

        [Range(0, 100)]
        [RegularExpression(@"^\d{1,3}(\.\d{1,2})?$", ErrorMessage = "Percentage must be a number up to 2 decimal places.")]
        public float? BachelorPercentage { get; set; }

        [StringLength(150)]
        public string? MasterDegree { get; set; }

        [StringLength(250)]
        public string? MasterUniversity { get; set; }

        [Range(0, 100)]
        [RegularExpression(@"^\d{1,3}(\.\d{1,2})?$", ErrorMessage = "Percentage must be a number up to 2 decimal places.")]
        public float? MasterPercentage { get; set; }

        [Range(0, 60)]
        public int? YearsOfExperience { get; set; }

        [StringLength(200)]
        public string? PreCompanyName { get; set; }

        [StringLength(150)]
        public string? PreCompanyTitle { get; set; }

        [Required, StringLength(50)]
        public string Role { get; set; } = "Candidate";

        public bool IsPasswordSet { get; set; } = true;

        public bool IsActive { get; set; } = true;

        public string? RefreshToken { get; set; }

        public DateTime? RefreshTokenExpiryTime { get; set; }   

        public string? ResetOtp { get; set; }
        public DateTime? ResetOtpExpiry { get; set; }
        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }

        public ICollection<Skill> Skills { get; set; } = new List<Skill>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; } = null;
    }
}
