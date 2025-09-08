using MentorHup.APPLICATION.DTOs.DTOs;
using MentorHup.APPLICATION.Service.Message;
using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

public class MessageService : IMessageService
{
    private readonly ApplicationDbContext _context;

    public MessageService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<MessageDto> SendMessageAsync(string senderId, CreateMessageDto dto)
    {
        var message = new Message
        {
            Content = dto.Content,
            SenderId = senderId,
            ReceiverId = dto.ReceiverId,
            SentAt = DateTime.UtcNow
        };
        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        return new MessageDto
        {
            Id = message.Id,
            Content = message.Content,
            SenderId = message.SenderId,
            ReceiverId = message.ReceiverId,
            SentAt = message.SentAt,
            IsRead = message.IsRead
        };
    }

    public async Task<List<MessageDto>> GetConversationAsync(string userId, string otherUserId)
    {
        var messages =  await _context.Messages
            .Where(m => (m.SenderId == userId && m.ReceiverId == otherUserId) ||
                        (m.SenderId == otherUserId && m.ReceiverId == userId))
            .OrderBy(m => m.SentAt)
            .ToListAsync();

        foreach (var msg in messages.Where(m => m.ReceiverId == userId && !m.IsRead))
        {
            msg.IsRead = true;
        }
        await _context.SaveChangesAsync();

        return messages.Select(m => new MessageDto
        {
            Id = m.Id,
            Content = m.Content,
            SenderId = m.SenderId,
            ReceiverId = m.ReceiverId,
            SentAt = m.SentAt,
            IsRead = m.IsRead
        }).ToList();
    }

    public async Task<Message?> MarkMessageAsReadAsync(int messageId)
    {
        var message = await _context.Messages.FindAsync(messageId);
        if (message != null && !message.IsRead)
        {
            message.IsRead = true;
            await _context.SaveChangesAsync();
        }
        return message;
    }

}
