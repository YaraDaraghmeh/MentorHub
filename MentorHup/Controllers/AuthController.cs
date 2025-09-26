using MentorHup.APPLICATION.DTOs.ForgetPassword;
using MentorHup.APPLICATION.DTOs.Token;
using MentorHup.APPLICATION.DTOs.Unified_Login;
using MentorHup.APPLICATION.Service.AuthServices;
using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MentorHup.Exceptions;
using MentorHub.APPLICATION.DTOs.ChangePassword;
using System.Security.Claims;

namespace MentorHup.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly LinkGenerator linkGenerator;

        public AuthController(IAuthService authService,
                              SignInManager<ApplicationUser> signInManager,
                              LinkGenerator linkGenerator)
        {
            _authService = authService;
            this.signInManager = signInManager;
            this.linkGenerator = linkGenerator;
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            var success = await _authService.ConfirmEmailAsync(userId, token);

            if (!success)
                return BadRequest(new { message = "Email confirmation failed." });

            return Ok(new { message = "Email confirmed successfully." });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.LoginAsync(request);
            if (result == null)
                return Unauthorized(new { message = "Invalid email or password" });

            return Ok(result);
        }

        // Endpoint to start Google login process
        [HttpGet("login/google")]
        public async Task<IActionResult> LoginWithGoogle([FromQuery] string returnUrl = "/")
        {
            // Generate the URL where Google will redirect after login (callback)
            var redirectUrl = linkGenerator.GetPathByAction(HttpContext,
                               action: nameof(GoogleLoginCallback), // the callback action
                               controller: "Auth",
                               values: new {returnUrl}); // pass returnUrl for redirect after login

            // Configure external authentication properties for Google
            var properties = signInManager.ConfigureExternalAuthenticationProperties("Google", redirectUrl);
            // Challenge the user with Google login
            // This sends the user to Google's login page
            return Challenge(properties, new[] { "Google" });
        }

        // Callback endpoint that Google redirects to after login
        [HttpGet("login/google/callback")]
        public async Task<IActionResult> GoogleLoginCallback([FromQuery] string returnUrl = "/")
        {
            const string frontendBaseUrl = "https://mentorhub-zeta.vercel.app";
            string redirectPathOnFailure = $"{frontendBaseUrl}/login";

            try
            {

                // 1. احصل على نتيجة المصادقة من Google
                var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

                if (!result.Succeeded)
                    return Redirect($"{frontendBaseUrl}/login?error=GoogleAuthFailed");

                // 2. أنشئ JWT و Refresh Token
                var response = await _authService.LoginWithGoogleAsync(result.Principal);

                if (response == null)
                    return Redirect($"{frontendBaseUrl}/login?error=LoginFailed");

                // 3. حدد الصفحة النهائية حسب الدور
                string rolePath = response.Roles.Contains("Admin") ? "admin/dashboard" :
                                  response.Roles.Contains("Mentor") ? "mentor/dashboard" :
                                  response.Roles.Contains("Mentee") ? "mentee/main" : "";

                if (string.IsNullOrEmpty(rolePath))
                    rolePath = "login"; // fallback

                // 4. أنشئ الرابط النهائي للـ frontend مع التوكنات و userId
                var frontendRedirectUrl = $"{frontendBaseUrl}/{rolePath}?accessToken={response.AccessToken}&refreshToken={response.RefreshToken}&roles={string.Join(",", response.Roles)}&userId={response.UserId}";

                // 5. Redirect مباشرة للصفحة الصحيحة
                return Redirect(frontendRedirectUrl);
            }

            catch (ExternalLoginProviderException ex)
            {
                // Handle custom exceptions (e.g., user exists with different provider)
                var errorMessage = Uri.EscapeDataString(ex.Message);
                return Redirect($"{redirectPathOnFailure}?error=LoginError&details={errorMessage}");
            }
            catch (Exception ex)
            {
                // Handle any unexpected internal server exceptions
                var errorMessage = Uri.EscapeDataString(ex.Message);
                return Redirect($"{redirectPathOnFailure}?error=ServerError&details={errorMessage}");
            }

        }


        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest refreshTokenRequest)
        {
            var response = await _authService.RefreshTokenAsync(refreshTokenRequest.RefreshToken);
            if (response == null)
                return Unauthorized(new { message = "Invalid refresh token" });

            return Ok(response);
        }


        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest refreshTokenRequest,
            [FromServices] ApplicationDbContext context)
        {
            var storedToken = await context.RefreshTokens
                .FirstOrDefaultAsync(t => t.Token == refreshTokenRequest.RefreshToken);

            if (storedToken == null)
                return NotFound(new { message = "Refresh token not found" });

            storedToken.IsRevoked = true;
            await context.SaveChangesAsync();

            return Ok(new { message = "Logged out successfully" });
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest changePasswordRequest)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized(new { message = "User not found." });

            var response = await _authService.ChangePasswordAsync(userId, changePasswordRequest);

            if(!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var response = await _authService.ForgotPasswordAsync(request);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var response = await _authService.ResetPasswordAsync(request);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }


    }

}
