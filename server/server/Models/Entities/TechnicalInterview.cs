using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.Entities
{
    public class TechnicalInterview
    {
        [Key]
        public Guid TIId { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("JobOpening")]
        public required Guid JOId { get; set; }

        [Required]
        [ForeignKey("JobApplication")]
        public required Guid JAId { get; set; }

        [Required]
        [ForeignKey("User")]
        public required Guid UserId { get; set; }

        [Required]
        public required string MeetingSubject { get; set; }

        [Required]
        public required DateOnly TechDate { get; set; }

        [Required]
        public required TimeOnly TechTime { get; set; }

        public required string MeetingLink { get; set; }

        public string? GoogleEventId { get; set; }

        [Required]
        public required string InterviewerName { get; set; }

        [Required]
        public required string InterviewerEmail { get; set; }

        public int NoOfRound { get; set; }

        public string TechIsClear { get; set; } = "Pending";
        public string TechStatus { get; set; } = "In Progress";

        public string? TechFeedback { get; set; }

        [Range(1, 6)]
        public int? TechRating { get; set; }

        public User? User { get; set; }
        public JobOpening? JobOpening { get; set; }
        public JobApplication? JobApplication { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
