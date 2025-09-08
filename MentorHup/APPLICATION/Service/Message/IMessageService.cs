using MentorHup.APPLICATION.DTOs.DTOs;


namespace MentorHup.APPLICATION.Service.Message
{
    public interface IMessageService
    {
        Task<MessageDto> SendMessageAsync(string senderId, CreateMessageDto dto);
        Task<List<MessageDto>> GetConversationAsync(string userId, string otherUserId);

        Task<MentorHup.Domain.Entities.Message?> MarkMessageAsReadAsync(int messageId);
    }
}
