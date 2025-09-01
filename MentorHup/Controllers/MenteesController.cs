using MentorHup.APPLICATION.Dtos.Mentee;
using MentorHup.APPLICATION.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MentorHup.APPLICATION.Controllers
{
    [ApiController]
    [Route("api/mentees")]
    public class MenteesController : ControllerBase
    {
        private readonly IMenteeAuthService _menteeAuthService;

        public MenteesController(IMenteeAuthService menteeAuthService)
        {
            _menteeAuthService = menteeAuthService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(MenteeResponse),StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<MenteeRegisterResult>> Register([FromBody] MenteeRegisterRequest request)
        {
            var result = await _menteeAuthService.RegisterAsync(request);

            if (!result.IsSuccess)
            {
                if (result.Errors!.Contains("Email is already registered."))
                    return Conflict(new { message = result.Errors });

                return BadRequest(new { message = result.Errors });
            }
            return StatusCode(StatusCodes.Status201Created, result.Mentee);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(MenteeResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] MenteeLoginRequest request)
        {
            var result = await _menteeAuthService.LoginAsync(request);

            if (!result.IsSuccess)
                return Unauthorized(new { message = result.Errors });

            return Ok(result);
        }

        //[HttpGet("profile")]
        //[Authorize(Roles = "Mentee")]
        //[ProducesResponseType(StatusCodes.Status200OK)]   
        //[ProducesResponseType(StatusCodes.Status401Unauthorized)] 
        //[ProducesResponseType(StatusCodes.Status403Forbidden)]
        //public IActionResult GetProfile()
        //{
        //    var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        //    var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;

        //    return Ok(new { UserId = userId, Email = email });
        //}
    }
}
