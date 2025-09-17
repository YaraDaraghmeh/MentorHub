using MentorHup.APPLICATION.Dtos.Mentee;

namespace MentorHup.APPLICATION.Service.AuthServices
{
    public interface IMenteeAuthService
    {
        Task<MenteeRegisterResult> RegisterAsync(MenteeRegisterRequest request);
        Task<bool> ConfirmEmailAsync(string userId, string token);
    }

}
