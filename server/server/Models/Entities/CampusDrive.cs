using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.Entities
{
    public class CampusDrive
    {
        [Key]
        public Guid CDID { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(200)]
        public required string UniversityName { get; set; }

        [Required]
        [ForeignKey("JobOpening")]
        public Guid JOId { get; set; }
        public required JobOpening JobOpening { get; set; }

        [Required]
        public required DateOnly DriveDate { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}
