using MentorHub.APPLICATION.DTOs.Availability;
using MentorHup.APPLICATION.DTOs.Mentor;
using MentorHup.APPLICATION.DTOs.Pagination;
using MentorHup.APPLICATION.Service.AuthServices;
using MentorHup.APPLICATION.Service.Mentor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

        [HttpPost("upload-image")]
        [Authorize(Roles = "Mentor")] 
        public async Task<IActionResult> UploadImage([FromForm] UploadImageRequest uploadImageRequest)
        {
            var result = await _mentorService.UploadImageAsync(uploadImageRequest.Image);

            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.Errors });
            }

            return Ok(new { imageUrl = result.ImageUrl });
        }

        [HttpGet("download-image/{mentorId}")]
        [Authorize]
        public async Task<IActionResult> DownloadImage(int mentorId)
        {
            var result = await _mentorService.DownloadImageAsync(mentorId);

            if (result == null) return NotFound();

            return File(result.Value.FileContent, result.Value.ContentType, result.Value.FileName);
        }


        [HttpPost("upload-cv")]
        [Authorize(Roles = "Mentor")]
        public async Task<IActionResult> UploadCV([FromForm] UploadCVRequest uploadCVRequest)
        {
            var result = await _mentorService.UploadCVAsync(uploadCVRequest.CV);
            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpGet("download-cv/{mentorId}")]
        [Authorize]
        public async Task<IActionResult> DownloadCV(int mentorId)
        {
            var result = await _mentorService.DownloadCVAsync(mentorId);

            if (result == null) return NotFound();

            return File(result.Value.FileContent, result.Value.ContentType, result.Value.FileName);
        }


        [HttpGet()]
        [Authorize(Roles = "Mentee")]
        [ProducesResponseType(typeof(List<MentorOverviewDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAll([FromQuery] PaginationDto dto)
        {

            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var mentors = await _mentorService.GetAllMentorsAsync(dto.PageSize
                , dto.PageNumber , dto.Field , dto.SkillName , dto.MinPrice , dto.MaxPrice,
                dto.Experiences);

            return Ok(mentors);
        }


        [HttpPatch("edit")]
        [Authorize(Roles = "Mentor")]

        public async Task<IActionResult> Edit([FromBody] MentorUpdateRequest mentorUpdateRequest)
        {
            var result = await _mentorService.UpdateAsync(mentorUpdateRequest);

            if (!result)
                return BadRequest(new { message = "Failed to update Mentor." });

            return NoContent();
        }

        [HttpGet("dashboard")]
        [Authorize(Roles = "Mentor")]
        [ProducesResponseType(typeof(MentorDashboardDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetDashboard()
        {
            var mentorId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(mentorId))
                return Unauthorized(new { Success = false, Message = "Invalid user" });

            var dashboardData = await _mentorService.GetMentorDashboardAsync(mentorId);

            return Ok(dashboardData);
        }

        [HttpPost("add-availability")]
        [Authorize(Roles = "Mentor")]
        public async Task<IActionResult> CreateAvailability([FromBody] CreateAvailabilityRequest createAvailabilityRequest)
        {
            var (isSuccess, message) = await _mentorService.CreateAvailabilityAsync(createAvailabilityRequest);
            if (!isSuccess)
                return BadRequest(new { message = "Failed to create availability." });

            return Ok(new { message = "Availability created successfully." });
        }

    }
}
