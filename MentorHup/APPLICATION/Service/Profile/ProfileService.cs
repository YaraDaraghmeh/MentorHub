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
                        ImageLink = mentee.ImageUrl,
                        Gender = mentee.Gender,
                        Role = "Mentee"
                    };

                case "Mentor":
                    var mentor = await dbContext.Mentors
                        .AsNoTracking()
                        .Include(ment => ment.ApplicationUser)
                        .Include(ment => ment.MentorSkills)
                            .ThenInclude(mentSkill => mentSkill.Skill)
                        .FirstOrDefaultAsync(m => m.ApplicationUserId == userId);

                    if (mentor == null) return null;

                    return new MentorProfileDto
                    {
                        Id = mentor.Id,
                        ApplicationUserId = mentor.ApplicationUserId,
                        Email = mentor.ApplicationUser.Email,
                        UserName = mentor.ApplicationUser.UserName,
                        ImageLink = mentor.ImageUrl,
                        CVLink = mentor.CVUrl,
                        Description = mentor.Description,
                        CompnayName = mentor.CompanyName,
                        Price = mentor.Price,
                        Skills = mentor.MentorSkills.Select(s => s.Skill.SkillName).ToList(),
                        Role = "Mentor"
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
                        Role = "Admin"
                    };

                default:
                    return null;
            }
        }
    }
}
