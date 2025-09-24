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
            try
            {
                // Get the authentication result from Google
                var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

                if (!result.Succeeded)
                    return Unauthorized(new { message = "Google authentication failed" });

                // Pass the Google claims to your AuthService to handle JWT creation
                var response = await _authService.LoginWithGoogleAsync(result.Principal);

                if (response == null)
                    return Unauthorized(new { message = "Failed to login with Google" });

                // Return the JWT and Refresh Token as JSON
                return Ok(response);
            }
            catch(ExternalLoginProviderException ex)
            {
                // Handle custom exceptions from AuthService
                return BadRequest(new
                {
                    Provider = ex.Provider,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                // Handle any unexpected exceptions
                return StatusCode(500, new { Message = "Internal server error", Details = ex.Message });
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
