using MentorHup.APPLICATION.DTOs.Token;
using MentorHup.APPLICATION.DTOs.Unified_Login;
using MentorHup.APPLICATION.Settings;
using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MentorHup.APPLICATION.Service.AuthServices
    {
        public class AuthService : IAuthService
        {
            private readonly UserManager<ApplicationUser> _userManager;
            private readonly ITokenService _tokenService;
            private readonly ApplicationDbContext _context;

        public AuthService(UserManager<ApplicationUser> userManager,
                ITokenService tokenService,
                ApplicationDbContext context)
            {
                _userManager = userManager;
                _tokenService = tokenService;
                _context = context;
            }

            public async Task<LoginResponse?> LoginAsync(LoginRequest request)
            {
                var user = await _userManager.Users
                    .Include(u => u.Mentee)
                    .Include(u => u.Mentor)
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
                    return null;

                var accessToken = await _tokenService.CreateTokenAsync(user);

                var refreshToken = new RefreshToken
                {
                    Token = Guid.NewGuid().ToString(),
                    Expires = DateTime.UtcNow.AddDays(7),
                    UserId = user.Id,
                    IsRevoked = false
                };
            
                await _context.RefreshTokens.AddAsync(refreshToken);
                await _context.SaveChangesAsync();

                
                var roles = await _userManager.GetRolesAsync(user);

                return new LoginResponse
                {
                    UserId = user.Id,
                    Email = user.Email!,
                    Roles = roles.ToList(),
                    AccessToken = accessToken,
                    RefreshToken = refreshToken.Token,
                    Expires = DateTime.UtcNow.AddHours(3)
                };
            }



            public async Task<RefreshTokenResponse?> RefreshTokenAsync(string refreshToken)
            {
                var storedToken = await _context.RefreshTokens
                    .FirstOrDefaultAsync(t => t.Token == refreshToken);
                
                if (storedToken == null || storedToken.Expires < DateTime.UtcNow || storedToken.IsRevoked)
                    return null;

                var user = await _userManager.FindByIdAsync(storedToken.UserId);
                if (user == null)
                    return null;

                var newAccessToken = await _tokenService.CreateTokenAsync(user);

                return new RefreshTokenResponse
                {
                    AccessToken = newAccessToken,
                    RefreshToken = storedToken.Token,
                    ExpireAt = DateTime.UtcNow.AddHours(3)
                };
            }
        }

}
