using FluentValidation;
using MentorHup.APPLICATION.Dtos.Mentee;

namespace MentorHup.APPLICATION.Validators.Mentee
{
    public class MenteeRegisterRequestValidator : AbstractValidator<MenteeRegisterRequest>
    {
        public MenteeRegisterRequestValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required")
                .Length(2, 100).WithMessage("Name must be between 2 and 100 characters");

            RuleFor(x => x.Gender)
                .NotEmpty().WithMessage("Gender is required")
                .Must(g => g == "Male" || g == "Female" )
                .WithMessage("Gender must be Male, Female");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Email is invalid");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters");
        }
    }


}
