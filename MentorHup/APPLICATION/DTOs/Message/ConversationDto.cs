namespace MentorHup.APPLICATION.DTOs.Message
{
    public class ConversationDto
    {
        public string ConversationWithId { get; set; }
        public string ConversationWithName { get; set; }
        public string? ConversationWithAvatar { get; set; }
        public string LastMessage { get; set; }
        public DateTime LastMessageTime { get; set; }
        public bool IsRead { get; set; }
    }

}
