using MentorHup.APPLICATION.Common;
using MentorHup.APPLICATION.DTOs.Booking;
using MentorHup.APPLICATION.Responses;
using MentorHup.APPLICATION.Service.Strip;
using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace MentorHup.APPLICATION.Service.Booking;

public class BookingService(ApplicationDbContext context, IStripeService stripeService) : IBookingService
{
    public async Task<ApiResponse<string>> CancelBookingAsync(int bookingId, string appUserId, string role)
    {
        var booking = await context.Bookings
            .Include(b => b.Mentee)
            .Include(b => b.Mentor)
            .Include(b => b.MentorAvailability)
            .Include(b => b.Payment)
            .FirstOrDefaultAsync(b => b.Id == bookingId);

        if (booking == null) return ApiResponse<string>.FailResponse("Booking not found.");

        if (role == "Mentee" && booking.Mentee.ApplicationUserId != appUserId)
            return ApiResponse<string>.FailResponse("You can only cancel your own bookings.");

        if (role == "Mentor" && booking.Mentor.ApplicationUserId != appUserId)
            return ApiResponse<string>.FailResponse("You can only cancel your own bookings.");

        if (booking.StartTime <= DateTime.UtcNow.AddHours(1))
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
                booking.Payment.RefundedAt = DateTime.UtcNow;
            }

            booking.Status = BookingStatus.Cancelled;
            if (booking.MentorAvailability != null)
                booking.MentorAvailability.IsBooked = false;

            await context.SaveChangesAsync();
            await transaction.CommitAsync();

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

    public async Task<PageResult<BookingOverviewDto>> GetBookingsForUserAsync(
        string appUserId,
        string role,
        int pageNumber,
        int pageSize)
    {
        var query = context.Bookings
            .Include(b => b.Mentor)
            .Include(b => b.Mentee)
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
                MeetingUrl = b.MeetingUrl
            })
            .ToListAsync();

        return new PageResult<BookingOverviewDto>(items, totalCount, pageSize, pageNumber);
    }

}
