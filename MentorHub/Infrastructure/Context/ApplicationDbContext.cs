using MentorHup.APPLICATION.Settings;
using MentorHup.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MentorHup.Infrastructure.Context
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : IdentityDbContext<ApplicationUser>(options)
    {
        public DbSet<Mentee> Mentees { get; set; }
        public DbSet<Mentor> Mentors { get; set; }
        public DbSet<Skill> Skills { get; set; } 
        public DbSet<MentorSkill> MentorSkills { get; set; }
        public DbSet<MentorAvailability> MentorAvailabilities { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // one to one relation between Mentee and ApplicationUser
            builder.Entity<Mentee>()
             .HasOne(m => m.ApplicationUser)
             .WithOne(u => u.Mentee)
             .HasForeignKey<Mentee>(m => m.ApplicationUserId);

            builder.Entity<Mentor>()
                .HasOne(m => m.ApplicationUser)
                .WithOne(u => u.Mentor)
                .HasForeignKey<Mentor>(m => m.ApplicationUserId);

            builder.Entity<MentorSkill>()
                .HasOne(ms => ms.Mentor)
                .WithMany(m => m.MentorSkills)
                .HasForeignKey(ms => ms.MentorId);

            builder.Entity<MentorSkill>()
                .HasOne(ms => ms.Skill)
                .WithMany(s => s.MentorSkills)
                .HasForeignKey(ms => ms.SkillId);

            builder.Entity<MentorAvailability>()
                .HasOne(ma => ma.Mentor)
                .WithMany(m => m.Availabilities)
                .HasForeignKey(ma => ma.MentorId)
                .OnDelete(DeleteBehavior.Cascade);


            builder.Entity<Skill>().HasData(
        new Skill { Id = 1, SkillName = "C#" },
        new Skill { Id = 2, SkillName = "JavaScript" },
        new Skill { Id = 3, SkillName = "React" },
        new Skill { Id = 4, SkillName = "SQL" }
    );

        }
    }
}
