namespace MentorHup.APPLICATION.Settings
{
    public class JwtSettings
    {
        public string Key { get; set; } = null!;
        public string ValidIssuer { get; set; } = null!;
        public string ValidAudience { get; set; } = null!;
        public int Expires { get; set; } = 3;
    }
}
