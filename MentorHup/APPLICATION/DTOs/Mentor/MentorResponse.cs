namespace MentorHup.APPLICATION.DTOs.Mentor
    {
    public class MentorResponse
        {
            public int Id { get; set; }
            public string Name { get; set; } = null!;
            public string Description { get; set; } = null!;
            public int Experiences { get; set; }
            public decimal Price { get; set; }
            public string Email { get; set; } = null!;
            public List<string> Roles { get; set; } = new();
            public List<string> Skills { get; set; } = new();
            public string AccessToken { get; set; } = null!;
            public DateTime Expires { get; set; }

        }
    }
