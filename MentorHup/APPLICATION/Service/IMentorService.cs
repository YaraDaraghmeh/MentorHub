using MentorHup.APPLICATION.Common;
using MentorHup.APPLICATION.DTOs.Mentor;

namespace MentorHup.APPLICATION.Service
{
    public interface IMentorService
    {
        Task<PageResult<MentorOverviewDto>> GetAllMentorsAsync(int pageSize , int pageNumber);

    }
}
