using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.Dto
{
    public class DocumentListDto
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid JOId { get; set; }

        [Required]
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
    }
}
