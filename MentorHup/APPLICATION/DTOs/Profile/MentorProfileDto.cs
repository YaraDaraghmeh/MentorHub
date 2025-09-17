namespace MentorHup.APPLICATION.DTOs.Profile
{
    public class MentorProfileDto : BaseProfileDto
    {
        public int Id { get; set; }
        public string ApplicationUserId { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public List<string> Skills { get; set; }
    }
}
