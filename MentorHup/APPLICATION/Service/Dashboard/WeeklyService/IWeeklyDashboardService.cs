using MentorHup.APPLICATION.DTOs.Booking;

namespace MentorHup.APPLICATION.Service.Dashboard.WeeklyService
{
    public interface IWeeklyDashboardService
    {
        Task<List<WeeklyBookingDto>> GetWeeklyBookingsAsync(string role, string userId, int weeks = 8);
    }

}
