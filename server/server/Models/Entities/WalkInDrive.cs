using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.Entities
{
    public class WalkInDrive
    {
        [Key]
        public Guid WalkId { get; set; } = Guid.NewGuid();

        [Required]
        public required string Location { get; set; }

        [Required]
        [ForeignKey("JobOpening")]
        public Guid JOId { get; set; }
        public JobOpening JobOpening { get; set; }

        [Required]
        public required DateOnly DriveDate { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}
