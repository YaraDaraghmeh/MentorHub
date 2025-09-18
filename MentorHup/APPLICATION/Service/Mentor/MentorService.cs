using MentorHup.APPLICATION.Common;
using MentorHup.APPLICATION.DTOs.Mentor;
using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MentorHup.APPLICATION.Service.Mentor
{
    public class MentorService(ApplicationDbContext context , IHttpContextAccessor httpContextAccessor,
        IWebHostEnvironment webHostEnvironment , IWebHostEnvironment _webHostEnvironment) : IMentorService
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
            var query =  context.Mentors.Include(m => m.MentorSkills) // Note: Here we can add Include(m => m.ApplicationUser) then we execlude the mentees who own IsDeleted = true, (Review ApplicationDbContext line 123)
               .ThenInclude(ms => ms.Skill).Include(s => s.Availabilities)
               .AsNoTracking().AsQueryable();

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
                    CreatedAt = m.ApplicationUser.CreatedAt,
                    ImageLink = m.ImageUrl,
                    Skills = m.MentorSkills.Select(ms => ms.Skill.SkillName).ToList(),
                    Availabilities = m.Availabilities
                    .Where(a => a.StartTime > DateTime.UtcNow) // give all mentors ignoring IsBooked or not
                    .Select(a => new MentorAvailabilityResponse
                    {
                        StartTime = a.StartTime,
                        EndTime = a.EndTime,
                        DurationInMinutes = (int)(a.EndTime - a.StartTime).TotalMinutes,
                        IsBooked = a.IsBooked,
                    }).ToList(),
                    ReviewCount =  m.Bookings.Count(b => b.Review != null)
                })
                .ToListAsync();

            return new PageResult<MentorOverviewDto>(items , totalCount , pageSize , pageNumber);
        }

        public async Task<bool> UpdateAsync(MentorUpdateRequest request)
        {
            var userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var mentor = await context.Mentors
                .Include(m => m.Availabilities)
                .Include(m => m.MentorSkills)
                .FirstOrDefaultAsync(m => m.ApplicationUserId == userId);

            if (mentor == null)
                return false;

            if (!string.IsNullOrEmpty(request.Name))
                mentor.Name = request.Name;

            if (!string.IsNullOrEmpty(request.Field))
                mentor.Field = request.Field;

            if (!string.IsNullOrEmpty(request.Description))
                mentor.Description = request.Description;

            if (request.Experiences.HasValue)
                mentor.Experiences = request.Experiences.Value;

            if (request.Price.HasValue)
                mentor.Price = request.Price.Value;

            if (!string.IsNullOrEmpty(request.StripeAccountId))
                mentor.StripeAccountId = request.StripeAccountId;

            if (request.SkillIds != null)
            {
                context.MentorSkills.RemoveRange(mentor.MentorSkills);

                foreach (var skillId in request.SkillIds)
                {
                    var skillExists = await context.Skills.AnyAsync(s => s.Id == skillId);
                    if (!skillExists)
                    {
                        return false;
                    }
                    context.MentorSkills.Add(new MentorSkill
                    {
                        MentorId = mentor.Id,
                        SkillId = skillId
                    });
                }
            }

            if (request.Availabilities != null)
            {
                context.MentorAvailabilities.RemoveRange(mentor.Availabilities);

                foreach (var availabilityDto in request.Availabilities)
                {
                    var duration = (int)(availabilityDto.EndTime - availabilityDto.StartTime).TotalMinutes;

                    context.MentorAvailabilities.Add(new MentorAvailability
                    {
                        MentorId = mentor.Id,
                        StartTime = availabilityDto.StartTime,
                        EndTime = availabilityDto.EndTime,
                        DurationInMinutes = duration,
                        IsBooked = false
                    });
                }
            }


            await context.SaveChangesAsync();
            return true;
        }

        public async Task<UploadImageResult> UploadImageAsync(IFormFile image)
        {
            var userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return new UploadImageResult { IsSuccess = false, Errors = new[] { "User is not authenticated." } };
            }

            var mentor = await context.Mentors.FirstOrDefaultAsync(m => m.ApplicationUserId == userId);
            if (mentor == null)
            {
                return new UploadImageResult { IsSuccess = false, Errors = new[] { "Mentor profile not found." } };
            }

            if (image != null && image.Length > 0)
            {
                var uploadsFolder = Path.Combine(webHostEnvironment.WebRootPath, "images/mentors");
                Directory.CreateDirectory(uploadsFolder);

                // delete the old one from server (if exist)
                if (!string.IsNullOrEmpty(mentor.ImageUrl))
                {
                    var oldFileName = Path.GetFileName(new Uri(mentor.ImageUrl).LocalPath);
                    var oldFilePath = Path.Combine(uploadsFolder, oldFileName);
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                // upload new image
                var uniqueFileName = $"{Guid.NewGuid()}_{image.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using var fileStream = new FileStream(filePath, FileMode.Create);
                await image.CopyToAsync(fileStream);

                var baseUrl = $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}";
                mentor.ImageUrl = $"{baseUrl}/images/mentors/{uniqueFileName}";
            }

            await context.SaveChangesAsync();

            return new UploadImageResult { IsSuccess = true, ImageUrl = mentor.ImageUrl };
        }

        public async Task<MentorDashboardDto> GetMentorDashboardAsync(string mentorId)
        {
            var totalMentees = await context.Bookings
                .Where(b => b.Mentor.ApplicationUserId == mentorId)
                .Select(b => b.MenteeId)
                .Distinct()
                .CountAsync();

            var totalReviews = await context.Reviews
                .CountAsync(r => r.Booking.Mentor.ApplicationUserId == mentorId);

            var totalEarnings = await context.Bookings
                .Where(b => b.Mentor.ApplicationUserId == mentorId && b.Status == BookingStatus.Confirmed)
                .SumAsync(b => (decimal?)b.Amount) ?? 0;

            var upcomingBookings = await context.Bookings
                .CountAsync(b => b.Mentor.ApplicationUserId == mentorId && b.StartTime > DateTime.UtcNow);

            return new MentorDashboardDto
            {
                TotalMentees = totalMentees,
                TotalReviews = totalReviews,
                TotalEarnings = totalEarnings,
                UpcomingBookings = upcomingBookings
            };
        }
    }
}
