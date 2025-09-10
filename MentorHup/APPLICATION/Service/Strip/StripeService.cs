using MentorHup.APPLICATION.DTOs.Booking;
using MentorHup.APPLICATION.Service.Strip;
using MentorHup.APPLICATION.Settings;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;

namespace MentorHup.APPLICATION.Service.Strip;

public class StripeService : IStripeService
{
    private readonly StripSettings _stripeSettings;
    public StripeService(IOptions<StripSettings> options)
    {
        _stripeSettings = options.Value;

        Stripe.StripeConfiguration.ApiKey = _stripeSettings.SecretKey;
    }

    public async Task<string> CreateCheckoutSessionAsync(BookingSessionData booking)
    {
        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = new List<SessionLineItemOptions>
        {
            new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    UnitAmountDecimal = booking.Amount * 100, 
                    Currency = "usd",
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = $"Session with {booking.MentorName}",
                        Description = $"From {booking.StartTime:HH:mm} to {booking.EndTime:HH:mm}"
                    }
                },
                Quantity = 1
            }
        },
            Mode = "payment",
            SuccessUrl = "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
            CancelUrl = "http://localhost:3000/cancel",
            ClientReferenceId = $"{booking.MenteeId}:{booking.MentorAvailabilityId}",

            // الأهم 👇
            PaymentIntentData = new SessionPaymentIntentDataOptions
            {
                ApplicationFeeAmount = 100, 
                TransferData = new SessionPaymentIntentDataTransferDataOptions
                {
                    Destination = booking.MentorStripeAccountId 
                }
            },
            Metadata = new Dictionary<string, string>
            {
                { "MenteeName", booking.MenteeName },
                { "StartTime", booking.StartTime.ToString("yyyy-MM-dd HH:mm") },
                { "EndTime", booking.EndTime.ToString("yyyy-MM-dd HH:mm") }
            }
        };

        var service = new SessionService();
        var session = await service.CreateAsync(options);
        return session.Url!;
    }

    public async Task<Refund> RefundPaymentAsync(string paymentIntentId)
    {
        if (string.IsNullOrWhiteSpace(paymentIntentId))
            throw new ArgumentException("PaymentIntentId cannot be null or empty.");

        var refundService = new RefundService();

        var options = new RefundCreateOptions
        {
            PaymentIntent = paymentIntentId,
            Reason = "requested_by_customer" // مثال على السبب
        };

        var refund = await refundService.CreateAsync(options);
        return refund;
    }
}
