namespace MentorHup.APPLICATION.DTOs.Unified_Login
{
    public class LoginResponse
    {
        public bool IsSuccess { get; set; }               
        public string[] Errors { get; set; } = Array.Empty<string>();

        public string UserId { get; set; } 
        public string Email { get; set; } 
        public string UserName { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
        public string ImageLink { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public DateTime Expires { get; set; }
    }
}
