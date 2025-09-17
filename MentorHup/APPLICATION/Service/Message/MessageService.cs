using MentorHup.APPLICATION.DTOs.DTOs;
using MentorHup.APPLICATION.DTOs.Notification;
using MentorHup.APPLICATION.Service.Message;
using MentorHup.APPLICATION.Service.Notification;
using MentorHup.Domain.Entities;
using MentorHup.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

public class MessageService(ApplicationDbContext _context , INotificationService _notificationService) : IMessageService
{
    

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

        var sender = await _context.Users
        .Include(u => u.Mentor)
        .Include(u => u.Mentee)
        .FirstOrDefaultAsync(u => u.Id == senderId);

        string senderName = sender?.Mentor?.Name ?? sender?.Mentee?.Name ?? "Admin";
        string? senderAvatar = sender?.Mentor?.ImageUrl ?? sender?.Mentee?.ImageUrl;

        await _notificationService.CreateNotificationAsync(new NotificationCreateDto
        {
            UserId = dto.ReceiverId,
            Title = "New Message",
            Message = $"You have a new message from {senderName}"
        });

        return new MessageDto
        {
            Id = message.Id,
            Content = message.Content,
            SenderId = message.SenderId,
            ReceiverId = message.ReceiverId,
            SentAt = message.SentAt,
            IsRead = message.IsRead,
            SenderName = senderName,
            SenderAvatar = senderAvatar

        };
    }

    public async Task<List<MessageDto>> GetConversationAsync(string userId, string otherUserId)
    {
        var messages =  await _context.Messages
            .Where(m => (m.SenderId == userId && m.ReceiverId == otherUserId) ||
                        (m.SenderId == otherUserId && m.ReceiverId == userId))
            .Include(m => m.Sender.Mentor)   
            .Include(m => m.Sender.Mentee)
            .OrderBy(m => m.SentAt)
            .ToListAsync();

        foreach (var msg in messages.Where(m => m.ReceiverId == userId && !m.IsRead))
        {
            msg.IsRead = true;
        }
        await _context.SaveChangesAsync();

        return messages.Select(m =>
        {
            string senderName = m.Sender.Mentor?.Name ?? m.Sender.Mentee?.Name ?? "Admin";
            string? senderAvatar = m.Sender.Mentor?.ImageUrl ?? m.Sender.Mentee?.ImageUrl;

            return new MessageDto
            {
                Id = m.Id,
                Content = m.Content,
                SenderId = m.SenderId,
                ReceiverId = m.ReceiverId,
                SentAt = m.SentAt,
                IsRead = m.IsRead,
                SenderName = senderName,
                SenderAvatar = senderAvatar
            };
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
