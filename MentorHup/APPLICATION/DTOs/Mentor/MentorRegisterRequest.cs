    using MentorHup.APPLICATION.Dtos.Mentee;

    namespace MentorHup.APPLICATION.DTOs.Mentor
    {
        public class MentorRegisterRequest
        {
            public string Name { get; set; } = null!;
            public string Description { get; set; } = null!;
            public IFormFile? Image { get; set; }
            public string Email { get; set; } = null!;
            public string Password { get; set; } = null!;
            public int Experiences { get; set; }
            public string Field { get; set; } = null!;
            public string? StripeAccountId { get; set; }

            public decimal Price { get; set; }
            public List<int> SkillIds { get; set; } = new();
            public List<MentorAvailabilityRequest> Availabilities { get; set; } = new();

        }
    }
