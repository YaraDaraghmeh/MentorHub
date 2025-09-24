using MentorHup.APPLICATION.DTOs.Profile;

namespace MentorHup.APPLICATION.Service.Profile
{
    public interface IProfileService
    {
        Task<BaseProfileDto?> GetProfileAsync(string userId, string role);
    }
}
