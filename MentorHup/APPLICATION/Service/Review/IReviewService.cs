using MentorHup.APPLICATION.Common;
using MentorHup.APPLICATION.DTOs.Review;
using MentorHup.APPLICATION.Responses;

namespace MentorHup.APPLICATION.Service.Review
{
    public interface IReviewService
    {
        Task<ApiResponse<ReviewDto>> AddReviewAsync(CreateReviewDto dto, int menteeId);
        Task<ApiResponse<string>> DeleteReviewAsync(int reviewId, int menteeId);
        Task<PageResult<ReviewDto>> GetAllReviewsAsync(int pageNumber, int pageSize, int? minRating, int? maxRating, DateTime? fromDate, DateTime? toDate, string? mentorName, string? menteeName);
        Task<PageResult<ReviewDto>> GetReviewsByMentorIdAsync(int mentorId, int pageNumber, int pageSize, int? minRating, int? maxRating, DateTime? fromDate, DateTime? toDate, string? menteeName);
        Task<PageResult<ReviewDto>> GetReviewsByMenteeIdAsync(int menteeId, int pageNumber, int pageSize, int? minRating, int? maxRating, DateTime? fromDate, DateTime? toDate, string? mentorName);
    }
}
