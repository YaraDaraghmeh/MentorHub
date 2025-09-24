using MentorHup.APPLICATION.DTOs.Booking;
using MentorHup.APPLICATION.Settings;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;

namespace MentorHup.APPLICATION.Service.Strip;

public class StripeService : IStripeService
{
    private readonly StripeSettings _stripeSettings;
    public StripeService(IOptions<StripeSettings> options)
    {
        _stripeSettings = options.Value;

        Stripe.StripeConfiguration.ApiKey = _stripeSettings.SecretKey;
    }

    public async Task<string> CreateCheckoutSessionAsync(BookingSessionData booking)
    {
        Console.WriteLine("=== Preparing Stripe Checkout Session ===");
        Console.WriteLine($"MenteeId: {booking.MenteeId}, MentorAvailabilityId: {booking.MentorAvailabilityId}");
        Console.WriteLine($"Amount: {booking.Amount}, MentorStripeAccountId: '{booking.MentorStripeAccountId}'");

        var mentorAccountId = booking.MentorStripeAccountId?.Trim(); // 🟢 إزالة الفراغات


        if (string.IsNullOrWhiteSpace(mentorAccountId))
        {
            throw new ArgumentException("Mentor Stripe AccountId is invalid.");
        }

        if (booking.Amount <= 0)
        {
            throw new ArgumentException("Booking amount must be greater than 0.");
        }

        var clientReferenceId = $"{booking.MenteeId}:{booking.MentorAvailabilityId}";
        Console.WriteLine("ClientReferenceId: " + clientReferenceId);

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
            SuccessUrl = "http://localhost:5175/success?session_id={CHECKOUT_SESSION_ID}",
            CancelUrl = "http://localhost:5175/cancel",
            ClientReferenceId = $"{booking.MenteeId}:{booking.MentorAvailabilityId}", // stripe لتتبع الحجز بين تطبيقي وال

            // الأهم 👇
            PaymentIntentData = new SessionPaymentIntentDataOptions
            {
                ApplicationFeeAmount = 100, // عمولة المنصة
                TransferData = new SessionPaymentIntentDataTransferDataOptions
                {
                    Destination = mentorAccountId // mentor ارسال المال لحساب ال 
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
            Reason = "requested_by_customer",
            RefundApplicationFee = false, // false: لا تسترجع عمولة المنصة
            ReverseTransfer = false // false: mentor لا تسترجع ما تم تحويله لل
        };

        var refund = await refundService.CreateAsync(options);
        return refund;
    }
}
