using MentorHup.APPLICATION.DTOs.Booking;
using MentorHup.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace MentorHup.APPLICATION.Service.Dashboard
{
    public class WeeklyDashboardService(ApplicationDbContext _context) : IWeeklyDashboardService
    {
        public async Task<List<WeeklyBookingDto>> GetWeeklyBookingsAsync(string role, string userId, int weeks = 8)
        {
            if (weeks < 1 || weeks > 52)
                weeks = 8;

            var bookingsQuery = _context.Bookings.AsQueryable();

            if (role == "Mentor")
                bookingsQuery = bookingsQuery.Where(b => b.Mentor.ApplicationUserId == userId);
            else if (role == "Mentee")
                bookingsQuery = bookingsQuery.Where(b => b.Mentee.ApplicationUserId == userId);

            var filtered = await bookingsQuery
                                    .AsNoTracking()
                                    .ToListAsync();

            var result = new List<WeeklyBookingDto>();

            var today = DateTime.UtcNow.Date;
            var currentWeekStart = today.AddDays(-(int)today.DayOfWeek + (int)DayOfWeek.Monday);

            var startDate = currentWeekStart.AddDays(-(weeks - 1) * 7);

            for (int i = 0; i < weeks; i++)
            {
                var weekStart = startDate.AddDays(i * 7);
                var weekEnd = weekStart.AddDays(6);

                int weekNum = ISOWeek.GetWeekOfYear(weekStart);
                int weekYear = ISOWeek.GetYear(weekStart);

                var count = filtered.Count(b =>
                    ISOWeek.GetYear(b.CreatedAt) == weekYear &&
                    ISOWeek.GetWeekOfYear(b.CreatedAt) == weekNum
                );

                var label = $"{weekStart:yyyy-MM-dd} → {weekEnd:yyyy-MM-dd}";

                result.Add(new WeeklyBookingDto
                {
                    WeekLabel = label,
                    Count = count
                });
            }

            return result;
        }
    }
}
