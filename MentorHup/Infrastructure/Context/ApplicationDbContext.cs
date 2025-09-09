using MentorHup.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace MentorHup.Infrastructure.Context
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : IdentityDbContext<ApplicationUser>(options)
    {
        public DbSet<Mentee> Mentees { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Mentor> Mentors { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<MentorSkill> MentorSkills { get; set; }
        public DbSet<MentorAvailability> MentorAvailabilities { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<AdminCommission> AdminCommissions { get; set; }
        public DbSet<Review> Reviews { get; set; }

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

            builder.Entity<Booking>()
                .HasOne(b => b.Mentee)
                .WithMany(m => m.Bookings)
                .HasForeignKey(b => b.MenteeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Booking>()
                .HasOne(b => b.Mentor)
                .WithMany(m => m.Bookings)
                .HasForeignKey(b => b.MentorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Booking>()
                .HasOne(b => b.Payment)
                .WithOne(p => p.Booking)
                .HasForeignKey<Payment>(p => p.BookingId);

            builder.Entity<MentorAvailability>()
                .HasOne(ma => ma.Booking)
                .WithOne(b => b.MentorAvailability)
                .HasForeignKey<Booking>(b => b.MentorAvailabilityId);

            builder.Entity<Booking>()
                .HasOne(b => b.AdminCommission)
                .WithOne(ac => ac.Booking)
                .HasForeignKey<AdminCommission>(ac => ac.BookingId);
            
            builder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(u => u.SentMessages)
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);
            
            builder.Entity<Message>()
                .HasOne(m => m.Receiver)
                .WithMany(u => u.ReceivedMessages)
                .HasForeignKey(m => m.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Booking>()
            .HasOne(b => b.Review)
            .WithOne(r => r.Booking)
            .HasForeignKey<Review>(r => r.BookingId)
            .OnDelete(DeleteBehavior.Cascade);


            builder.Entity<Booking>()
                .Property(b => b.Amount)
                .HasPrecision(18, 2);
            
            builder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasPrecision(18, 2);
            
            builder.Entity<AdminCommission>()
                .Property(a => a.Amount)
                .HasPrecision(18, 2);
            
            builder.Entity<Mentor>().
                Property(m => m.Price).
                HasPrecision(18, 2);


            builder.Entity<Skill>().HasData(
        new Skill { Id = 1, SkillName = "C#" },
        new Skill { Id = 2, SkillName = "JavaScript" },
        new Skill { Id = 3, SkillName = "React" },
        new Skill { Id = 4, SkillName = "SQL" }
    );

        }
    }
}
