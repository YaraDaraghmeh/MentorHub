using MentorHup.APPLICATION.DTOs.Booking;
using MentorHup.APPLICATION.Responses;
using MentorHup.APPLICATION.Service.Booking;
using MentorHup.APPLICATION.Service.Strip;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MentorHup.Controllers
{
    [Route("api/bookings")]
    [ApiController]
    public class BookingController(IBookingService bookingService
        , IStripeService stripeService) : ControllerBase
    {
       

        [HttpPost("checkout")]
        [Authorize(Roles = "Mentee")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CreateBookingAndCheckout([FromBody] CreateBookingDto dto)
        {
            try
            {
                var bookingEntity = await bookingService.PrepareBookingForCheckoutAsync(dto);

                var sessionUrl = await stripeService.CreateCheckoutSessionAsync(bookingEntity);

                return Ok(new { Url = sessionUrl });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

        [HttpPost("{bookingId}/cancel")]
        [Authorize(Roles = "Mentee,Mentor")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CancelBooking(int bookingId)
        {
            var appUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(appUserId))
                return Unauthorized(new { Success = false, Message = "Invalid user" });

            var role = User.IsInRole("Mentee") ? "Mentee" : "Mentor";
            var result = await bookingService.CancelBookingAsync(bookingId, appUserId, role);

            if (!result.Success) return BadRequest(result);

            return Ok(result);
        }


    }
}
