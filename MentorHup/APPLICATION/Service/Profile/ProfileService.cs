using MentorHup.APPLICATION.DTOs.Profile;
using MentorHup.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace MentorHup.APPLICATION.Service.Profile
{
    public class ProfileService : IProfileService
    {
        private readonly ApplicationDbContext dbContext;

        public ProfileService(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<BaseProfileDto?> GetProfileAsync(string userId, string role)
        {
            switch (role)
            {
                case "Mentee":
                    var mentee = await dbContext.Mentees
                        .AsNoTracking()
                        .Include(m => m.ApplicationUser)
                        .FirstOrDefaultAsync(m => m.ApplicationUserId == userId);

                    if (mentee == null) return null;

                    return new MenteeProfileDto
                    {
                        Id = mentee.Id,
                        ApplicationUserId = mentee.ApplicationUserId,
                        Email = mentee.ApplicationUser.Email,
                        UserName = mentee.ApplicationUser.UserName,
                        Name = mentee.Name,
                        ImageLink = mentee.ImageUrl,
                        Gender = mentee.Gender,
                        CreatedAt = mentee.ApplicationUser.CreatedAt,
                        Role = "Mentee"
                    };

                case "Mentor":
                    var mentor = await dbContext.Mentors
                        .AsNoTracking()
                        .Include(ment => ment.ApplicationUser)
                        .Include(ment => ment.Bookings)
                            .ThenInclude(ment => ment.Review)
                        .Include(ment => ment.MentorSkills)
                            .ThenInclude(mentSkill => mentSkill.Skill)
                        .Include(ment => ment.Availabilities)
                        .FirstOrDefaultAsync(m => m.ApplicationUserId == userId);

                    if (mentor == null) return null;

                    return new MentorProfileDto
                    {
                        Id = mentor.Id,
                        ApplicationUserId = mentor.ApplicationUserId,
                        Email = mentor.ApplicationUser.Email,
                        UserName = mentor.ApplicationUser.UserName,
                        Name = mentor.Name,
                        CompanyName = mentor.CompanyName,
                        ImageLink = mentor.ImageUrl,
                        CVLink = mentor.CVUrl,
                        Description = mentor.Description,
                        Experiences = mentor.Experiences,
                        Price = mentor.Price,
                        StripeAccountId = mentor.StripeAccountId,
                        Field = mentor.Field,
                        CreatedAt = mentor.ApplicationUser.CreatedAt,
                        Skills = mentor.MentorSkills.Select(s => s.Skill.SkillName).ToList(),
                        Availabilites = mentor.Availabilities
                        .Where(mentorAvailability => mentorAvailability.StartTime > DateTime.Now)
                        .Select(mentorAvailability => new DTOs.Mentor.MentorAvailabilityResponse
                        {
                            MentorAvailabilityId = mentorAvailability.Id,
                            DayOfWeek = mentorAvailability.StartTime.DayOfWeek.ToString(),
                            StartTime = mentorAvailability.StartTime,
                            EndTime = mentorAvailability.EndTime,
                            DurationInMinutes = (int)(mentorAvailability.EndTime - mentorAvailability.StartTime).TotalMinutes,
                            IsBooked = mentorAvailability.IsBooked,
                        }).ToList(),
                        ReviewsCount = mentor.Bookings.Count(booking => booking.Review != null),
                        Role = "Mentor",
                    };

                case "Admin":
                    var admin = await dbContext.Users
                        .AsNoTracking()
                        .FirstOrDefaultAsync(a => a.Id == userId);

                    if (admin == null) return null;

                    return new AdminProfileDto
                    {
                        Id = admin.Id,
                        Email = admin.Email,
                        UserName = admin.UserName,
                        CreatedAt = admin.CreatedAt,
                        Role = "Admin"
                    };

                default:
                    return null;
            }
        }
    }
}
