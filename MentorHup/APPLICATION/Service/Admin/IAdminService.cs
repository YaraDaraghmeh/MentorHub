using MentorHup.APPLICATION.Common;
using MentorHup.APPLICATION.DTOs.Admin;
using MentorHup.APPLICATION.DTOs.Mentee;
using MentorHup.APPLICATION.DTOs.Mentor;
using MentorHup.APPLICATION.DTOs.Skill;
using MentorHup.Domain.Entities;
namespace MentorHup.APPLICATION.Service.Admin
{
    public interface IAdminService
    {
        Task<PageResult<AdminUserOverviewDto>> GetAllUsersAsync(int pageSize, int pageNumber, string? name, string? email, string? role, bool? isDeleted);
        Task<PageResult<MentorOverviewDto>> GetAllMentorsAsync(int pageSize,
            int pageNumber, string? field, string? skillName, decimal? minPrice, decimal? maxPrice,
            int? Experiences);
        Task<PageResult<MenteeOverviewDto>> GetAllMenteesAsync(int pageSize,
            int pageNumber, string? name, string? gender);
        Task<bool> SoftDeleteUserAsync(string userId);
        Task<bool> RestoreUserAsync(string userId);
        Task<bool> BlockUserAsync(string userId);
        Task<bool> UnblockUserAsync(string userId);
        Task<PageResult<SkillsResponse>> GetAllSkillsAsync(int pageSize, int pageNumber, string? name);
        Task<SkillResponse> GetSkillByIdAsync(int id);
        Task<AdminSkillResponse> AddSkillAsync(AdminSkillRequest adminSkillRequest);
        Task<Skill?> UpdateSkillAsync(int id, AdminSkillRequest request);
        Task<bool> DeleteSkillAsync(int id);
        Task<AdminDashboardStats> GetDashboardStatisticsAsync();
    }

}
