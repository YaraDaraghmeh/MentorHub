using FluentValidation;
using MentorHup.APPLICATION.DTOs.Mentor;
using MentorHup.APPLICATION.DTOs.Unified_Login;

namespace MentorHup.APPLICATION.Validators.Unified_Login
{
    public class LoginRequestValidator: AbstractValidator<LoginRequest>
    {
       public LoginRequestValidator()
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
