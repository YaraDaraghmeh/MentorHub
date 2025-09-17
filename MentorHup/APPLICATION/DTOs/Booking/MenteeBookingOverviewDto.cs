using MentorHup.Domain.Entities;

namespace MentorHup.APPLICATION.DTOs.Booking
{
    public class MenteeBookingOverviewDto
    {
        public int BookingId { get; set; }
        public string MentorName { get; set; } = null!;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal Amount { get; set; }
        public BookingStatus Status { get; set; }
        public string? MeetingUrl { get; set; }
    }
}
