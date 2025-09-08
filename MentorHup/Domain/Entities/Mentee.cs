namespace MentorHup.Domain.Entities
{
    public class Mentee
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Gender { get; set; } = null!;

        public string ApplicationUserId { get; set; } = null!;
        public ApplicationUser ApplicationUser { get; set; } = null!;

        public ICollection<Booking>? Bookings { get; set; }
    }
}
