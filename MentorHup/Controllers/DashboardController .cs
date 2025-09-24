using MentorHup.APPLICATION.Dtos.Mentee;
using MentorHup.APPLICATION.DTOs.Booking;
using MentorHup.APPLICATION.Service.Dashboard;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IWeeklyDashboardService _weeklyDashboardService;

    public DashboardController(IWeeklyDashboardService weeklyDashboardService)
    {
        _weeklyDashboardService = weeklyDashboardService;
    }

    [HttpGet("weekly-bookings")]
    [Authorize(Roles = "Admin,Mentor,Mentee")]
    [ProducesResponseType(typeof(List<WeeklyBookingDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<List<WeeklyBookingDto>>> GetWeeklyBookings([FromQuery] int weeks = 8)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        string role;
        if (User.IsInRole("Admin")) role = "Admin";
        else if (User.IsInRole("Mentor")) role = "Mentor";
        else if (User.IsInRole("Mentee")) role = "Mentee";
        else return Forbid();

        var data = await _weeklyDashboardService.GetWeeklyBookingsAsync(role, userId!, weeks);
        return Ok(data);
    }
}
