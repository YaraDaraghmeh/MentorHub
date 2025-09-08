namespace MentorHup.APPLICATION.DTOs.Mentor
    {
    public class MentorLoginRegistrationResult
        {
            public bool IsSuccess { get; set; }
            public string[]? Errors { get; set; }
            public MentorResponse? Mentor { get; set; }
        }
    }
