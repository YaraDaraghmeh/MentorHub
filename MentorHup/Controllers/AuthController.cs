using MentorHup.APPLICATION.DTOs.Unified_Login;
using MentorHup.APPLICATION.Service.AuthServices;
using MentorHup.APPLICATION.Settings;
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
        public async Task<IActionResult> Refresh([FromBody] string refreshToken)
        {
            var response = await _authService.RefreshTokenAsync(refreshToken);
            if (response == null)
                return Unauthorized(new { message = "Invalid refresh token" });

            return Ok(response);
        }


        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout([FromBody] string refreshToken,
            [FromServices] ApplicationDbContext context)
        {
            var storedToken = await context.RefreshTokens
                .FirstOrDefaultAsync(t => t.Token == refreshToken);

            if (storedToken == null)
                return NotFound(new { message = "Refresh token not found" });

            storedToken.IsRevoked = true;
            await context.SaveChangesAsync();

            return Ok(new { message = "Logged out successfully" });
        }


    }

}
