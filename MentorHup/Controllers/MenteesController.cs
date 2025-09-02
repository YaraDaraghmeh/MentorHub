using MentorHup.APPLICATION.Dtos.Mentee;
using MentorHup.APPLICATION.DTOs.Mentor;
using MentorHup.APPLICATION.Service;
using MentorHup.APPLICATION.Service.AuthServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MentorHup.APPLICATION.Controllers
{
    [ApiController]
    [Route("api/mentees")]
    public class MenteesController : ControllerBase
    {
        private readonly IMenteeAuthService _menteeAuthService;
        private readonly IMentorService _mentorService;

        public MenteesController(IMenteeAuthService menteeAuthService , IMentorService mentorService)
        {
            _menteeAuthService = menteeAuthService;
            _mentorService = mentorService;
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

      
    }
}
