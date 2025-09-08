using MentorHup.APPLICATION.DTOs.Booking;
using MentorHup.APPLICATION.Service.Booking;
using MentorHup.APPLICATION.Service.Strip;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MentorHup.Controllers
{
    [Route("api/bookings")]
    [ApiController]
    public class BookingController(IBookingService bookingService
        , IStripeService stripeService) : ControllerBase
    {
       

        [HttpPost("checkout")]
        [Authorize(Roles = "Mentee")]
        public async Task<IActionResult> CreateBookingAndCheckout([FromBody] CreateBookingDto dto)
        {
            try
            {
                // 1️⃣ إنشاء الحجز والحصول على الكيان نفسه
                var bookingEntity = await bookingService.PrepareBookingForCheckoutAsync(dto);

                var sessionUrl = await stripeService.CreateCheckoutSessionAsync(bookingEntity);

                return Ok(new { Url = sessionUrl });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }

    }
}
