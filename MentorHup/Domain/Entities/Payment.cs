namespace MentorHup.Domain.Entities;

public class Payment
{
    public int Id { get; set; }

    public int BookingId { get; set; }
    public Booking Booking { get; set; } = null!;

    public decimal Amount { get; set; } 
    public string Currency { get; set; } = "USD";
    public string PaymentIntentId { get; set; } = null!;

    // Pending, Succeeded, Failed
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending; 
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? RefundedAt { get; set; }

}

public enum PaymentStatus
{
    Pending,
    Succeeded,
    Failed,
    Refunded
}

