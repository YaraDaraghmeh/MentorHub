using FluentValidation;
using MentorHup.APPLICATION.Dtos.Mentee;

namespace MentorHup.APPLICATION.Validators.Mentee
{
    public class MenteeUpdateRequestValidator:AbstractValidator<MenteeUpdateRequest>
    {
        public MenteeUpdateRequestValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required")
                .Length(2, 100).WithMessage("Name must be between 2 and 100 characters");

            RuleFor(x => x.Gender)
                .NotEmpty().WithMessage("Gender is required")
                .Must(g => g == "Male" || g == "Female")
                .WithMessage("Gender must be Male, Female");

        }
    }
}
