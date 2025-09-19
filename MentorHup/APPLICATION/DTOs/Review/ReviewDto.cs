namespace MentorHup.APPLICATION.DTOs.Review
{
    public class ReviewDto
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }

        // based on the function we fill it or not
        public string? MenteeName { get; set; }
        public string? MenteeImage { get; set; }
        public string? MentorName { get; set; }
        public string? MentorImage { get; set; }
    }
}
