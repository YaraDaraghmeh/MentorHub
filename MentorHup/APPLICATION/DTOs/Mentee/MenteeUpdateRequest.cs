namespace MentorHup.APPLICATION.Dtos.Mentee
{
    public class MenteeUpdateRequest
    {
        public string? UserName { get; set; }
        public string? Name { get; set; } = null!;
        public string? Gender { get; set; } = null!;
        public IFormFile? ImageForm { get; set; }
    }
}
