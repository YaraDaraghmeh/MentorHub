using MentorHup.APPLICATION.DTOs.Booking;
using MentorHup.APPLICATION.Service.Dashboard;

namespace MentorHup.APPLICATION.Service.Dashboard.EarningsService
{
    public interface IEarningsService
    {
        Task<List<WeeklyEarningsDto>> GetWeeklyEarningsAsync(string role, string userId, int weeks = 8);
    }
}
