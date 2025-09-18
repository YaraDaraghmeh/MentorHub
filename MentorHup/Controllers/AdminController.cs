using MentorHup.APPLICATION.DTOs.Admin;
using MentorHup.APPLICATION.DTOs.Pagination;
using MentorHup.APPLICATION.Service.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MentorHup.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController(IAdminService adminService) : ControllerBase
    {
        private readonly IAdminService adminService = adminService;

        [HttpGet("all-users")]
        public async Task<IActionResult> GetAllUsers([FromQuery] AllUsersPaginationDto allUsersPaginationDto)
        {
            var users = await adminService.GetAllUsersAsync(allUsersPaginationDto.PageSize, allUsersPaginationDto.PageNumber,
                allUsersPaginationDto.Name, allUsersPaginationDto.Email, allUsersPaginationDto.Role, allUsersPaginationDto.IsDeleted);

            return Ok(users);
        }

        [HttpGet("mentors")]
        public async Task<IActionResult> GetAllMentors([FromQuery] PaginationDto dto)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var mentors = await adminService.GetAllMentorsAsync(dto.PageSize,
                dto.PageNumber, dto.Field, dto.SkillName, dto.MinPrice, dto.MaxPrice,
                dto.Experiences);

            return Ok(mentors);
        }

        [HttpGet("mentees")]
        public async Task<IActionResult> GetAllMentees([FromQuery] MenteesPaginationDto menteesPaginationDto)
        {
            var mentees = await adminService.GetAllMenteesAsync(menteesPaginationDto.PageSize,
                menteesPaginationDto.PageNumber, menteesPaginationDto.Name, menteesPaginationDto.Gender);

            return Ok(mentees);
        }


        // Soft delete user (deactivate)
        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> SoftDeleteUser(string userId)
        {
            var result = await adminService.SoftDeleteUserAsync(userId);

            if (!result)
                return NotFound("User not found or already deleted.");

            return Ok("User soft deleted successfully.");
        }

        // Restore user (reactivate)
        [HttpPatch("users/{userId}/restore")]
        public async Task<IActionResult> RestoreUser(string userId)
        {
            var result = await adminService.RestoreUserAsync(userId);

            if (!result)
                return NotFound("User not found or already active.");

            return Ok("User restored successfully.");
        }

        [HttpPatch("users/{userId}/block")]
        public async Task<IActionResult> BlockUser(string userId)
        {
            var result = await adminService.BlockUserAsync(userId);
            if (!result) return NotFound("User not found.");
            return Ok("User blocked successfully.");
        }

        [HttpPatch("users/{userId}/unblock")]
        public async Task<IActionResult> UnblockUser(string userId)
        {
            var result = await adminService.UnblockUserAsync(userId);
            if (!result) return NotFound("User not found.");
            return Ok("User unblocked successfully.");
        }


        [HttpGet("dashboard-stats")]
        public async Task<ActionResult<AdminDashboardStats>> GetDashboardStats()
        {
            var stats = await adminService.GetDashboardStatisticsAsync();
            return Ok(stats);
        }


    }
}
