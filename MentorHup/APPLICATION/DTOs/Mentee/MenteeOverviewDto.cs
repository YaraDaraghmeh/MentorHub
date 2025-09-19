
using MentorHup.APPLICATION.DTOs.Booking;

namespace MentorHup.APPLICATION.DTOs.Mentee
{
    public class MenteeOverviewDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; }
        public string Gender { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public string? ImageLink { get; set; }
    }
}
