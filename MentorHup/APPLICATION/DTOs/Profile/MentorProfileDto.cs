using MentorHup.APPLICATION.DTOs.Mentor;

namespace MentorHup.APPLICATION.DTOs.Profile
{
    public class MentorProfileDto : BaseProfileDto
    {
        public int Id { get; set; }
        public string ApplicationUserId { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Name { get; set; }
        public string CompanyName { get; set; }
        public string ImageLink { get; set; }
        public string CVLink { get; set; }
        public string Description { get; set; }
        public int Experiences { get; set; }
        public decimal Price { get; set; }
        public string? StripeAccountId { get; set; }
        public string Field { get; set; } 
        public DateTime CreatedAt { get; set; }
        public List<string> Skills { get; set; }
        public List<MentorAvailabilityResponse> Availabilites { get; set; }
        public int ReviewsCount { get; set; }
    }
}
