using MentorHup.APPLICATION.Common;
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
            CreatedAt = review.CreatedAt,
            MenteeName = null, // because the mentee is added review
            MenteeImage = null,
            MentorName = booking.Mentor.Name,
            MentorImage = booking.Mentor.ImageUrl,
            MentorCV = booking.Mentor.CVUrl,
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

    public async Task<PageResult<ReviewDto>> GetAllReviewsAsync(int pageNumber, int pageSize,
        int? minRating = null, int? maxRating = null,
        DateTime? fromDate = null, DateTime? toDate = null,
        string? mentorName = null, string? menteeName = null)
    {
        var query = _context.Bookings
            .Include(b => b.Review)
            .Include(b => b.Mentor)
            .Include(b => b.Mentee)
            .Where(b => b.Review != null)
            .AsNoTracking()
            .AsQueryable();

        // Apply filters
        if (minRating.HasValue)
            query = query.Where(b => b.Review!.Rating >= minRating.Value);

        if (maxRating.HasValue)
            query = query.Where(b => b.Review!.Rating <= maxRating.Value);

        if (fromDate.HasValue)
            query = query.Where(b => b.Review!.CreatedAt >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(b => b.Review!.CreatedAt <= toDate.Value);

        if (!string.IsNullOrWhiteSpace(mentorName))
            query = query.Where(b => b.Mentor.Name.Contains(mentorName));

        if (!string.IsNullOrWhiteSpace(menteeName))
            query = query.Where(b => b.Mentee.Name.Contains(menteeName));

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(b => b.Review!.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(b => new ReviewDto
            {
                Id = b.Review!.Id,
                BookingId = b.Id,
                Rating = b.Review.Rating,
                Comment = b.Review.Comment,
                CreatedAt = b.Review.CreatedAt,
                MenteeName = b.Mentee.Name,
                MenteeImage = b.Mentee.ImageUrl,
                MentorName = b.Mentor.Name,
                MentorImage = b.Mentor.ImageUrl,
                MentorCV = b.Mentor.CVUrl
            })
            .ToListAsync();

        return new PageResult<ReviewDto>(items, totalCount, pageSize, pageNumber);
    }

    public async Task<PageResult<ReviewDto>> GetReviewsByMentorIdAsync(
        int mentorId,
        int pageNumber = 1,
        int pageSize = 10,
        int? minRating = null, int? maxRating = null,
        DateTime? fromDate = null, DateTime? toDate = null,
        string? menteeName = null)
    {
        var query = _context.Bookings
            .Include(b => b.Review)
            .Include(b => b.Mentor)
            .Include(b => b.Mentee)
            .Where(b => b.Review != null && b.MentorId == mentorId)
            .AsNoTracking();

        if (minRating.HasValue)
            query = query.Where(b => b.Review!.Rating >= minRating.Value);

        if (maxRating.HasValue)
            query = query.Where(b => b.Review!.Rating <= maxRating.Value);

        if (fromDate.HasValue)
            query = query.Where(b => b.Review!.CreatedAt >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(b => b.Review!.CreatedAt <= toDate.Value);

        if (!string.IsNullOrEmpty(menteeName))
            query = query.Where(b => b.Mentee.Name.Contains(menteeName));

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(b => b.Review!.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(b => new ReviewDto
            {
                Id = b.Review!.Id,
                BookingId = b.Id,
                Rating = b.Review.Rating,
                Comment = b.Review.Comment,
                CreatedAt = b.Review.CreatedAt,
                MenteeName = b.Mentee.Name,
                MenteeImage = b.Mentee.ImageUrl,
                MentorName = b.Mentor.Name,
                MentorImage = b.Mentor.ImageUrl,
                MentorCV = b.Mentor.CVUrl
            })
            .ToListAsync();

        return new PageResult<ReviewDto>(items, totalCount, pageSize, pageNumber);
    }


    public async Task<PageResult<ReviewDto>> GetReviewsByMenteeIdAsync(
        int menteeId,
        int pageNumber = 1,
        int pageSize = 10,
        int? minRating = null, int? maxRating = null,
        DateTime? fromDate = null, DateTime? toDate = null,
        string? mentorName = null)
    {
        var query = _context.Bookings
            .Include(b => b.Review)
            .Include(b => b.Mentor)
            .Include(b => b.Mentee)
            .Where(b => b.Review != null && b.MenteeId == menteeId)
            .AsNoTracking();


        if (minRating.HasValue)
            query = query.Where(b => b.Review!.Rating >= minRating.Value);

        if (maxRating.HasValue)
            query = query.Where(b => b.Review!.Rating <= maxRating.Value);

        if (fromDate.HasValue)
            query = query.Where(b => b.Review!.CreatedAt >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(b => b.Review!.CreatedAt <= toDate.Value);

        if(!string.IsNullOrEmpty(mentorName))
            query = query.Where(b => b.Mentor.Name.Contains(mentorName));

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(b => b.Review!.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(b => new ReviewDto
            {
                Id = b.Review!.Id,
                BookingId = b.Id,
                Rating = b.Review.Rating,
                Comment = b.Review.Comment,
                CreatedAt = b.Review.CreatedAt,
                MenteeName = null,
                MenteeImage = null,
                MentorName = b.Mentor.Name,
                MentorImage = b.Mentor.ImageUrl,
                MentorCV = b.Mentor.CVUrl
            })
            .ToListAsync();

        return new PageResult<ReviewDto>(items, totalCount, pageSize, pageNumber);
    }




}
