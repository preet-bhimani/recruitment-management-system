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
        public DbSet<GoogleIntegrationSettings> GoogleIntegrationSettings { get; set; }
        public DbSet<TechnicalInterview> TechnicalInterviews { get; set; }

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

            modelBuilder.Entity<TechnicalInterview>()
                .HasOne(t => t.JobOpening)
                .WithMany()
                .HasForeignKey(t => t.JOId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TechnicalInterview>()
                .HasOne(t => t.JobApplication)
                .WithMany()
                .HasForeignKey(t => t.JAId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TechnicalInterview>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId);

            modelBuilder.Entity<JobApplication>()
                .HasIndex(j => new { j.UserId, j.JOId })
                .IsUnique();

            modelBuilder.Entity<TechnicalInterview>()
                .HasIndex(t => new { t.JAId, t.NoOfRound })
                .IsUnique();

            modelBuilder.Entity<TechnicalInterview>()
                .HasIndex(t => t.InterviewerEmail);
        }
    }
}
