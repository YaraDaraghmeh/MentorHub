using MentorHup.APPLICATION.Service.Admin;
using MentorHup.APPLICATION.Service.Mentee;
using MentorHup.APPLICATION.Service.Mentor;
using MentorHup.APPLICATION.Service.Profile;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MentorHup.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService profileService;

        public ProfileController(IProfileService profileService)
        {
            this.profileService = profileService;
        }

        [HttpGet("my-profile")]
        [Authorize(Roles = "Mentee,Mentor,Admin")]
        public async Task<IActionResult> MyProfileInfo()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("User not authenticated.");

            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (role == null)
                return Forbid("Role not found in token.");

            var profile = await profileService.GetProfileAsync(userId, role);

            if (profile == null)
                return NotFound("Profile not found.");

            return Ok(profile);
        }
    }
}
