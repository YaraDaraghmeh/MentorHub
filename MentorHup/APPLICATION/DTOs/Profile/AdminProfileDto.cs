namespace MentorHup.APPLICATION.DTOs.Profile
{
    public class AdminProfileDto : BaseProfileDto
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
