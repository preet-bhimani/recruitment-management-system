using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.Entities
{
    public class Employee
    {
        [Key]
        public Guid EmployeeId { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey("User")]
        public Guid UserId { get; set; }

        [Required]
        public required string FullName { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [RegularExpression(@"^\+[1-9]\d{7,14}$", ErrorMessage = "Phone must be start with + sing country code.")]
        public required string PhoneNumber { get; set; }

        [Required]
        public required string City { get; set; }

        [Required]
        public required string JobTitle { get; set; }

        public string? Department { get; set; }

        [Required]
        public string EmployeeType { get; set; } = "Job";

        [Required]
        public required DateTime JoiningDate { get; set; }

        [Required]
        [Precision(18, 2)]
        public decimal Salary { get; set; }

        public int? ProbationTimeInMonths { get; set; }

        public string? OfficialEmail { get; set; }

        public required string BankName { get; set; }
        public required string BankAccNo { get; set; }
        public required string BankIFSC { get; set; }

        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactNumber { get; set; }
        public string EmploymentStatus { get; set; } = "Active";

        public User? User { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
