using MentorHup.APPLICATION.DTOs.Unified_Login;

namespace MentorHup.APPLICATION.Service.AuthServices
{
    public interface IAuthService
    {
        Task<LoginResponse?> LoginAsync(LoginRequest request);
    }
}
