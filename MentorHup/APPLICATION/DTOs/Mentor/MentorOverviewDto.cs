namespace MentorHup.APPLICATION.DTOs.Mentor
{
    public class MentorOverviewDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; }
        public string CompanyName { get; set; }
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public int Experiences { get; set; }
        public string Field { get; set; } = null!;
        public int ReviewCount { get; set; }
        public double ReviewAverage { get; set; }
        public DateTime CreatedAt { get; set; }
        public string ImageLink { get; set; }
        public string CVLink { get; set; }

        public List<string> Skills { get; set; } = new();
        public List<MentorAvailabilityResponse> Availabilities { get; set; } = new();
    }
}
