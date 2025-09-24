using FluentValidation;
using MentorHup.APPLICATION.DTOs.DTOs;

namespace MentorHup.APPLICATION.Validators.Message
{
    public class CreateMessageDtoValidator : AbstractValidator<CreateMessageDto>
    {
        public CreateMessageDtoValidator()
        {
            RuleFor(x => x.Content).NotEmpty().MaximumLength(1000);
            RuleFor(x => x.ReceiverId).NotEmpty();
        }
    }
}
