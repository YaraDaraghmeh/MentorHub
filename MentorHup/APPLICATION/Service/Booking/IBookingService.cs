using MentorHup.APPLICATION.DTOs.Booking;

namespace MentorHup.APPLICATION.Service.Booking
{
    public interface IBookingService
    {
        Task<BookingSessionData> PrepareBookingForCheckoutAsync(CreateBookingDto dto);
    }
}