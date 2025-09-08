using MentorHup.APPLICATION.DTOs.Booking;

namespace MentorHup.APPLICATION.Service.Strip
{
   
        public interface IStripeService
        {
            Task<string> CreateCheckoutSessionAsync(BookingSessionData booking);
        }
    
}