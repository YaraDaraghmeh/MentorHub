namespace MentorHup.Domain.Entities;

public class MentorAvailability
{
    public int Id { get; set; }

    public int MentorId { get; set; } 
    public Mentor Mentor { get; set; } = null!;

    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    public bool IsBooked { get; set; } = false;

    public int DurationInMinutes { get; set; } 
}
