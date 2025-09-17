namespace MentorHup.APPLICATION.DTOs.Notification
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Title { get; set; } = string.Empty;
    }

}
