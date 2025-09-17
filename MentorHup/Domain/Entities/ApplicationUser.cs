using Microsoft.AspNetCore.Identity;

namespace MentorHup.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public Mentee? Mentee { get; set; }
        public Mentor? Mentor { get; set; }
        public bool IsDeleted { get; set; } // false by default (we put it for soft deleted/deactivate user by admin)
        public DateTime CreatedAt { get; set; }
        public ICollection<Message> SentMessages { get; set; } = new List<Message>();
        public ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();

        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();


    }
}
