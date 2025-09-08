namespace MentorHup.Domain.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false; 
        public string SenderId { get; set; } = null!;
        public ApplicationUser Sender { get; set; } = null!;

        public string ReceiverId { get; set; } = null!;
        public ApplicationUser Receiver { get; set; } = null!;
    }
}
