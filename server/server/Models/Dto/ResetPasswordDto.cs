using System.ComponentModel.DataAnnotations;

namespace server.Models.Dto
{
    public class ResetPasswordDto
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public required string NewPassword { get; set; }
    }
}
