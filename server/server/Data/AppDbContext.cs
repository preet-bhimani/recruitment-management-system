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
        public DbSet<HRInterview> HRInterviews { get; set; }
        public DbSet<DocumentList> DocumentLists { get; set; }
        public DbSet<OfferLetter> OfferLetters { get; set; }
        public DbSet<Selection> Selections { get; set; }
        public DbSet<Employee> Employees { get; set; }

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

            modelBuilder.Entity<HRInterview>()
                .HasOne(h => h.JobOpening)
                .WithMany()
                .HasForeignKey(h => h.JOId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<HRInterview>()
                .HasOne(h => h.JobApplication)
                .WithMany()
                .HasForeignKey(h => h.JAId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<HRInterview>()
                .HasOne(h => h.User)
                .WithMany()
                .HasForeignKey(h => h.UserId);

            modelBuilder.Entity<HRInterview>()
                .HasIndex(h => new { h.JAId, h.NoOfRound })
                .IsUnique();

            modelBuilder.Entity<HRInterview>()
                .HasIndex(h => h.InterviewerEmail);

            modelBuilder.Entity<DocumentList>()
                .HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DocumentList>()
                .HasOne(d => d.JobOpening)
                .WithMany()
                .HasForeignKey(d => d.JOId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DocumentList>()
                .HasOne(d => d.JobApplication)
                .WithMany()
                .HasForeignKey(d => d.JAId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DocumentList>()
                .HasIndex(d => new { d.UserId, d.JAId })
                .IsUnique();

            modelBuilder.Entity<OfferLetter>()
                .HasOne(o => o.User)
                .WithMany()
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OfferLetter>()
                .HasOne(o => o.JobOpening)
                .WithMany()
                .HasForeignKey(o => o.JOId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OfferLetter>()
                .HasOne(o => o.JobApplication)
                .WithMany()
                .HasForeignKey(o => o.JAId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OfferLetter>()
                .Property(o => o.Salary)
                .HasPrecision(18, 2);

            modelBuilder.Entity<OfferLetter>()
                .HasIndex(o => new { o.UserId, o.JAId })
                .IsUnique();

            modelBuilder.Entity<Selection>()
                .HasOne(s => s.User)
                .WithMany()
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Selection>()
                .HasOne(s => s.JobOpening)
                .WithMany()
                .HasForeignKey(s => s.JOId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Selection>()
                .HasOne(s => s.JobApplication)
                .WithMany()
                .HasForeignKey(s => s.JAId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Selection>()
                .HasOne(s => s.OfferLetter)
                .WithMany()
                .HasForeignKey(s => s.OLId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Selection>()
                .HasIndex(s => new { s.JAId, s.OLId })
                .IsUnique();

            modelBuilder.Entity<Selection>()
                .HasIndex(s => new { s.UserId, s.JOId })
                .IsUnique();

            modelBuilder.Entity<Employee>()
                .HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
