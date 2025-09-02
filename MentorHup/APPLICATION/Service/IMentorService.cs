using MentorHup.APPLICATION.Common;
using MentorHup.APPLICATION.DTOs.Mentor;

namespace MentorHup.APPLICATION.Service;

public interface IMentorService
{
    Task<PageResult<MentorOverviewDto>> GetAllMentorsAsync(int pageSize ,
        int pageNumber, string? field , string? skillName , decimal? minPrice , decimal? maxPrice,
        int? Experiences);

}
