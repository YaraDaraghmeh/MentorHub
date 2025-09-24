namespace MentorHup.Domain.Entities;

public class AdminCommission
{
    public int Id { get; set; }
    public int BookingId { get; set; }
    public Booking Booking { get; set; } = null!;
    public decimal Amount { get; set; } = 1; 
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
