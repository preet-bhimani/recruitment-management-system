using System.ComponentModel.DataAnnotations;

namespace server.Models.Dto
{
    public class ResetPasswordRequestDto
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }
    }
}
