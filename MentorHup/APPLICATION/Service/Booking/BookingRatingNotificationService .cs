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

                var now = DateTime.UtcNow;

                var bookings = await db.Bookings
                    .Include(b => b.Mentee)
                    .ThenInclude(m => m.ApplicationUser)
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
                        <h3>Hello {booking.Mentee.Name},</h3>
                        <p>Your session with mentor <strong>{booking.Mentee.Name}</strong> has ended.</p>
                        <p>You can now rate your mentor <a href='https://mentorhub-zeta.vercel.app/givefeedback/{booking.Id}'>here</a>.</p>";

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
