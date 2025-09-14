namespace MentorHup.APPLICATION.DTOs.Pagination
{
    public class PaginationDto
    {
        public int PageNumber { get; set; } = 1;

        public int PageSize { get; set; } = 5;

        public string? SkillName { get; set; }
        public int? Experiences { get; set; }

        public string? Field { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
    }
}
