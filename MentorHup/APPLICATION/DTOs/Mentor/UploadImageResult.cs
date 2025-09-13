namespace MentorHup.APPLICATION.DTOs.Mentor
{
    public class UploadImageResult
    {
        public bool IsSuccess { get; set; }
        public string? ImageUrl { get; set; }
        public IEnumerable<string>? Errors { get; set; }
    }
}
