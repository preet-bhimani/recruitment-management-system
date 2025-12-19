using System.ComponentModel.DataAnnotations;

namespace server.Models.Dto
{
    public class JobApplicationDto
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
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
        public Guid? WalkId { get; set; }
    }
}
