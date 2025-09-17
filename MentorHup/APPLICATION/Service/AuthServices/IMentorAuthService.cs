using MentorHup.APPLICATION.DTOs.Mentor;

namespace MentorHup.APPLICATION.Service.AuthServices
{
    public interface IMentorAuthService
    {
        Task<MentorLoginRegistrationResult> RegisterAsync(MentorRegisterRequest request);
    }

}
