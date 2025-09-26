using MentorHub.APPLICATION.DTOs.Availability;
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
            var query =  context.Mentors
                .Include(m => m.ApplicationUser)
                .Include(m => m.Bookings)
                    .ThenInclude(m => m.Review)
                .Include(m => m.MentorSkills) // Note: Here we can add Include(m => m.ApplicationUser) then we execlude the mentees who own IsDeleted = true, (Review ApplicationDbContext line 123)
                    .ThenInclude(ms => ms.Skill)
                .Include(s => s.Availabilities)
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
                    UserId= m.ApplicationUserId,
                    Name = m.Name,
                    Email = m.ApplicationUser.Email,
                    CompanyName = m.CompanyName,
                    Description = m.Description,
                    Experiences = m.Experiences,
                    Price = m.Price,
                    Field = m.Field,
                    CreatedAt = m.ApplicationUser.CreatedAt,
                    ImageLink = m.ImageUrl,
                    CVLink = m.CVUrl,
                    Skills = m.MentorSkills.Select(ms => ms.Skill.SkillName).ToList(),
                    Availabilities = m.Availabilities
                    .Where(a => a.StartTime > DateTime.Now) // give all mentors ignoring IsBooked or not
                    .Select(a => new MentorAvailabilityResponse
                    {
                        MentorAvailabilityId = a.Id,
                        DayOfWeek = a.StartTime.DayOfWeek.ToString(),
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
                .Include(m => m.ApplicationUser)
                .Include(m => m.Availabilities)
                .Include(m => m.MentorSkills)
                .FirstOrDefaultAsync(m => m.ApplicationUserId == userId);

            if (mentor == null)
                return false;

            if (!string.IsNullOrEmpty(request.UserName))
            {
                mentor.ApplicationUser.UserName = request.UserName;
                mentor.ApplicationUser.NormalizedUserName = mentor.ApplicationUser.UserName.ToUpper();
            }

            if (!string.IsNullOrEmpty(request.Name))
                mentor.Name = request.Name;
            
            if (!string.IsNullOrEmpty(request.CompanyName))
                mentor.CompanyName = request.CompanyName;

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

            if (request.SkillNames != null && request.SkillNames.Any())
            {
                var skills = await context.Skills
                    .Where(s => request.SkillNames.Contains(s.SkillName))
                    .ToListAsync();

                context.MentorSkills.RemoveRange(mentor.MentorSkills);

                foreach (var skill in skills)
                {
                    context.MentorSkills.Add(new MentorSkill
                    {
                        MentorId = mentor.Id,
                        SkillId = skill.Id
                    });
                }
            }

            /*
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
            */

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


        /// <summary>
        /// Download Mentor Image
        /// </summary>
        public async Task<(byte[] FileContent, string ContentType, string FileName)?> DownloadImageAsync(int mentorId)
        {
            var mentor = await context.Mentors.FirstOrDefaultAsync(m => m.Id == mentorId);
            if (mentor == null || string.IsNullOrEmpty(mentor.ImageUrl))
                return null;

            var filePath = Path.Combine(_webHostEnvironment.WebRootPath, "images/mentors", Path.GetFileName(new Uri(mentor.ImageUrl).LocalPath));
            if (!System.IO.File.Exists(filePath))
                return null;

            var contentType = "application/octet-stream"; // generic download
            var fileName = Path.GetFileName(filePath);
            var fileContent = await System.IO.File.ReadAllBytesAsync(filePath);

            return (fileContent, contentType, fileName);
        }

        public async Task<UploadCVResult> UploadCVAsync(IFormFile cv)
        {
            var userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return new UploadCVResult { IsSuccess = false, Errors = new[] { "User is not authenticated." } };
            }

            var mentor = await context.Mentors.FirstOrDefaultAsync(m => m.ApplicationUserId == userId);
            if (mentor == null)
            {
                return new UploadCVResult { IsSuccess = false, Errors = new[] { "Mentor profile not found." } };
            }

            if (cv != null && cv.Length > 0)
            {
                var uploadsFolder = Path.Combine(webHostEnvironment.WebRootPath, "cvs/mentors");
                Directory.CreateDirectory(uploadsFolder);

                // delete the old one from server (if exist)
                if (!string.IsNullOrEmpty(mentor.CVUrl))
                {
                    var oldFileName = Path.GetFileName(new Uri(mentor.CVUrl).LocalPath);
                    var oldFilePath = Path.Combine(uploadsFolder, oldFileName);
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                // upload new cv
                var uniqueFileName = $"{Guid.NewGuid()}_{cv.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using var fileStream = new FileStream(filePath, FileMode.Create);
                await cv.CopyToAsync(fileStream);

                var baseUrl = $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}";
                mentor.CVUrl = $"{baseUrl}/cvs/mentors/{uniqueFileName}";
            }

            await context.SaveChangesAsync();

            return new UploadCVResult { IsSuccess = true, CVUrl = mentor.CVUrl };
        }


        /// <summary>
        /// Download Mentor CV
        /// </summary>
        public async Task<(byte[] FileContent, string ContentType, string FileName)?> DownloadCVAsync(int mentorId)
        {
            var mentor = await context.Mentors.FirstOrDefaultAsync(m => m.Id == mentorId);
            if (mentor == null || string.IsNullOrEmpty(mentor.CVUrl))
                return null;

            var filePath = Path.Combine(_webHostEnvironment.WebRootPath, "cvs/mentors", Path.GetFileName(new Uri(mentor.CVUrl).LocalPath));
            if (!System.IO.File.Exists(filePath))
                return null;

            var fileExtension = Path.GetExtension(filePath).ToLower();
            var contentType = fileExtension switch
            {
                ".pdf" => "application/pdf",
                ".doc" => "application/msword",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                _ => "application/octet-stream"
            };

            var fileName = Path.GetFileName(filePath);
            var fileContent = await System.IO.File.ReadAllBytesAsync(filePath);

            return (fileContent, contentType, fileName);
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
                .CountAsync(b => b.Mentor.ApplicationUserId == mentorId && b.StartTime > DateTime.Now);

            return new MentorDashboardDto
            {
                TotalMentees = totalMentees,
                TotalReviews = totalReviews,
                TotalEarnings = totalEarnings,
                UpcomingBookings = upcomingBookings
            };
        }


        public async Task<(bool IsSuccess, string Message)> CreateAvailabilityAsync(CreateAvailabilityRequest request)
        {
            var userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return (false, "User is not authenticated.");

            var mentor = await context.Mentors
                .Include(mentor => mentor.ApplicationUser)
                .FirstOrDefaultAsync(mentor => mentor.ApplicationUserId == userId);

            if (mentor is null)
                return (false, "Mentor profile isn't found.");

            if (request.StartTime <= DateTime.Now)
                return (false, "Start time must be in the future.");

            if (request.EndTime <= request.StartTime)
                return (false, "End time must be after start time.");

            var overlapping = await context.MentorAvailabilities
                .AnyAsync(mentorAvailability => mentorAvailability.EndTime > request.StartTime
                                             && mentorAvailability.StartTime < request.EndTime);

            if (overlapping)
                return (false, "This time slot overlaps with an existing availability.");

            var duration = (int)(request.EndTime - request.StartTime).TotalMinutes;

            var availability = new MentorAvailability
            {
                MentorId = mentor.Id,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                DurationInMinutes = duration,
                IsBooked = false,
            };

            await context.MentorAvailabilities.AddAsync(availability);
            await context.SaveChangesAsync();

            return (true, "Availability created successfully.");
        }

        public async Task<(bool IsSuccess, string Message)> DeleteAvailabilityAsync(int availabilityId)
        {
            var userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId))
                return (false, "User is not authenticated.");

            var mentor = await context.Mentors
                .Include(m => m.Availabilities)
                .FirstOrDefaultAsync(m => m.ApplicationUserId == userId);

            if (mentor == null)
                return (false, "Mentor profile not found.");

            var availability = mentor.Availabilities.FirstOrDefault(a => a.Id == availabilityId);
            if (availability == null)
                return (false, "Availability not found.");

            if (availability.IsBooked)
                return (false, "Cannot delete availability because it is already booked.");

            context.MentorAvailabilities.Remove(availability);
            await context.SaveChangesAsync();

            return (true, "Availability deleted successfully.");
        }


        public async Task<(bool IsSuccess, string Message)> DeleteAllAvailabilitiesAsync()
        {
            var userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return (false, "User is not authenticated.");

            var mentor = await context.Mentors
                .Include(m => m.Availabilities)
                .FirstOrDefaultAsync(m => m.ApplicationUserId == userId);

            if (mentor == null)
                return (false, "Mentor profile not found.");

            var availabilitiesToDelete = mentor.Availabilities.Where(a => !a.IsBooked).ToList();
            if (!availabilitiesToDelete.Any())
                return (false, "No available slots can be deleted (all are booked).");

            context.MentorAvailabilities.RemoveRange(availabilitiesToDelete);
            await context.SaveChangesAsync();

            return (true, "All availabilities deleted successfully.");
        }


    }
}
