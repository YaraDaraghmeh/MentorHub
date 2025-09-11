using MentorHup.APPLICATION.Common;
using MentorHup.APPLICATION.DTOs.Booking;
using MentorHup.APPLICATION.Responses;

namespace MentorHup.APPLICATION.Service.Booking
{
    public interface IBookingService
    {
        Task<BookingSessionData> PrepareBookingForCheckoutAsync(CreateBookingDto dto);
        Task<ApiResponse<string>> CancelBookingAsync(int bookingId, string userId, string role);
        Task<PageResult<BookingOverviewDto>> GetBookingsForUserAsync(string appUserId,
            string role
            ,int pageNumber,
            int pageSize);


    }
}