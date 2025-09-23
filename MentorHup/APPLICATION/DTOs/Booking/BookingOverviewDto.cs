using MentorHup.Domain.Entities;

namespace MentorHup.APPLICATION.DTOs.Booking
{
    public class BookingOverviewDto
    {
        public int BookingId { get; set; }
        public string MentorName { get; set; } = null!;
        public string MenteeName { get; set; } = null!;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public string? MeetingUrl { get; set; }
        public string? MenteeUserId { get; set; }
        public string? MentorUserId { get; set; }
        public string? MenteeImageLink { get; set; }
        public string? MentorImageLink { get; set; }

    }

}
