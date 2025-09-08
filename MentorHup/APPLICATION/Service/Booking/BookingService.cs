using MentorHup.APPLICATION.DTOs.Booking;
using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace MentorHup.APPLICATION.Service.Booking;

public class BookingService(ApplicationDbContext context) : IBookingService
{
    public async Task<BookingSessionData> PrepareBookingForCheckoutAsync(CreateBookingDto dto)
    {
        var mentee = await context.Mentees.FirstOrDefaultAsync(m => m.Id == dto.MenteeId);
        if (mentee == null) throw new ArgumentException("Mentee not found.");

        var availability = await context.MentorAvailabilities
            .Include(a => a.Mentor)
            .FirstOrDefaultAsync(ma => ma.Id == dto.MentorAvailabilityId);
        if (availability == null) throw new ArgumentException("Mentor availability not found.");

        var isAlreadyBooked = await context.Bookings
            .AnyAsync(b => b.MentorAvailabilityId == dto.MentorAvailabilityId && b.IsConfirmed);
        if (isAlreadyBooked) throw new InvalidOperationException("This time slot is already booked.");

        return new BookingSessionData
        {
            MenteeId = dto.MenteeId,
            MentorId = availability.MentorId,
            MentorAvailabilityId = dto.MentorAvailabilityId,
            Amount = availability.Mentor.Price,
            StartTime = availability.StartTime,
            EndTime = availability.EndTime,
            MenteeName = mentee.Name,
            MentorName = availability.Mentor.Name,
            MentorStripeAccountId = availability.Mentor.StripeAccountId
        };
    }
}
