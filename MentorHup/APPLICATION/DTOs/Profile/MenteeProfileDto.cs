using MentorHup.APPLICATION.DTOs.Booking;

namespace MentorHup.APPLICATION.DTOs.Profile
{
    public class MenteeProfileDto : BaseProfileDto
    {
        public int Id { get; set; }
        public string ApplicationUserId { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Gender { get; set; }
        public List<MenteeBookingOverviewDto> Bookings { get; set; }
    }
}
