using System.ComponentModel.DataAnnotations;

namespace server.Models.Dto
{
    public class VerifyOtpDto
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [StringLength(6, MinimumLength = 6)]
        public required string Otp { get; set; }
    }
}
