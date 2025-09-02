using MentorHup.APPLICATION.DTOs.Unified_Login;
using MentorHup.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MentorHup.APPLICATION.Service.AuthServices
    {
        public class AuthService : IAuthService
        {
            private readonly UserManager<ApplicationUser> _userManager;
            private readonly ITokenService _tokenService;

            public AuthService(UserManager<ApplicationUser> userManager, ITokenService tokenService)
            {
                _userManager = userManager;
                _tokenService = tokenService;
            }

            public async Task<LoginResponse?> LoginAsync(LoginRequest request)
            {
                var user = await _userManager.Users
                    .Include(u => u.Mentee)
                    .Include(u => u.Mentor)
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
                    return null;

                var token = await _tokenService.CreateTokenAsync(user);
                var roles = await _userManager.GetRolesAsync(user);

                return new LoginResponse
                {
                    UserId = user.Id,
                    Email = user.Email!,
                    Roles = roles.ToList(),
                    AccessToken = token,
                    Expires = DateTime.UtcNow.AddHours(3)
                };
            }
        }

    }
