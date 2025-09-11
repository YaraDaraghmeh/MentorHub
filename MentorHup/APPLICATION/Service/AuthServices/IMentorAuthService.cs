using MentorHup.APPLICATION.DTOs.Mentor;

namespace MentorHup.APPLICATION.Service.AuthServices
{
    public interface IMentorAuthService
    {
        Task<MentorLoginRegistrationResult> RegisterAsync(MentorRegisterRequest request);
        Task<UploadImageResult> UploadImageAsync(IFormFile image);
        Task<bool> ConfirmEmailAsync(string userId, string token);
        Task<MentorLoginRegistrationResult> LoginAsync(MentorLoginRequest request);
        Task<bool> UpdateAsync(MentorUpdateRequest request);

    }

}
