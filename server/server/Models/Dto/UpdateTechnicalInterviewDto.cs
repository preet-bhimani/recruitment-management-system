using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.Dto
{
    public class UpdateTechnicalInterviewDto
    {
        public Guid TIId { get; set; }        
        public Guid JAId { get; set; }
        public string TechIsClear { get; set; }
        public string TechStatus { get; set; }

        public DateOnly TechDate { get; set; }
        public TimeOnly TechTime { get; set; }
        public string? TechFeedback { get; set; }
        public int? TechRating { get; set; }

        public string MeetingSubject { get; set; }

        public string InterviewerName { get; set; }
        public string InterviewerEmail { get; set; }
    }
}
