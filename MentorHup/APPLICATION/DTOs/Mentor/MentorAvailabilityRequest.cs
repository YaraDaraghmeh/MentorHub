namespace MentorHup.APPLICATION.DTOs.Mentor
    {
    public class MentorAvailabilityRequest
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int DurationInMinutes { get; set; }
    }
}
