namespace MentorHup.APPLICATION.Dtos.Mentee
{
    public class MenteeResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public string? ImageLink { get; set; }
        public string Email { get; set; } = null!;  
        public string AccessToken { get; set; } = null!;
        public List<string> Roles { get; set; } = new();
        public DateTime Expires { get; set; }


    }
}
