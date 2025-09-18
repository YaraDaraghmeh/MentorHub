namespace MentorHup.APPLICATION.DTOs.Mentor
    {
    public class MentorResponse
        {
            public int Id { get; set; }
            public string Name { get; set; } = null!;
            public string CompanyName { get; set; }
            public string Description { get; set; } = null!;
            public int Experiences { get; set; }
            public decimal Price { get; set; }
            public string? ImageLink {  get; set; }
            public string Email { get; set; } = null!;
            public string Field { get; set; } = null!;

            public List<string> Roles { get; set; } = new();
            public List<string> Skills { get; set; } = new();
            public DateTime Expires { get; set; }
          //  public List<MentorAvailabilityResponse> Availabilities { get; set; } = new();

    }
}
