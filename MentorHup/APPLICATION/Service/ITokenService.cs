using MentorHup.Domain.Entities;

namespace MentorHup.APPLICATION.Service
{
    public interface ITokenService
    {
        Task<string> CreateTokenAsync(ApplicationUser user);
    }
}
