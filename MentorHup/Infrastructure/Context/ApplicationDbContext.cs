using MentorHup.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MentorHup.Infrastructure.Context
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : IdentityDbContext<ApplicationUser>(options)
    {
        public DbSet<Mentee> Mentees { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // one to one relation between Mentee and ApplicationUser
            builder.Entity<Mentee>()
             .HasOne(m => m.ApplicationUser)
             .WithOne(u => u.Mentee)
             .HasForeignKey<Mentee>(m => m.ApplicationUserId);

        }
    }
}
