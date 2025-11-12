using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.Entities
{
    public class OfferLetter
    {
        [Key]
        public Guid OLId { get; set; } = Guid.NewGuid();

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
        public DateTime JoiningDate { get; set; }
        public DateTime? EndDate { get; set; }

        [Required]
        public string BondTime { get; set; }
        [Required]
        [Precision(18, 2)]
        public decimal Salary { get; set; }
        [Required]
        public string TemplateType { get; set; }
        [Required]
        public string OfferLetterStatus { get; set; } = "Sent";

        [Required]
        public string OfferLetterFilePath {  get; set; }

        public User? User { get; set; }
        public JobOpening? JobOpening { get; set; }
        public JobApplication? JobApplication { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
