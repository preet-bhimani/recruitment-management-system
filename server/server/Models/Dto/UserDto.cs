using server.Models.Entities;
using System.ComponentModel.DataAnnotations;

namespace server.Models.Dto
{
    public class UserDto
    {
        [Required, StringLength(150, MinimumLength = 2)]
        public string FullName { get; set; }

        [Required, EmailAddress, StringLength(256)]
        public string Email { get; set; }

        [StringLength(512)]
        public string? Password { get; set; }

        [Required]
        [RegularExpression(@"^\+[1-9]\d{7,14}$", ErrorMessage = "Phone must start with + and country code.")]
        [StringLength(32)]
        public string PhoneNumber { get; set; }

        [Required, StringLength(100)]
        public string City { get; set; }

        [Required, StringLength(100)]
        public string Country { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime DOB { get; set; }

        [StringLength(500)]
        public string? Photo { get; set; }

        [Required, StringLength(200)]
        public string Reference { get; set; }

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

        public string? Role { get; set; } = "Candidate";
        public List<Guid>? SkillIds { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
