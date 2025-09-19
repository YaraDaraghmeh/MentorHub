using MentorHup.APPLICATION.Dtos.Mentee;
using MentorHup.APPLICATION.DTOs.Mentee;

namespace MentorHup.APPLICATION.Service.Mentee
{
    public interface IMenteeService
    {
        Task<(byte[] FileContent, string ContentType, string FileName)?> DownloadImageAsync(int menteeId);
        Task<bool> UpdateAsync(MenteeUpdateRequest request);
        Task<MenteeDashboardDto?> GetDashboardStatsAsync();
    }
}
