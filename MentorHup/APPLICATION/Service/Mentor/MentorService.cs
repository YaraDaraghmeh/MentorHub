using MentorHup.APPLICATION.Common;
using MentorHup.APPLICATION.DTOs.Mentor;
using MentorHup.Infrastructure.Context;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace MentorHup.APPLICATION.Service.Mentor
{
    public class MentorService(ApplicationDbContext context) : IMentorService
    {
        public async Task<PageResult<MentorOverviewDto>> GetAllMentorsAsync(
            int pageSize,
            int pageNumber,
            string? field,
            string? skillName,
            decimal? minPrice,
            decimal? maxPrice,
            int? Experiences)
        {
            var query =  context.Mentors.Include(m => m.MentorSkills)
               .ThenInclude(ms => ms.Skill).Include(s => s.Availabilities)
               .AsQueryable();

            if (!string.IsNullOrWhiteSpace(field))
                query = query.Where(m => m.Field.Contains(field));

            if (!string.IsNullOrWhiteSpace(skillName))
                query = query.Where(m => m.MentorSkills.Any(ms => ms.Skill.SkillName.Contains(skillName)));

            if (minPrice.HasValue)
                query = query.Where(m => m.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(m => m.Price <= maxPrice.Value);

            if (Experiences.HasValue)
                query = query.Where(m => m.Experiences == Experiences.Value);

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new MentorOverviewDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    Description = m.Description,
                    Experiences = m.Experiences,
                    Price = m.Price,
                    Field = m.Field,
                    Skills = m.MentorSkills.Select(ms => ms.Skill.SkillName).ToList(),
                    Availabilities = m.Availabilities.Where(a => !a.IsBooked).Select(a => new MentorAvailabilityRequest
                    {
                        DurationInMinutes = a.DurationInMinutes,
                        StartTime = a.StartTime,
                        EndTime = a.EndTime
                    }).ToList(),
                    ReviewCount =  m.Bookings.Count(b => b.Review != null)
                })
                .ToListAsync();

            return new PageResult<MentorOverviewDto>(items , totalCount , pageSize , pageNumber);
        }
    }
}
