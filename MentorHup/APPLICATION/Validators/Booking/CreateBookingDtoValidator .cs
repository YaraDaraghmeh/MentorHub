using FluentValidation;
using MentorHup.APPLICATION.DTOs.Booking;

namespace MentorHup.APPLICATION.Validators.Booking
{
    public class CreateBookingDtoValidator : AbstractValidator<CreateBookingDto>
    {
        public CreateBookingDtoValidator()
        {
            RuleFor(x => x.MenteeId)
                .GreaterThan(0).WithMessage("MenteeId must be a valid positive number.");

            RuleFor(x => x.MentorAvailabilityId)
                .GreaterThan(0).WithMessage("MentorAvailabilityId must be a valid positive number.");
        }
    }
}
