using FluentValidation;
using MentorHup.APPLICATION.Dtos.Mentee;

namespace MentorHup.APPLICATION.Validators.Mentee
{
    public class MenteeLoginRequestValidator : AbstractValidator<MenteeLoginRequest>
    {
        public MenteeLoginRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Email is invalid");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required");
        }
    }
}
