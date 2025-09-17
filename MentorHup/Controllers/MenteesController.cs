using MentorHup.APPLICATION.Dtos.Mentee;
using MentorHup.APPLICATION.Service.AuthServices;
using MentorHup.APPLICATION.Service.Mentee;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MentorHup.APPLICATION.Controllers
{
    [ApiController]
    [Route("api/mentees")]
    public class MenteesController : ControllerBase
    {
        private readonly IMenteeAuthService _menteeAuthService;
        private readonly IMenteeService menteeService;

        public MenteesController(IMenteeAuthService menteeAuthService , IMenteeService menteeService)
        {
            _menteeAuthService = menteeAuthService;
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
