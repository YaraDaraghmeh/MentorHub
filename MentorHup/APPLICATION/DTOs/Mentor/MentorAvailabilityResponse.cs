namespace MentorHup.APPLICATION.DTOs.Mentor
{
    public class MentorAvailabilityResponse
    {
        public int MentorAvailabilityId { get; set; }
        public string DayOfWeek { get; set; } 
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int DurationInMinutes { get; set; }
        public bool IsBooked { get; set; }
    }
}
