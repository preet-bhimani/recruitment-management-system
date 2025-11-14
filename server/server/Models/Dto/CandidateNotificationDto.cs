namespace server.Models.Dto
{
    public class CandidateNotificationDto
    {
        public Guid JOId { get; set; }
        public string JobTitle { get; set; }
        public string NotificationType { get; set; }
        public string Status { get; set; }
        public DateTime Date { get; set; }
        public string? MeetingLink { get; set; }
        public string? Feedback { get; set; }
        public string? MeetingDate { get; set; }
        public string? MeetingTime { get; set; }
        public string? ExamDate { get; set; }
    }
}
