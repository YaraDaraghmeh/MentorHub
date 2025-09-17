using MentorHup.APPLICATION.Settings;
using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

[ApiController]
[Route("api/payments")]
public class PaymentsWebhookController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IOptions<StripeSettings> stripeOptions;
    private readonly IEmailSender emailSender;

    public PaymentsWebhookController(ApplicationDbContext context, IOptions<StripeSettings> stripeOptions, IEmailSender emailSender)
    {
        _context = context;
        this.stripeOptions = stripeOptions;
        this.emailSender = emailSender;
    }
    [HttpPost("stripe-webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        var json = await new StreamReader(Request.Body).ReadToEndAsync();

        Stripe.Event stripeEvent = Stripe.EventUtility.ConstructEvent(
                        json,
                        Request.Headers["Stripe-Signature"],
                        stripeOptions.Value.WebhookSecret,
                        throwOnApiVersionMismatch: false
        );

        //Console.WriteLine("Webhook hit!");

        //Console.WriteLine($"Webhook hit at: {DateTime.Now}");
        //Console.WriteLine($"Event type: {stripeEvent.Type}");
        //Console.WriteLine($"Payload length: {json.Length}");
        //Console.WriteLine($"Payload snippet: {json.Substring(0, Math.Min(500, json.Length))}");

        if (stripeEvent.Type == "checkout.session.completed")
        {
            var session = stripeEvent.Data.Object as Stripe.Checkout.Session;

            if (session == null || string.IsNullOrEmpty(session.ClientReferenceId))
            {
                //Console.WriteLine("⚠️ Session or ClientReferenceId is null");
                return BadRequest();
            }

            var ids = session.ClientReferenceId.Split(':');

            if (ids.Length != 2)
            {
                //Console.WriteLine("⚠️ ClientReferenceId format is invalid");
                return BadRequest();
            }

            int menteeId = int.Parse(ids[0]);
            int mentorAvailabilityId = int.Parse(ids[1]);

            var availability = await _context.MentorAvailabilities
                .Include(a => a.Mentor)
                .FirstOrDefaultAsync(a => a.Id == mentorAvailabilityId);

            if (availability == null)
            {
                //Console.WriteLine("⚠️ Mentor availability not found");
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
                IsConfirmed = true,
                Status = BookingStatus.Confirmed,
                MeetingUrl = $"https://meet.jit.si/mentohup-session-{menteeId}-{mentorAvailabilityId}-{DateTime.UtcNow.Ticks}"
            };

            booking.Payment = new Payment
            {
                Amount = booking.Amount,
                Currency = "USD",
                PaymentIntentId = session.PaymentIntentId,
                Status = PaymentStatus.Succeeded
            };

            booking.AdminCommission = new AdminCommission
            {
                Amount = 1
            };

            _context.Bookings.Add(booking);

            try
            {
                //Console.WriteLine("Booking to save:");
                //Console.WriteLine($"MenteeId: {booking.MenteeId}, MentorId: {booking.MentorId}, AvailabilityId: {booking.MentorAvailabilityId}, Amount: {booking.Amount}");

                await _context.SaveChangesAsync();
                //Console.WriteLine("✅ Booking saved successfully");

                //Console.WriteLine("Booking saved with ID: " + booking.Id);

                var mentee = await _context.Mentees
                    .Include(ment => ment.ApplicationUser)
                    .FirstOrDefaultAsync(ment => ment.Id == menteeId);

                if (mentee == null)
                {
                    //Console.WriteLine("⚠️ Mentee not found");
                    return BadRequest();
                }


                if (mentee == null || mentee.ApplicationUser == null)
                {
                    //Console.WriteLine("⚠️ Mentee or ApplicationUser not found");
                    return BadRequest();
                }

                if (availability.Mentor.ApplicationUser == null)
                {
                    //Console.WriteLine("⚠️ Mentor ApplicationUser not found");
                    return BadRequest();
                }

                var menteeEmail = mentee.ApplicationUser.Email;
                var mentorEmail = availability.Mentor.ApplicationUser.Email;

                string menteeSubject = "Booking Confirmed!";
                string body = $@"
                    Hello {booking.Mentee.Name},

                    Your session with {availability.Mentor.Name} is confirmed.
                    Start Time: {booking.StartTime:yyyy-MM-dd HH:mm}
                    End Time: {booking.EndTime:yyyy-MM-dd HH:mm}
                    Meeting URL: {booking.MeetingUrl}
                    Amount Paid: ${booking.Amount}

                    Thank you for using our platform!
                ";

                 await emailSender.SendEmailAsync(menteeEmail.Trim(), menteeSubject, body);

                string mentorSubject = "New Session Scheduled!";
                string mentorBody = $@"
                    Hello {availability.Mentor.Name},

                    You have a new confirmed session with {booking.Mentee.Name}.
                    Start Time: {booking.StartTime:yyyy-MM-dd HH:mm}
                    End Time: {booking.EndTime:yyyy-MM-dd HH:mm}
                    Meeting URL: {booking.MeetingUrl}
                    Amount Received: ${booking.Amount - 1} (after platform commission)

                    Thank you!
                ";

                await emailSender.SendEmailAsync(mentorEmail.Trim(), mentorSubject, mentorBody);


            }
            catch (Exception ex)
            {
                //Console.WriteLine($"⚠️ Error saving booking: {ex.Message}");
                return StatusCode(500);
            }
        }

        return Ok();
    }


}
