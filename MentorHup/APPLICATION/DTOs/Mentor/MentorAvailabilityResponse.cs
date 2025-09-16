namespace MentorHup.APPLICATION.DTOs.Mentor
{
    public class MentorAvailabilityResponse
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int DurationInMinutes { get; set; }
        public bool IsBooked { get; set; }
    }
}
