using server.Models.Entities;

namespace server.Models.Dto
{
    public class SkillDto
    {
        public required string SkillName { get; set; }
        public ICollection<User> Users { get; set; } = new List<User>();
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }
}
