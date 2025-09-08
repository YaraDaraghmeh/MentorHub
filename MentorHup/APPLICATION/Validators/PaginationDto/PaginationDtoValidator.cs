using FluentValidation;
namespace MentorHup.APPLICATION.Validators.PaginationDto;

public class PaginationDtoValidator: AbstractValidator<MentorHup.APPLICATION.DTOs.Pagination.PaginationDto>
{
    private int[] allowPageSize = new int[] { 5, 10, 15 };
    public PaginationDtoValidator()
    {
        RuleFor(x => x.PageNumber).GreaterThan(0)
            .WithMessage("Page number must be greater than 0");

        RuleFor(x => x.PageSize).Must(v => allowPageSize.Contains(v))
            .WithMessage("Page size must be either 5, 10, or 15.");

        RuleFor(x => x.MinPrice)
        .GreaterThanOrEqualTo(0).When(x => x.MinPrice.HasValue);

        RuleFor(x => x.MaxPrice)
       .GreaterThanOrEqualTo(0).When(x => x.MinPrice.HasValue)
       .When(x => x.MinPrice.HasValue)
       .Must((dto, max) => !dto.MinPrice.HasValue || max >= dto.MinPrice)
       .WithMessage("MaxPrice must be greater than or equal to MinPrice");

        RuleFor(x => x.SkillName)
        .MaximumLength(50);

        RuleFor(x => x.Field)
            .MaximumLength(50);

        RuleFor(x => x.Experiences)
        .GreaterThanOrEqualTo(1).When(x => x.Experiences.HasValue);


    }
}
