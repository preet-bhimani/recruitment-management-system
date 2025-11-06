using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.Dto
{
    public class TechnicalInterviewDto
    {
        public Guid JOId { get; set; }
        public Guid JAId { get; set; }
        public Guid UserId { get; set; }

        public required string MeetingSubject { get; set; }
        public DateOnly TechDate { get; set; }
        public TimeOnly TechTime { get; set; }
        public required string MeetingLink { get; set; }
        public required string InterviewerName { get; set; }
        public required string InterviewerEmail { get; set; }
        public required string TechIsClear { get; set; }
        public string TechStatus { get; set; } = "In Progress";

        public int DurationMinutes { get; set; } = 120;

        public string? TechFeedback { get; set; }

        [Range(1, 6)]
        public int? TechRating { get; set; }
    }
}
