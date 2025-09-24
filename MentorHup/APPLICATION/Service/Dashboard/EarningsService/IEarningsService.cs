using MentorHup.APPLICATION.DTOs.Booking;

namespace MentorHup.APPLICATION.Service.Dashboard.EarningsService
{
    public interface IEarningsService
    {
        Task<List<WeeklyEarningsDto>> GetWeeklyEarningsAsync(string role, string userId, int weeks = 8);
    }
}
