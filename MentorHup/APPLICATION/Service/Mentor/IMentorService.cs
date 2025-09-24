using MentorHub.APPLICATION.DTOs.Availability;
using MentorHup.APPLICATION.Common;
using MentorHup.APPLICATION.DTOs.Mentor;

namespace MentorHup.APPLICATION.Service.Mentor;

public interface IMentorService
{
    Task<PageResult<MentorOverviewDto>> GetAllMentorsAsync(int pageSize ,
        int pageNumber, string? field , string? skillName , decimal? minPrice , decimal? maxPrice,
        int? Experiences);

    Task<bool> UpdateAsync(MentorUpdateRequest request);

    Task<UploadImageResult> UploadImageAsync(IFormFile image);
    Task<(byte[] FileContent, string ContentType, string FileName)?> DownloadImageAsync(int mentorId);
    Task<UploadCVResult> UploadCVAsync(IFormFile cv);
    Task<(byte[] FileContent, string ContentType, string FileName)?> DownloadCVAsync(int mentorId);

    Task<MentorDashboardDto> GetMentorDashboardAsync(string mentorId);

    Task<(bool IsSuccess, string Message)> CreateAvailabilityAsync(CreateAvailabilityRequest request);

}
