using MentorHup.APPLICATION.Dtos.Mentee;
using MentorHup.APPLICATION.DTOs.Booking;
using MentorHup.APPLICATION.Service.Dashboard.EarningsService;
using MentorHup.APPLICATION.Service.Dashboard.WeeklyService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/dashboard")]
public class DashboardController(IWeeklyDashboardService _weeklyDashboardService , IEarningsService _earningsService) : ControllerBase
{
    

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

    [HttpGet("weekly-earnings")]
    [Authorize(Roles = "Admin,Mentor")]
    [ProducesResponseType(typeof(List<WeeklyEarningsDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<List<WeeklyEarningsDto>>> GetWeeklyEarnings([FromQuery] int weeks = 8)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        string role;
        if (User.IsInRole("Admin")) role = "Admin";
        else if (User.IsInRole("Mentor")) role = "Mentor";
        else return Forbid();

        var data = await _earningsService.GetWeeklyEarningsAsync(role, userId!, weeks);
        return Ok(data);
    }

}
