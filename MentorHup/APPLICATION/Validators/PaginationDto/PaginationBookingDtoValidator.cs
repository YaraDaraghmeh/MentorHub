using FluentValidation;
using MentorHup.APPLICATION.DTOs.Pagination;

namespace MentorHup.APPLICATION.Validators.PaginationDto
{
    public class PaginationBookingDtoValidator:AbstractValidator<PaginationBookingDto>
    {
        private readonly int[] allowPageSize = new int[] { 5, 10, 15 };
        public PaginationBookingDtoValidator()
        {
            RuleFor(x => x.PageNumber).GreaterThan(0)
            .WithMessage("Page number must be greater than 0");

            RuleFor(x => x.PageSize).Must(v => allowPageSize.Contains(v))
                .WithMessage("Page size must be either 5, 10, or 15.");
        }
    }
}
