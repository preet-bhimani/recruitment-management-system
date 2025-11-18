using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.Entities
{
    public class Selection
    {
        [Key]
        public Guid SelectionId { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("User")]
        public Guid UserId { get; set; }

        [Required]
        [ForeignKey("JobOpening")]
        public Guid JOId { get; set; }

        [Required]
        [ForeignKey("JobApplication")]
        public Guid JAId { get; set; }

        [Required]
        [ForeignKey("OfferLetter")]
        public Guid OLId { get; set; }

        public string SelectionStatus { get; set; } = "Selected";

        public User? User { get; set; }
        public JobOpening? JobOpening { get; set; }
        public JobApplication? JobApplication { get; set; }
        public OfferLetter? OfferLetter { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
