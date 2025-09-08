namespace MentorHup.Domain.Entities;

public class Booking
{
    public int Id { get; set; }

    public int MentorId { get; set; }
    public Mentor Mentor { get; set; } = null!;
    public int MenteeId { get; set; }
    public Mentee Mentee { get; set; } = null!;
    public int MentorAvailabilityId { get; set; }
    public MentorAvailability MentorAvailability { get; set; } = null!;

    public DateTime StartTime { get; set; } 
    public DateTime EndTime { get; set; }

    public decimal Amount { get; set; } 
    public bool IsConfirmed { get; set; } = false; 
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Payment? Payment { get; set; }
    public AdminCommission? AdminCommission { get; set; }

}
