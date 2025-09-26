using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.UI.Services;


namespace MentorHup.APPLICATION.Service.Booking
{
    public class BookingRatingNotificationService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<BookingRatingNotificationService> _logger;

        public BookingRatingNotificationService(IServiceScopeFactory scopeFactory,
                                                ILogger<BookingRatingNotificationService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var emailSender = scope.ServiceProvider.GetRequiredService<IEmailSender>();

                var now = DateTime.Now;

                var bookings = await db.Bookings
                    .Include(b => b.Mentee)
                        .ThenInclude(mentee => mentee.ApplicationUser)
                    .Include(b => b.Mentor)
                        .ThenInclude(mentor => mentor.ApplicationUser)
                    .Where(b => b.EndTime <= now &&
                                b.RatingEmailSent == false &&
                                b.Status != BookingStatus.Cancelled)
                    .ToListAsync(stoppingToken);

                foreach (var booking in bookings)
                {
                    try
                    {
                        var subject = "Rate Your Mentor";
                        var message = $@"
                        <html>
                          <body style='font-family: Arial, sans-serif; background-color: #f4f4f7; margin:0; padding:0;'>
                            <table align='center' width='600' cellpadding='0' cellspacing='0' style='background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);'>
                              <tr>
                                <td style='padding: 20px; text-align: center; background-color: #4f46e5; color: white; font-size: 24px;'>
                                  MentorHub
                                </td>
                              </tr>
                              <tr>
                                <td style='padding: 30px; color: #333333;'>
                                  <h3 style='color: #111827;'>Hello {booking.Mentee.Name},</h3>
                                  <p>Your session with your mentor <strong>{booking.Mentor.Name}</strong> has ended.</p>
                                  <p>We value your feedback! Please rate your mentor to help improve our community.</p>
                                  <p style='text-align: center; margin: 30px 0;'>
                                    <a href='https://mentorhub-zeta.vercel.app/givefeedback/{booking.Id}' 
                                       style='background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;'>
                                      Rate Your Mentor
                                    </a>
                                  </p>
                                  <p style='font-size: 12px; color: #6b7280; text-align: center; margin-top: 40px;'>
                                    © 2025 MentorHub. All rights reserved.
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </body>
                        </html>";

                        await emailSender.SendEmailAsync(booking.Mentee.ApplicationUser.Email, subject, message);

                        booking.RatingEmailSent = true;
                        await db.SaveChangesAsync(stoppingToken);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to send rating email for BookingId: {BookingId}", booking.Id);
                    }
                }

                    await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }
    }
}
