using MentorHup.APPLICATION.DTOs.Message;
using MentorHup.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace MentorHup.APPLICATION.Service.Conversation
{
    public class ConversationService : IConversationService
    {
        private readonly ApplicationDbContext _context;

        public ConversationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ConversationDto>> GetConversationsListAsync(string userId, string? searchTerm = null)
        {
            var messages = await _context.Messages
                .Include(m => m.Sender).ThenInclude(u => u.Mentor)
                .Include(m => m.Sender).ThenInclude(u => u.Mentee)
                .Include(m => m.Receiver).ThenInclude(u => u.Mentor)
                .Include(m => m.Receiver).ThenInclude(u => u.Mentee)
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .ToListAsync();

            var conversations = messages
                .GroupBy(m => m.SenderId == userId ? m.Receiver : m.Sender)
                .Select(g =>
                {
                    var lastMessage = g.OrderByDescending(m => m.SentAt).First();
                    var otherUser = g.Key;

                    var avatar = otherUser.Mentor?.ImageUrl
                                 ?? otherUser.Mentee?.ImageUrl
                                 ?? null;

                    return new ConversationDto
                    {
                        ConversationWithId = g.Key.Id,
                        ConversationWithName = g.Key.UserName ?? "Admin",
                        ConversationWithAvatar = avatar,
                        LastMessage = lastMessage.Content,
                        LastMessageTime = lastMessage.SentAt,
                        IsRead = lastMessage.ReceiverId == userId ? lastMessage.IsRead : true
                    };
                });

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                conversations = conversations.Where(c =>
                    c.ConversationWithName != null &&
                    c.ConversationWithName.Contains(searchTerm, StringComparison.OrdinalIgnoreCase));
            }

            return conversations
                .OrderByDescending(c => c.LastMessageTime)
                .ToList();
        }

    }
}
