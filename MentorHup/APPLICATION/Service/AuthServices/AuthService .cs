using MentorHup.APPLICATION.DTOs.ForgetPassword;
using MentorHup.APPLICATION.DTOs.Token;
using MentorHup.APPLICATION.DTOs.Unified_Login;
using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace MentorHup.APPLICATION.Service.AuthServices
    {
        public class AuthService : IAuthService
        {
            private readonly UserManager<ApplicationUser> _userManager;
            private readonly ITokenService _tokenService;
            private readonly ApplicationDbContext _context;
            private readonly IEmailSender emailSender;
            private readonly IHttpContextAccessor httpContextAccessor;

            public AuthService(UserManager<ApplicationUser> userManager,
                ITokenService tokenService,
                ApplicationDbContext context,
                IEmailSender emailSender,
                IHttpContextAccessor httpContextAccessor)
            {
                _userManager = userManager;
                _tokenService = tokenService;
                _context = context;
                this.emailSender = emailSender;
                this.httpContextAccessor = httpContextAccessor;
            }


            public async Task<bool> ConfirmEmailAsync(string userId, string token)
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null) return false;

                var decodedToken = System.Web.HttpUtility.UrlDecode(token);
                var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

                return result.Succeeded;
            }


            public async Task<LoginResponse?> LoginAsync(LoginRequest request)
            {
                var user = await _userManager.Users
                    .Include(u => u.Mentee)
                    .Include(u => u.Mentor)
                    .FirstOrDefaultAsync(u => u.Email == request.Email);

                if (user == null)
                    return new LoginResponse
                    {
                        IsSuccess = false,
                        Errors = new[] { "Invalid email or password." }
                    };

                // check for blocking
                if (user.LockoutEnabled && user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTimeOffset.UtcNow)
                    return new LoginResponse
                    {
                        IsSuccess = false,
                        Errors = new[] { "Your account is blocked. Please contact admin." }
                    };

                if (!await _userManager.CheckPasswordAsync(user, request.Password))
                {
                    if (user.LockoutEnabled)
                    {
                        await _userManager.AccessFailedAsync(user);
                        if (await _userManager.IsLockedOutAsync(user))
                            return new LoginResponse
                            {
                                IsSuccess = false,
                                Errors = new[] { "Your account is blocked due to multiple failed login attempts." }
                            };
                    }

                    return new LoginResponse
                    {
                        IsSuccess = false,
                        Errors = new[] { "Invalid email or password." }
                    };
                }
              
                if (!await _userManager.IsEmailConfirmedAsync(user))
                    return new LoginResponse
                    {
                        IsSuccess = false,
                        Errors = new[] { "Please confirm your email before logging in." }
                    };

                // when login successfully, reset access faild count to 0
                if (user.LockoutEnabled)
                    await _userManager.ResetAccessFailedCountAsync(user);


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

            public async Task<ResetPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request)
            {

                var user = await _userManager.Users
                .IgnoreQueryFilters() // because of apply query filter in ApplicationDbContext line 124 (to ignore soft deleted users)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

                if (user == null)
                    return new ResetPasswordResponse { Success = false, Message = "User not found." };

                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token)); // Base64UrlEncode => avoids conflicts in chars like (+, /, \, =,...etc), Encoding.UTF8.GetBytes(token): generate the cipher
                var httpRequest = httpContextAccessor.HttpContext.Request;
                var resetUrl = $"{httpRequest.Scheme}://{httpRequest.Host}/api/auth/reset-password?email={request.Email}&token={encodedToken}";

                var html = $@"
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset='utf-8' />
                  <title>Reset your MentorHub password</title>
                </head>
                <body style='font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;'>
                  <div style='max-width:600px;margin:0 auto;background:#fff;padding:24px;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,0.06);'>
                    <h2 style='color:#111827'>Reset your MentorHub password</h2>
                    <p style='color:#374151'>Hi {System.Net.WebUtility.HtmlEncode(user.UserName)},</p>
                    <p style='color:#374151'>
                      We received a request to reset your password. Click the button below to choose a new password.
                    </p>
                    <p style='text-align:center;margin:28px 0;'>
                      <a href='{resetUrl}' style='display:inline-block;padding:12px 22px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;'>
                        Reset password
                      </a>
                    </p>
                    <p style='color:#374151'>
                      This password reset link is valid for <strong>30 minutes</strong> and can only be used <strong>once</strong>.
                    </p>
                    <p style='color:#374151'>
                      If you didn't request a password reset, you can ignore this email — your password will stay the same.
                    </p>
                    <hr style='margin:20px 0;border:none;border-top:1px solid #e6e9ee' />
                    <p style='font-size:12px;color:#9ca3af'>&copy; {DateTime.UtcNow.Year} MentorHub</p>
                  </div>
                </body>
                </html>";


                await emailSender.SendEmailAsync(request.Email, "Reset your MentorHub password", html);

                return new ResetPasswordResponse { Success = true, Message = "Password reset link sent to email." };
            }


            public async Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request)
            {
                var user = await _userManager.Users
                .IgnoreQueryFilters() // because of apply query filter in ApplicationDbContext line 124 (to ignore soft deleted users)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());
                
                if (user == null)
                {
                    return new ResetPasswordResponse { Success = false, Message = "User not found." };
                }

                var decodedBytes = WebEncoders.Base64UrlDecode(request.Code); // remove distraction chars (like +, =, /, \, ......etc) from the cipher
                var decodedToken = Encoding.UTF8.GetString(decodedBytes); // docode token

                var result = await _userManager.ResetPasswordAsync(user, decodedToken, request.NewPassword); // here, it takes over the decryption internally

                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    return new ResetPasswordResponse { Success = false, Message = $"Password reset failed: {errors}" };
                }

                return new ResetPasswordResponse { Success = true, Message = "Password has been reset successfully." };
            }

        }
}
