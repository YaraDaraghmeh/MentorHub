using MentorHub.APPLICATION.DTOs.ChangePassword;
using MentorHup.APPLICATION.DTOs.ForgetPassword;
using MentorHup.APPLICATION.DTOs.Token;
using MentorHup.APPLICATION.DTOs.Unified_Login;
using System.Security.Claims;

namespace MentorHup.APPLICATION.Service.AuthServices
{
    public interface IAuthService
    {
        Task<bool> ConfirmEmailAsync(string userId, string token);
        Task<LoginResponse?> LoginAsync(LoginRequest request);
        Task<LoginResponse?> LoginWithGoogleAsync(ClaimsPrincipal principal);
        Task<RefreshTokenResponse?> RefreshTokenAsync(string userId);
        Task<ChangePasswordResponse> ChangePasswordAsync(string userId, ChangePasswordRequest request);
        Task<ResetPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request);
        Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request);

    }
}
