using System.ComponentModel.DataAnnotations;

namespace server.Models.Dto
{
    public class CampusDriveDto
    {
        [Required]
        [MaxLength(200)]
        public required string UniversityName { get; set; }

        [Required]
        public required Guid JOId { get; set; }

        [Required]
        public required DateOnly DriveDate { get; set; }

        [Required]
        public required bool IsActive { get; set; }

    }
}
