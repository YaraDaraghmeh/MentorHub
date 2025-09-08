namespace MentorHup.Domain.Entities
{
    public class Mentor
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Field { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int Experiences { get; set; }
        public decimal Price { get; set; }
        public string? StripeAccountId { get; set; }

        public string ApplicationUserId { get; set; } = null!;
        public ApplicationUser ApplicationUser { get; set; } = null!;

        public ICollection<MentorSkill> MentorSkills { get; set; } = new List<MentorSkill>();
        public ICollection<MentorAvailability> Availabilities { get; set; } = new List<MentorAvailability>();

        public ICollection<Booking>? Bookings { get; set; }

    }
}
