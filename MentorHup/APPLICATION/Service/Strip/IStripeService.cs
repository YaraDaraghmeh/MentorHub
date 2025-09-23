using MentorHup.APPLICATION.DTOs.Booking;
using Stripe;

namespace MentorHup.APPLICATION.Service.Strip
{
   
        public interface IStripeService
        {
            Task<string> CreateCheckoutSessionAsync(BookingSessionData booking);
            Task<Refund> RefundPaymentAsync(string paymentIntentId);

        }

}