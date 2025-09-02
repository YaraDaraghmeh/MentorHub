using System.ComponentModel.DataAnnotations;

namespace MentorHup.APPLICATION.DTOs.Pagination
{
    public class PaginationDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "Page number must be greater than 0.")]
        public int PageNumber { get; set; } = 1;

        [RegularExpression("^(5|10|15)$", ErrorMessage = "Page size must be either 5, 10, or 15.")]
        public int PageSize { get; set; } = 5;
    }
}
