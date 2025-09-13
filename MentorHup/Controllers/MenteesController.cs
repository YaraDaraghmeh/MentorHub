using MentorHup.APPLICATION.Dtos.Mentee;
using MentorHup.APPLICATION.Service.AuthServices;
using MentorHup.APPLICATION.Service.Mentee;
using MentorHup.APPLICATION.Service.Mentor;
using MentorHup.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe.Billing;

namespace MentorHup.APPLICATION.Controllers
{
    [ApiController]
    [Route("api/mentees")]
    public class MenteesController : ControllerBase
    {
        private readonly IMenteeAuthService _menteeAuthService;
        private readonly IMentorService _mentorService;
        private readonly IMenteeService menteeService;

        public MenteesController(IMenteeAuthService menteeAuthService , IMentorService mentorService , IMenteeService menteeService)
        {
            _menteeAuthService = menteeAuthService;
            _mentorService = mentorService;
            this.menteeService = menteeService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(MenteeResponse),StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<MenteeRegisterResult>> Register([FromForm] MenteeRegisterRequest request)
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

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            var success = await _menteeAuthService.ConfirmEmailAsync(userId, token);

            if (!success)
                return BadRequest(new { message = "Email confirmation failed." });

            return Ok(new { message = "Email confirmed successfully." });
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

        [HttpPatch("edit")]
        [Authorize(Roles = "Mentee")]
        public async Task<IActionResult> Edit([FromForm] MenteeUpdateRequest menteeUpdateRequest)
        {
            var result = await menteeService.UpdateAsync(menteeUpdateRequest);

            if(!result)
                return BadRequest(new { message = "Failed to update mentee." });

            return NoContent();
        }



    }
}
