using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.Entities
{
    public class JobApplication
    {
        [Key]
        public Guid JAId { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("User")]
        public Guid UserId { get; set; }

        [Required]
        [ForeignKey("JobOpening")]
        public Guid JOId { get; set; }

        public DateOnly? ExamDate { get; set; }

        public string? ExamResult { get; set; }

        public string? Feedback { get; set; }

        public string? RejectionStage { get; set; }

        [Required]
        public string Status { get; set; } = "Applied";

        [Required]
        public string OverallStatus { get; set; } = "Applied";
        public string? HoldOverallStatus { get; set; }

        public Guid? CDID { get; set; }
        public CampusDrive? CampusDrive { get; set; }

        public Guid? WalkId { get; set; }
        public WalkInDrive? WalkInDrive { get; set; }

        public User? User { get; set; }
        public JobOpening? JobOpening { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
