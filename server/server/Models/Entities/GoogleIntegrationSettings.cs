using System.ComponentModel.DataAnnotations;

namespace server.Models.Entities
{
    public class GoogleIntegrationSettings
    {
        [Key]
        public int GoogleSettingId { get; set; }

        [Required]
        public string RefreshToken { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
