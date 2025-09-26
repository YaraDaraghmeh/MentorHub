namespace MentorHup.APPLICATION.DTOs.Mentor
{
    public class MentorUpdateRequest
    {
        public string? UserName { get; set; }
        public string? Name { get; set; }
        public string? CompanyName { get; set; }
        public string? Field { get; set; }
        public string? Description { get; set; }
        public int? Experiences { get; set; }
        public decimal? Price { get; set; }
        public string? StripeAccountId { get; set; }

        public List<int>? SkillIds { get; set; }
        //public List<MentorAvailabilityRequest>? Availabilities { get; set; }
    }
}
