namespace MentorHup.APPLICATION.DTOs.Pagination
{
    public class SkillsPaginationDto
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 5;

        public string? Name { get; set; }
    }
}
