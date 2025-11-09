namespace server.Models.Dto
{
    public class UpdateHRInterviewDto
    {
        public Guid HIId { get; set; }
        public Guid JAId { get; set; }
        public string HRIsClear { get; set; }
        public string HRStatus { get; set; }

        public DateOnly HRDate { get; set; }
        public TimeOnly HRTime { get; set; }
        public string? HRFeedback { get; set; }
        public int? HRRating { get; set; }

        public string MeetingSubject { get; set; }

        public string InterviewerName { get; set; }
        public string InterviewerEmail { get; set; }
    }
}
