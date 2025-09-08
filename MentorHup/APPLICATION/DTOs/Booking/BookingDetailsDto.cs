namespace MentorHup.APPLICATION.DTOs.Booking
{
    public class BookingDetailsDto
    {
        public int Id { get; set; }
        public string MentorName { get; set; } = null!;
        public string MenteeName { get; set; } = null!;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public bool IsConfirmed { get; set; }
        public string? PaymentStatus { get; set; }
    }

}
