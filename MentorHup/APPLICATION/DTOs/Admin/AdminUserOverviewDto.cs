namespace MentorHup.APPLICATION.DTOs.Admin
{
    public class AdminUserOverviewDto
    {
        public string Id { get; set; } = default!;
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsDeleted { get; set; }
        public DateTimeOffset? LockoutEnd { get; set; }
        public string? Role { get; set; }
        public string? ImageLink { get; set; }
    }
}
