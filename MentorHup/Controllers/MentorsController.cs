using MentorHup.APPLICATION.Dtos.Mentee;
using MentorHup.APPLICATION.DTOs.Mentor;
using MentorHup.APPLICATION.DTOs.Pagination;
using MentorHup.APPLICATION.Service;
using MentorHup.APPLICATION.Service.AuthServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MentorHup.API.Controllers
{
    [ApiController]
    [Route("api/mentors")]
    public class MentorController : ControllerBase
    {
        private readonly IMentorAuthService _mentorAuthService;
        private readonly IMentorService _mentorService;

        public MentorController(IMentorAuthService mentorAuthService , IMentorService mentorService )
        {
            _mentorAuthService = mentorAuthService;
            _mentorService = mentorService;
        }

        [HttpPost("register")]
        [ProducesResponseType(typeof(MentorResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> Register([FromBody] MentorRegisterRequest request)
        {
            var result = await _mentorAuthService.RegisterAsync(request);

            if (!result.IsSuccess)
            {
                if (result.Errors!.Contains("Email is already registered."))
                    return Conflict(new { message = result.Errors });

                return BadRequest(new { message = result.Errors });
            }

            return Created(nameof(Register),  result.Mentor);
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(MentorResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] MentorLoginRequest request)
        {
            var result = await _mentorAuthService.LoginAsync(request);

            if (!result.IsSuccess)
                return Unauthorized(new { message = result.Errors });

            return Ok(result.Mentor);
        }

        [HttpGet()]
        [Authorize(Roles = "Mentee")]
        [ProducesResponseType(typeof(List<MentorOverviewDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAll([FromQuery] PaginationDto paginationDto)
        {

            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var mentors = await _mentorService.GetAllMentorsAsync(paginationDto.PageSize
                , paginationDto.PageNumber);

            return Ok(mentors);
        }
    }
}
