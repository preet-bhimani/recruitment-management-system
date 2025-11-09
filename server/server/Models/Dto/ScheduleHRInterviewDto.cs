using System.ComponentModel.DataAnnotations;

namespace server.Models.Dto
{
    public class ScheduleHRInterviewDto
    {
        [Required]
        public Guid JOId { get; set; }

        [Required]
        public Guid JAId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public string MeetingSubject { get; set; }

        [Required]
        public DateOnly HRDate { get; set; }

        [Required]
        public TimeOnly HRTime { get; set; }

        [Range(15, 300)]
        public int DurationMinutes { get; set; } = 120;

        [Required]
        public string InterviewerName { get; set; }

        [Required]
        [EmailAddress]
        public string InterviewerEmail { get; set; }
    }
}
