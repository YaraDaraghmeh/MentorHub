using Microsoft.AspNetCore.Identity;

namespace MentorHup.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {

        public Mentee? Mentee { get; set; }
        public Mentor? Mentor { get; set; }


    }
}
