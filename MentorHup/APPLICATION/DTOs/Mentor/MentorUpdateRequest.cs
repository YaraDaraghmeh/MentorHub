namespace MentorHup.APPLICATION.DTOs.Mentor
{
    public class MentorUpdateRequest
    {
        public string? Name { get; set; }
        public string? Field { get; set; }
        public string? Description { get; set; }
        public int? Experiences { get; set; }
        public decimal? Price { get; set; }
        public string? StripeAccountId { get; set; }
        public IFormFile? ImageForm { get; set; }
    }
}
