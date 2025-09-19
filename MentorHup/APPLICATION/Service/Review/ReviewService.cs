using MentorHup.APPLICATION.DTOs.Review;
using MentorHup.APPLICATION.Responses;
using MentorHup.APPLICATION.Service.Review;
using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

public class ReviewService : IReviewService
{
    private readonly ApplicationDbContext _context;

    public ReviewService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<ReviewDto>> AddReviewAsync(CreateReviewDto dto, int menteeId)
    {
        var booking = await _context.Bookings
            .Include(b => b.Mentor)
            .Include(b => b.Review)
            .FirstOrDefaultAsync(b => b.Id == dto.BookingId && b.MenteeId == menteeId);

        if (booking == null)
            return ApiResponse<ReviewDto>.FailResponse("Booking not found or not yours.");

        if (booking.IsConfirmed == false)
        {
            return ApiResponse<ReviewDto>.FailResponse("You can't review a cancelled booking.");
        }

        if (booking.EndTime > DateTime.UtcNow)
            return ApiResponse<ReviewDto>.FailResponse("Cannot review before session ends.");

        if (booking.Review != null)
            return ApiResponse<ReviewDto>.FailResponse("Review already exists for this booking.");

        var review = new Review
        {
            BookingId = booking.Id,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        var reviewDto = new ReviewDto
        {
            Id = review.Id,
            BookingId = review.BookingId,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        };

        return ApiResponse<ReviewDto>.SuccessResponse(reviewDto, "Review added successfully.");
    }

    public async Task<ApiResponse<string>> DeleteReviewAsync(int reviewId, int menteeId)
    {
        var review = await _context.Reviews
            .Include(r => r.Booking)
            .FirstOrDefaultAsync(r => r.Id == reviewId && r.Booking.MenteeId == menteeId);

        if (review == null)
            return ApiResponse<string>.FailResponse("Review not found or not yours.");

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        return ApiResponse<string>.SuccessResponse("Review deleted successfully.");
    }

    public async Task<List<ReviewDto>> GetAllReviewsAsync()
    {
        var reviews = await _context.Bookings
            .Where(b => b.Review != null)
            .Select(b => new ReviewDto
            {
                Id = b.Review!.Id,
                BookingId = b.Id,
                Comment = b.Review.Comment,
                Rating = b.Review.Rating,
                CreatedAt = b.Review.CreatedAt,
            })
            .ToListAsync();

        return reviews;
    }

    public async Task<List<ReviewDto>> GetReviewsByMentorIdAsync(int mentorId)
    {
        var reviews = await _context.Bookings.Where(b => b.MentorId == mentorId &&
        b.Review != null).Select(b => new ReviewDto
        {
            Id = b.Review!.Id,
            BookingId = b.Id,
            Comment = b.Review.Comment,
            Rating = b.Review.Rating,
            CreatedAt = b.Review.CreatedAt,
        }).ToListAsync();

        return reviews;
    }


    public async Task<List<ReviewDto>> GetReviewsByMenteeIdAsync(int menteeId)
    {
        return await _context.Bookings
            .Where(booking => booking.MenteeId == menteeId && booking.Review != null)
            .Select(booking => new ReviewDto
            {
                Id = booking.Review.Id,
                BookingId = booking.Id,
                Comment = booking.Review.Comment,
                Rating = booking.Review.Rating,
                CreatedAt = booking.Review.CreatedAt,
            })
            .ToListAsync();
    }




}
