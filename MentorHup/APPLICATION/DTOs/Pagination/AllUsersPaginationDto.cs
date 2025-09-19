namespace MentorHup.APPLICATION.DTOs.Pagination
{
    public class AllUsersPaginationDto
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        // Filters
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }
        public bool? IsDeleted { get; set; } // optional: show deleted / active
    }
}
