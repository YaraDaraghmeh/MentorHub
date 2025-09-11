using MentorHup.APPLICATION.DTOs.Mentor;

namespace MentorHup.APPLICATION.Service.AuthServices
{
    public interface IMentorAuthService
    {
        Task<MentorLoginRegistrationResult> RegisterAsync(MentorRegisterRequest request);
        Task<bool> ConfirmEmailAsync(string userId, string token);
        Task<MentorLoginRegistrationResult> LoginAsync(MentorLoginRequest request);

    }

}
