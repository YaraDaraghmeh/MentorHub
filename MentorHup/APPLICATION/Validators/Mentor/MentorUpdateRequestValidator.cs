using FluentValidation;
using MentorHup.APPLICATION.DTOs.Mentor;

namespace MentorHup.APPLICATION.Validators.Mentor
{
    public class MentorUpdateRequestValidator : AbstractValidator<MentorUpdateRequest>
    {
        public MentorUpdateRequestValidator()
        {
            RuleFor(x => x.Name)           
                .Length(2, 100).WithMessage("Name must be between 2 and 100 characters");

            RuleFor(x => x.CompanyName)
                .Length(2, 100).WithMessage("Company Name must be between 4-100 characters");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Description must not exceed 500 characters");


            RuleFor(x => x.Experiences)
                .GreaterThan(0).WithMessage("Experiences must be positive && Greater than 0");

            RuleFor(x => x.Price)
                .GreaterThanOrEqualTo(0).WithMessage("Price must be positive ");


            RuleFor(x => x.Field)
                .MaximumLength(100).WithMessage("Field must not exceed 100 characters");


            RuleForEach(x => x.Availabilities).ChildRules(
                a =>
                {
                    a.RuleFor(av => av.StartTime).LessThan(av => av.EndTime)
                        .WithMessage("StartTime must be before EndTime");

                    a.RuleFor(av => av.StartTime)
                        .Must(start => start > DateTime.UtcNow)
                        .WithMessage("StartTime cannot be in the past.");

                    a.RuleFor(av => av.EndTime)
                        .Must(end => end > DateTime.UtcNow)
                        .WithMessage("EndTime cannot be in the past.");
                });

            RuleFor(x => x.StripeAccountId)
                .MaximumLength(100).WithMessage("StripeAccountId must not exceed 100 characters");
        }
    }
}
