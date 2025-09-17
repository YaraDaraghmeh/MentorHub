using MentorHup.APPLICATION.DTOs.ForgetPassword;
using MentorHup.APPLICATION.DTOs.Token;
using MentorHup.APPLICATION.DTOs.Unified_Login;
using MentorHup.APPLICATION.Service.AuthServices;
using MentorHup.Infrastructure.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MentorHup.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
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
