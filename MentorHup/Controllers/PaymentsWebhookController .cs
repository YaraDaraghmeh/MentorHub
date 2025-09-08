using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/payments")]
public class PaymentsWebhookController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PaymentsWebhookController(ApplicationDbContext context)
    {
        _context = context;
    }
    [HttpPost("stripe-webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        var json = await new StreamReader(Request.Body).ReadToEndAsync();

        Stripe.Event stripeEvent = Stripe.EventUtility.ConstructEvent(
                        json,
                        Request.Headers["Stripe-Signature"],
                        "whsec_TCX5H5uP2lRZjRStpOg2ze6bxNg9zDre",
                         throwOnApiVersionMismatch: false
);

        //Console.WriteLine($"Webhook hit at: {DateTime.Now}");
        //Console.WriteLine($"Event type: {stripeEvent.Type}");
        //Console.WriteLine($"Payload length: {json.Length}");
        //Console.WriteLine($"Payload snippet: {json.Substring(0, Math.Min(500, json.Length))}");

        if (stripeEvent.Type == "checkout.session.completed")
        {
            var session = stripeEvent.Data.Object as Stripe.Checkout.Session;

            if (session == null || string.IsNullOrEmpty(session.ClientReferenceId))
            {
                Console.WriteLine("⚠️ Session or ClientReferenceId is null");
                return BadRequest();
            }

            var ids = session.ClientReferenceId.Split(':');

            if (ids.Length != 2)
            {
                Console.WriteLine("⚠️ ClientReferenceId format is invalid");
                return BadRequest();
            }

            int menteeId = int.Parse(ids[0]);
            int mentorAvailabilityId = int.Parse(ids[1]);

            var availability = await _context.MentorAvailabilities
                .Include(a => a.Mentor)
                .FirstOrDefaultAsync(a => a.Id == mentorAvailabilityId);

            if (availability == null)
            {
                Console.WriteLine("⚠️ Mentor availability not found");
                return BadRequest();
            }
            availability.IsBooked = true;
            _context.MentorAvailabilities.Update(availability);

            var booking = new Booking
            {
                MenteeId = menteeId,
                MentorId = availability.MentorId,
                MentorAvailabilityId = mentorAvailabilityId,
                StartTime = availability.StartTime,
                EndTime = availability.EndTime,
                Amount = availability.Mentor.Price,
                IsConfirmed = true
            };

            booking.Payment = new Payment
            {
                Amount = booking.Amount,
                Currency = "USD",
                PaymentIntentId = session.PaymentIntentId,
                Status = "Succeeded"
            };

            booking.AdminCommission = new AdminCommission
            {
                Amount = 1
            };

            _context.Bookings.Add(booking);

            try
            {
                Console.WriteLine("Booking to save:");
                Console.WriteLine($"MenteeId: {booking.MenteeId}, MentorId: {booking.MentorId}, AvailabilityId: {booking.MentorAvailabilityId}, Amount: {booking.Amount}");

                await _context.SaveChangesAsync();
                Console.WriteLine("✅ Booking saved successfully");

                Console.WriteLine("Booking saved with ID: " + booking.Id);

            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ Error saving booking: {ex.Message}");
                return StatusCode(500);
            }
        }

        return Ok();
    }


}
