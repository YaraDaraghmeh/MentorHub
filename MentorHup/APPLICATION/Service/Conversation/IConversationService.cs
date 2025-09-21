using MentorHup.APPLICATION.DTOs.Message;

namespace MentorHup.APPLICATION.Service.Conversation
{
    public interface IConversationService
    {
        Task<List<ConversationDto>> GetConversationsListAsync(string userId, string? searchTerm = null);
    }
}
