namespace MentorHup.APPLICATION.DTOs.Mentor
{
    public class UploadCVResult
    {
        public bool IsSuccess { get; set; }
        public string? CVUrl { get; set; }
        public string[]? Errors { get; set; }
    }
}
