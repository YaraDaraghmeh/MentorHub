using MentorHup.APPLICATION.DTOs.Review;
using MentorHup.APPLICATION.Responses;

namespace MentorHup.APPLICATION.Service.Review
{
    public interface IReviewService
    {
        Task<ApiResponse<ReviewDto>> AddReviewAsync(CreateReviewDto dto, int menteeId);
        Task<ApiResponse<string>> DeleteReviewAsync(int reviewId, int menteeId);
        Task<List<ReviewDto>> GetReviewsByMentorIdAsync(int mentorId);
    }
}
