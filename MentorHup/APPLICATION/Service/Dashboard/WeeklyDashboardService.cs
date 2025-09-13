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
            if (weeks <= 0) weeks = 8;

            var endDate = DateTime.UtcNow.Date;
            var startDate = endDate.AddDays(-(weeks - 1) * 7);

            var bookingsQuery = _context.Bookings.AsQueryable();

            if (role == "Mentor")
            {
                bookingsQuery = bookingsQuery.Where(b => b.Mentor.ApplicationUserId == userId);
            }
            else if (role == "Mentee")
            {
                bookingsQuery = bookingsQuery.Where(b => b.Mentee.ApplicationUserId == userId);
            }

            var filtered = await bookingsQuery
                .Where(b => b.StartTime.Date >= startDate && b.StartTime.Date <= endDate)
                .ToListAsync();

            var aggregated = filtered
                .GroupBy(b => new
                {
                    Year = ISOWeek.GetYear(b.StartTime),
                    Week = ISOWeek.GetWeekOfYear(b.StartTime)
                })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Week,
                    Count = g.Count()
                })
                .ToList();

            var result = new List<WeeklyBookingDto>();
            for (int i = 0; i < weeks; i++)
            {
                var dt = startDate.AddDays(i * 7);
                int weekNum = ISOWeek.GetWeekOfYear(dt);
                int weekYear = ISOWeek.GetYear(dt);

                var startOfWeek = ISOWeek.ToDateTime(weekYear, weekNum, DayOfWeek.Monday);
                var endOfWeek = startOfWeek.AddDays(6);

                var label = $"{startOfWeek:yyyy-MM-dd} → {endOfWeek:yyyy-MM-dd}";

                var count = aggregated
                    .FirstOrDefault(x => x.Year == weekYear && x.Week == weekNum)?.Count ?? 0;

                result.Add(new WeeklyBookingDto { WeekLabel = label, Count = count });
            }


            return result;
        }
    }
}
