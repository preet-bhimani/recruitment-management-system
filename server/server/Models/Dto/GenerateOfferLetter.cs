using Microsoft.EntityFrameworkCore;
using server.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.Dto
{
    public class GenerateOfferLetter
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid JOId { get; set; }

        [Required]
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

        public string OfferLetterStatus { get; set; }

        public string? OfferLetterFilePath { get; set; }
    }
}
