using System.ComponentModel.DataAnnotations;

namespace server.Models.Dto
{
    public class JobOpeningDto
    {
        [Required]
        public required string Title { get; set; }

        [Required]
        public required string Description { get; set; }

        [Required]
        public required string Qualification { get; set; }

        [Required]
        public required int NoOfOpening { get; set; }

        [Required]
        public required string RequiredSkills { get; set; }

        public required string? PreferredSkills { get; set; }

        [Required]
        public required string Location { get; set; }

        public string? Comment { get; set; }

        [Required]
        public required string JobType { get; set; }

        [Required]
        public required int Experience { get; set; }

        [Required]
        public string Status { get; set; } = "Open";
    }
}
