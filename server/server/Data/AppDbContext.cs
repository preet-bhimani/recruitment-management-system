using Microsoft.EntityFrameworkCore;
using server.Models.Entities;

namespace server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
        {
            
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Skill> Skills { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Skills)
                .WithMany(s => s.Users);

            modelBuilder.Entity<Skill>()
                .HasIndex(u => u.SkillName)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u =>u.Email)
                .IsUnique();
        }
    }
}
