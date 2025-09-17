using MentorHup.APPLICATION.DTOs.Notification;
using MentorHup.Infrastructure.Context;
using MentorHup.Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
namespace MentorHup.APPLICATION.Service.Notification
{
    public class NotificationService(ApplicationDbContext _context, IHubContext<NotificationHub> _hubContext) : INotificationService
    {
        public async Task<NotificationDto> CreateNotificationAsync(NotificationCreateDto dto)
        {
            var notification = new MentorHup.Domain.Entities.Notification
            {
                UserId = dto.UserId,
                Title = dto.Title,
                Message = dto.Message,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.User(dto.UserId).SendAsync("ReceiveNotification", notification);

            return new NotificationDto
            {
                Id = notification.Id,
                Message = notification.Message,
                Title = notification.Title,
                IsRead = notification.IsRead,
                CreatedAt = notification.CreatedAt
            };
        }

        public async Task<List<NotificationDto>> GetUserNotificationsAsync(string userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return notifications.Select(n => new NotificationDto
            {
                Id = n.Id,
                Message = n.Message,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            }).ToList();
        }

        public async Task<int> GetUnreadCountAsync(string userId)
        {
            return await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead);
        }

        public async Task<bool> MarkAsReadAsync(int id, string userId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

            if (notification == null) return false;

            notification.IsRead = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteNotificationAsync(int id, string userId)
        {
            var notification = await _context.Notifications
                    .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

            if (notification == null) return false;

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
            return true;

        }

        public async Task<int> DeleteAllNotificationsAsync(string userId)
        {
            var notifications = _context.Notifications.Where(n => n.UserId == userId);

            _context.Notifications.RemoveRange(notifications);
            return await _context.SaveChangesAsync();
        }
    }


}
