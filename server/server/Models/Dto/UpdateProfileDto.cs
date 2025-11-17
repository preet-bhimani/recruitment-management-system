namespace server.Models.Dto
{
    public class UpdateProfileDto
    {
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public DateTime DOB { get; set; }
        public string? Photo { get; set; }
    }
}
