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
        public DbSet<JobOpening> JobOpenings { get; set; }
        public DbSet<CampusDrive> CampusDrives { get; set; }
        public DbSet<JobApplication> JobApplications { get; set; }

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
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<CampusDrive>()
                .HasOne(cd => cd.JobOpening)
                .WithMany(jo => jo.CampusDrives)
                .HasForeignKey(cd => cd.JOId);

            modelBuilder.Entity<CampusDrive>()
                .HasMany(cd => cd.Users)
                .WithOne(u => u.CampusDrive)
                .HasForeignKey(u => u.CDID);

            modelBuilder.Entity<JobApplication>()
                .HasOne(j => j.User)
                .WithMany() 
                .HasForeignKey(j => j.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<JobApplication>()
                .HasOne(j => j.JobOpening)
                .WithMany()
                .HasForeignKey(j => j.JOId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<JobApplication>()
                .HasIndex(j => new { j.UserId, j.JOId })
                .IsUnique();
        }
    }
}
