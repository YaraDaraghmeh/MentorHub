using MentorHup.APPLICATION.Dtos.Mentee;
using MentorHup.APPLICATION.DTOs.Mentee;
using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MentorHup.APPLICATION.Service.Mentee
{
    public class MenteeService(ApplicationDbContext _context, IHttpContextAccessor httpContextAccessor, IWebHostEnvironment _webHostEnvironment) :IMenteeService
    {
        /// <summary>
        /// Download Mentor Image
        /// </summary>
        public async Task<(byte[] FileContent, string ContentType, string FileName)?> DownloadImageAsync(int menteeId)
        {
            var mentee = await _context.Mentees.FirstOrDefaultAsync(mentee => mentee.Id == menteeId);
            if (mentee == null || string.IsNullOrEmpty(mentee.ImageUrl))
                return null;

            var filePath = Path.Combine(_webHostEnvironment.WebRootPath, "images/mentees", Path.GetFileName(new Uri(mentee.ImageUrl).LocalPath));
            if (!System.IO.File.Exists(filePath))
                return null;

            var contentType = "application/octet-stream"; // generic download
            var fileName = Path.GetFileName(filePath);
            var fileContent = await System.IO.File.ReadAllBytesAsync(filePath);

            return (fileContent, contentType, fileName);
        }

        public async Task<bool> UpdateAsync(MenteeUpdateRequest request)
        {
            var userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _context.Users
                .Include(u => u.Mentee)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null || user.Mentee == null)
                return false;

            var mentee = user.Mentee;

            if (!string.IsNullOrEmpty(request.UserName))
            {
                user.UserName = request.UserName;
                user.NormalizedUserName = user.UserName.ToUpper();
            }

            if (!string.IsNullOrEmpty(request.Name))
                mentee.Name = request.Name;

            if (!string.IsNullOrEmpty(request.Gender))
                mentee.Gender = request.Gender;

            if (request.ImageForm != null && request.ImageForm.Length > 0)
            {
                var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images/mentees");
                Directory.CreateDirectory(uploadsFolder);

                // delete old image on server (if exist)
                if (!string.IsNullOrEmpty(mentee.ImageUrl))
                {
                    var oldFileName = Path.GetFileName(new Uri(mentee.ImageUrl).LocalPath);
                    var oldFilePath = Path.Combine(uploadsFolder, oldFileName);
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{request.ImageForm.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using var fileStream = new FileStream(filePath, FileMode.Create);
                await request.ImageForm.CopyToAsync(fileStream);


                var baseUrl = $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}";
                mentee.ImageUrl = $"{baseUrl}/images/mentees/{uniqueFileName}";
            }

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<MenteeDashboardDto?> GetDashboardStatsAsync()
        {
            var userId = httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _context.Users
                .Include(u => u.Mentee)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null || user.Mentee == null)
                return null;

            var menteeId = user.Mentee.Id;
            var now = DateTime.Now;

            var bookings = await _context.Bookings
                .Where(b => b.MenteeId == menteeId && b.Status == BookingStatus.Confirmed)
                .ToListAsync();

            // number of My Mentors (distinct)
            var myMentors = bookings
               .Select(b => b.MentorId)
               .Distinct()
               .Count();

            // scheduled sessions
            var scheduledSessions = bookings
                .Count(booking => booking.StartTime > now);

            // completed sessions
            var completedSessions = bookings // there is no step on logic that change the confirmed status after it exceeds the current time, so we add another condition (end time must less that current time)
                .Count(booking => booking.EndTime <= now); // there is no need to check the starting time is less than current time

            // learning hours
            var learningHours = bookings
                .Where(booking => booking.EndTime <= now)
                .Sum(booking => (booking.EndTime - booking.StartTime).TotalHours);

            return new MenteeDashboardDto
            {
                MyMentors = myMentors,
                ScheduledSessions = scheduledSessions,
                CompletedSessions = completedSessions,
                LearningHours = Math.Round(learningHours, 1) // ex: 7.5 hours
            };
        }
    }
}
