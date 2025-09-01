using FluentValidation;
using MentorHup.APPLICATION.DTOs.Mentor;

namespace MentorHup.APPLICATION.Validators.Mentor
{
    public class MentorLoginRequestValidator: AbstractValidator<MentorLoginRequest>
    {
       public MentorLoginRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Email is invalid");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters");
        }
    }
}
