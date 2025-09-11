using MentorHup.APPLICATION.Dtos.Mentee;
using Microsoft.AspNetCore.Mvc;

namespace MentorHup.APPLICATION.Service.AuthServices
{
    public interface IMenteeAuthService
    {
        Task<MenteeRegisterResult> RegisterAsync(MenteeRegisterRequest request);
        Task<bool> ConfirmEmailAsync(string userId, string token);
        Task<MenteeLoginResult> LoginAsync(MenteeLoginRequest request);
    }

}
