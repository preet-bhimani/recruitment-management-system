using System.ComponentModel.DataAnnotations;

namespace server.Models.Dto
{
    public class WalkInDriveDto
    {
        [Required]
        public string Location { get; set; }

        [Required]
        public Guid JOId { get; set; }

        [Required]
        public DateOnly DriveDate { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
