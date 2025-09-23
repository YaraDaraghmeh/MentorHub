using MentorHup.APPLICATION.Common;
using MentorHup.APPLICATION.DTOs.Booking;
using MentorHup.APPLICATION.Responses;
using MentorHup.APPLICATION.Service.Strip;
using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;

namespace MentorHup.APPLICATION.Service.Booking;

public class BookingService(ApplicationDbContext context, IStripeService stripeService, IEmailSender emailSender) : IBookingService
{
    private readonly IEmailSender emailSender = emailSender;

    public async Task<ApiResponse<string>> CancelBookingAsync(int bookingId, string appUserId, string role)
    {
        var booking = await context.Bookings
            .Include(b => b.Mentee)
                .ThenInclude(m => m.ApplicationUser)
            .Include(b => b.Mentor)
            .Include(b => b.MentorAvailability)
            .Include(b => b.Payment)
            .FirstOrDefaultAsync(b => b.Id == bookingId);

        if (booking == null) return ApiResponse<string>.FailResponse("Booking not found.");

        if (role == "Mentee" && booking.Mentee.ApplicationUserId != appUserId)
            return ApiResponse<string>.FailResponse("You can only cancel your own bookings.");

        if (role == "Mentor" && booking.Mentor.ApplicationUserId != appUserId)
            return ApiResponse<string>.FailResponse("You can only cancel your own bookings.");

        if (booking.StartTime <= DateTime.Now.AddHours(1))
            return ApiResponse<string>.FailResponse("Cannot cancel less than 1 hour before session.");

        using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            if (booking.Payment != null && booking.Payment.Status == PaymentStatus.Succeeded)
            {
                var refund = await stripeService.RefundPaymentAsync(booking.Payment.PaymentIntentId);

                if (refund.Status != "succeeded")
                    return ApiResponse<string>.FailResponse("Refund failed in Stripe.");

                booking.Payment.Status = PaymentStatus.Refunded;
                booking.Payment.RefundedAt = DateTime.Now;
            }

            booking.Status = BookingStatus.Cancelled;
            if (booking.MentorAvailability != null)
                booking.MentorAvailability.IsBooked = false;

            await context.SaveChangesAsync();
            await transaction.CommitAsync();

            var menteeEmail = booking.Mentee.ApplicationUser.Email;
            var mentorEmail = booking.Mentor.ApplicationUser.Email;

            string subject = "Booking Cancelled";

            string menteeBody = $@"
            Hello {booking.Mentee.Name},

            Your session with {booking.Mentor.Name} scheduled on {booking.StartTime:yyyy-MM-dd HH:mm} has been cancelled.

            Meeting URL: {booking.MeetingUrl}

            Refund Status: {(booking.Payment != null && booking.Payment.Status == PaymentStatus.Refunded ? "Refunded" : "Not applicable")}

            Thank you for using our platform!
            ";


            await emailSender.SendEmailAsync(menteeEmail, subject, menteeBody);

            string mentorBody = $@"
            Hello {booking.Mentor.Name},

            The session with {booking.Mentee.Name} scheduled on {booking.StartTime:yyyy-MM-dd HH:mm} has been cancelled.

            Meeting URL: {booking.MeetingUrl}

            Refund Status: {(booking.Payment != null && booking.Payment.Status == PaymentStatus.Refunded ? "Refunded" : "Not applicable")}

            Thank you!
            ";


            await emailSender.SendEmailAsync(mentorEmail, subject, mentorBody);

            return ApiResponse<string>.SuccessResponse("Booking cancelled successfully.");
        }
        catch (Stripe.StripeException ex)
        {
            await transaction.RollbackAsync();
            return ApiResponse<string>.FailResponse("Payment refund failed: " + ex.Message);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return ApiResponse<string>.FailResponse("Booking cancellation failed: " + ex.Message);
        }
        
    }


    public async Task<BookingSessionData> PrepareBookingForCheckoutAsync(CreateBookingDto dto, string appUserId)
    {
        var mentee = await context.Mentees
        .FirstOrDefaultAsync(m => m.ApplicationUserId == appUserId);
        if (mentee == null) throw new ArgumentException("Mentee not found.");

        var availability = await context.MentorAvailabilities
            .Include(a => a.Mentor)
            .FirstOrDefaultAsync(ma => ma.Id == dto.MentorAvailabilityId);

        if (availability == null) throw new ArgumentException("Mentor availability not found.");

        var isAlreadyBooked = await context.Bookings
            .AnyAsync(b => b.MentorAvailabilityId == dto.MentorAvailabilityId && b.IsConfirmed);
        if (isAlreadyBooked) throw new InvalidOperationException("This time slot is already booked.");

        var hasMenteeConflict = await context.Bookings.AnyAsync(booking =>
            booking.MenteeId == mentee.Id && 
            booking.IsConfirmed && (
            availability.StartTime < booking.EndTime &&
            availability.EndTime > booking.StartTime
        ));
        if (hasMenteeConflict)
            throw new InvalidOperationException("You already have another booking that conflicts with this time.");

        var hasMentorConflict = await context.Bookings.AnyAsync(booking =>
        booking.MentorId == availability.MentorId &&
        booking.IsConfirmed &&
        (
            availability.StartTime < booking.EndTime &&
            availability.EndTime > booking.StartTime
        ));
        if (hasMentorConflict)
            throw new InvalidOperationException("This mentor already has another booking at this time.");

        return new BookingSessionData
        {
            MenteeId = mentee.Id,
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

    public async Task<PageResult<BookingOverviewDto>> GetBookingsForUserAsync(
        string appUserId,
        string role,
        int pageNumber,
        int pageSize)
    {
        var query = context.Bookings
            .Include(b => b.Mentor)
            .Include(b => b.Mentee)
                .ThenInclude(ment => ment.ApplicationUser)
            .AsQueryable();

        if (role == "Mentee")
            query = query.Where(b => b.Mentee.ApplicationUserId == appUserId);
        else if (role == "Mentor")
            query = query.Where(b => b.Mentor.ApplicationUserId == appUserId);
        
        var totalCount = await query.CountAsync();
        var items =  await query
            .OrderByDescending(b => b.StartTime)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(b => new BookingOverviewDto
            {
                BookingId = b.Id,
                MentorName = b.Mentor.Name,
                MenteeName = b.Mentee.Name,
                StartTime = b.StartTime,
                EndTime = b.EndTime,
                Amount = b.Amount,
                Status = b.Status == BookingStatus.Confirmed ? "Confirmed" : "Cancelled",
                MeetingUrl = b.MeetingUrl,
                MentorUserId = role == "Mentee" || role == "Admin" ? b.Mentor.ApplicationUserId : null,
                MenteeUserId = role == "Mentor" || role == "Admin" ? b.Mentee.ApplicationUserId : null,
                MenteeImageLink = b.Mentee.ImageUrl,
                MentorImageLink = b.Mentor.ImageUrl
            })
            .ToListAsync();

        return new PageResult<BookingOverviewDto>(items, totalCount, pageSize, pageNumber);
    }

}
