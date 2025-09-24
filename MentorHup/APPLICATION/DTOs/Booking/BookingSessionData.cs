namespace MentorHup.APPLICATION.DTOs.Booking
{
    public class BookingSessionData
    {
        public int Id { get; set; }
        public int MenteeId { get; set; }
        public int MentorId { get; set; }
        public int MentorAvailabilityId { get; set; }
        public decimal Amount { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string? MentorName { get; set; }
        public string? MenteeName { get; set; }

        public string MentorStripeAccountId { get; set; }

    }

}
