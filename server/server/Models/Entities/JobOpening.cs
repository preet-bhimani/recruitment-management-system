using System.ComponentModel.DataAnnotations;

namespace server.Models.Entities
{
    public class JobOpening
    {
        [Key]
        public Guid JOId { get; set; } = Guid.NewGuid();

        [Required]
        public required string Title { get; set; }

        [Required]
        public required string Description { get; set; }

        [Required]
        public required string Qualification { get; set; }

        [Required]
        public required int NoOfOpening { get; set; }

        [Required]
        public required string RequiredSkills { get; set; }

        public required string? PreferredSkills { get; set; }

        [Required]
        public required string Location { get; set; }

        public string? Comment { get; set; }

        [Required]
        public required string JobType { get; set; }

        [Required]
        public required int Experience { get; set; }

        public ICollection<CampusDrive> CampusDrives { get; set; } = new List<CampusDrive>();

        [Required]
        public string Status { get; set; } = "Open";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; } = null;
    }
}
