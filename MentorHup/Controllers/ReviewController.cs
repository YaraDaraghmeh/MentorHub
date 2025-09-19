using MentorHup.APPLICATION.DTOs.Review;
using MentorHup.APPLICATION.Responses;
using MentorHup.APPLICATION.Service.Review;
using MentorHup.Infrastructure.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[ApiController]
[Route("api/reviews")]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;
    private readonly ApplicationDbContext _context;


    public ReviewController(IReviewService reviewService, ApplicationDbContext context)
    {
        _reviewService = reviewService;
        _context = context;
    }

    [HttpPost]
    [Authorize(Roles = "Mentee")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    [ProducesResponseType( StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status400BadRequest)]

    public async Task<IActionResult> AddReview([FromBody] CreateReviewDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

        var mentee = await _context.Mentees
            .FirstOrDefaultAsync(m => m.ApplicationUserId == userId);

        if (mentee == null)
            return Unauthorized("Mentee not found");

        var result = await _reviewService.AddReviewAsync(dto , mentee.Id);


        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles ="Mentee")]
    [ProducesResponseType( StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

        var mentee = await _context.Mentees
            .FirstOrDefaultAsync(m => m.ApplicationUserId == userId);

        if (mentee == null)
            return Unauthorized("Mentee not found");

        var result = await _reviewService.DeleteReviewAsync(id, mentee.Id);

        if (!result.Success)
            return NotFound(result);

        return NoContent();
    }

    [HttpGet("all-reviews")]
    public async Task<ActionResult<List<ReviewDto>>> GetAllReviews()
    {
        var reviews = await _reviewService.GetAllReviewsAsync();
        return Ok(reviews);
    }


    [HttpGet("mentor/{mentorId}")]
    [Authorize()]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType( typeof(List<ReviewDto>),StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<List<ReviewDto>>> GetReviewsByMentor(int mentorId)
    {

        var mentorExists = await _context.Mentors.AnyAsync(m => m.Id == mentorId);
        if (!mentorExists)
            return NotFound($"Mentor with ID {mentorId} does not exist.");


        var reviews =await _reviewService.GetReviewsByMentorIdAsync(mentorId);
        return Ok(reviews);
    }

    [HttpGet("my/mentee")]
    [Authorize(Roles = "Mentee")]
    public async Task<ActionResult<List<ReviewDto>>> GetMyReviews()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

        var mentee = await _context.Mentees.FirstOrDefaultAsync(mentee => mentee.ApplicationUserId == userId);

        if (mentee == null)
            return Unauthorized("Mentee not found.");

        var reviews = await _reviewService.GetReviewsByMenteeIdAsync(mentee.Id);

        return Ok(reviews);
    }
    
    [HttpGet("my/mentor")]
    [Authorize(Roles = "Mentor")]
    public async Task<ActionResult<List<ReviewDto>>> GetMyReviewsForMentor()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

        var mentor = await _context.Mentors.FirstOrDefaultAsync(mentor => mentor.ApplicationUserId == userId);

        if (mentor == null)
            return Unauthorized("Mentor not found.");

        var reviews = await _reviewService.GetReviewsByMentorIdAsync(mentor.Id);

        return Ok(reviews);
    }




}
