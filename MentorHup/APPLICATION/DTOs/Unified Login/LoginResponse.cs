namespace MentorHup.APPLICATION.DTOs.Unified_Login
{
    public class LoginResponse
    {
        public string UserId { get; set; } 
        public string Email { get; set; } 
        public List<string> Roles { get; set; } = new List<string>();
        public string AccessToken { get; set; }
        public DateTime Expires { get; set; }
    }
}
