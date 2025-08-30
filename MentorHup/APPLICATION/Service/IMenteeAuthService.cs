using MentorHup.APPLICATION.Dtos.Mentee;

namespace MentorHup.APPLICATION.Service
{
    public interface IMenteeAuthService
    {
        Task<MenteeRegisterResult> RegisterAsync(MenteeRegisterRequest request);
        Task<MenteeLoginResult> LoginAsync(MenteeLoginRequest request);
    }
}
