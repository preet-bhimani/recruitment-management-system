using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.Entities
{
    public class HRInterview
    {
        [Key]
        public Guid HIId { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("JobOpening")]
        public required Guid JOId { get; set; }

        [Required]
        [ForeignKey("JobApplication")]
        public required Guid JAId { get; set; }

        [Required]
        [ForeignKey("User")]
        public required Guid UserId { get; set; }

        public required string MeetingSubject { get; set; }

        [Required]
        public required DateOnly HRDate { get; set; }

        [Required]
        public required TimeOnly HRTime { get; set; }

        public required string MeetingLink { get; set; }

        public string? GoogleEventId { get; set; }

        [Required]
        public required string InterviewerName { get; set; }

        [Required]
        public required string InterviewerEmail { get; set; }

        public int NoOfRound { get; set; }

        public string HRIsClear { get; set; } = "Pending";
        public string HRStatus { get; set; } = "In Progress";

        public string? HRFeedback { get; set; }

        [Range(1, 6)]
        public int? HRRating { get; set; }

        public User? User { get; set; }
        public JobOpening? JobOpening { get; set; }
        public JobApplication? JobApplication { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
