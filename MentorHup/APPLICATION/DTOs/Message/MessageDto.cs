namespace MentorHup.APPLICATION.DTOs.DTOs
{
    public class MessageDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public string SenderId { get; set; } = null!;
        public string ReceiverId { get; set; } = null!;
        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }

        public string SenderName { get; set; } = null!;
        public string? SenderAvatar { get; set; }
    }

}
