
    namespace MentorHup.APPLICATION.DTOs.Mentor
    {
        public class MentorRegisterRequest
        {
            public string Name { get; set; } = null!;
            public string Field { get; set; } = null!;
            public string CompanyName { get; set; } 
            public string Description { get; set; } = null!;
            public int Experiences { get; set; }
            public decimal Price { get; set; }
            public string? StripeAccountId { get; set; }
            public string Email { get; set; } = null!;
            public string Password { get; set; } = null!;

            public List<int> SkillIds { get; set; } = new();
            public List<MentorAvailabilityRequest> Availabilities { get; set; } = new();

        }
    }
