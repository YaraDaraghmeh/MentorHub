namespace MentorHup.APPLICATION.Dtos.Mentee
{
    public class MenteeRegisterRequest
    {
        public string Name { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public IFormFile? Image { get; set; }
        public string Email { get; set; } = null!;       
        public string Password { get; set; } = null!;    
    }




}
