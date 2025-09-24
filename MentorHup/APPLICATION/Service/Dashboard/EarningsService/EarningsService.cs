using MentorHup.APPLICATION.DTOs.Booking;
using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace MentorHup.APPLICATION.Service.Dashboard.EarningsService
{
    public class EarningsService(ApplicationDbContext _context) : IEarningsService
    {
        public async Task<List<WeeklyEarningsDto>> GetWeeklyEarningsAsync(string role, string userId, int weeks = 8)
        {
            if (weeks < 1 || weeks > 52)
                weeks = 8;

            var paymentsQuery = _context.Payments
                .Include(p => p.Booking)
                .Where(p => p.Status == PaymentStatus.Succeeded);

            if (role == "Mentor")
                paymentsQuery = paymentsQuery
                    .Where(p => p.Booking.Mentor.ApplicationUserId == userId);

            var filtered = await paymentsQuery
                                .AsNoTracking() 
                                .ToListAsync();

            var result = new List<WeeklyEarningsDto>();

            var today = DateTime.Now.Date;
            var currentWeekStart = today.AddDays(-(int)today.DayOfWeek + (int)DayOfWeek.Monday);
            var startDate = currentWeekStart.AddDays(-(weeks - 1) * 7);

            for (int i = 0; i < weeks; i++)
            {
                var weekStart = startDate.AddDays(i * 7);
                var weekEnd = weekStart.AddDays(6);

                int weekNum = ISOWeek.GetWeekOfYear(weekStart);
                int weekYear = ISOWeek.GetYear(weekStart);

                decimal total = filtered
                    .Where(p =>
                        ISOWeek.GetYear(p.CreatedAt) == weekYear &&
                        ISOWeek.GetWeekOfYear(p.CreatedAt) == weekNum)
                    .Sum(p => p.Amount);

                var label = $"{weekStart:yyyy-MM-dd} → {weekEnd:yyyy-MM-dd}";

                result.Add(new WeeklyEarningsDto
                {
                    WeekLabel = label,
                    TotalEarnings = total
                });
            }

            return result;
        }
    }
}
