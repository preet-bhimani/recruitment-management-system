using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.Entities
{
    public class DocumentList
    {
        [Key]
        public Guid DLId { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("User")]
        public Guid UserId { get; set; }

        [Required]
        [ForeignKey("JobOpening")]
        public Guid JOId { get; set; }

        [Required]
        [ForeignKey("JobApplication")]
        public Guid JAId { get; set; }

        public string? AadharCard { get; set; }
        public string? PANCard { get; set; }
        public string? ExperienceLetter { get; set; }

        [Required]
        public required string BankAccNo { get; set; }

        [Required]
        public required string BankIFSC { get; set; }

        [Required]
        public required string BankName { get; set; }

        public User? User { get; set; }
        public JobOpening? JobOpening { get; set; }
        public JobApplication? JobApplication { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
