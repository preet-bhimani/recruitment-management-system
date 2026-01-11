namespace server.Models.Entities
{
    public class Skill
    {
        public Guid SkillId { get; set; }
        public required string SkillName { get; set; }
        public required bool SkillStatus { get; set; } = true;
        public ICollection<User> Users { get; set; } = new List<User>();
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }
}
