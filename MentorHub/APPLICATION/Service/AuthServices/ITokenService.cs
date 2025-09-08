using MentorHup.Domain.Entities;

namespace MentorHup.APPLICATION.Service.AuthServices
{
    public interface ITokenService
    {
        Task<string> CreateTokenAsync(ApplicationUser user);
    }
}
