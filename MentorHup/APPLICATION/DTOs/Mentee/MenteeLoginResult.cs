namespace MentorHup.APPLICATION.Dtos.Mentee
{
    public class MenteeLoginResult
    {
        public bool IsSuccess { get; set; }
        public string[]? Errors { get; set; }
        public MenteeResponse? Mentee { get; set; }
    }

}
