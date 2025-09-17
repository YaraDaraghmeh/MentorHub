using MentorHup.APPLICATION.DTOs.Notification;

namespace MentorHup.APPLICATION.Service.Notification
{
    public interface INotificationService
    {
        Task<NotificationDto> CreateNotificationAsync(NotificationCreateDto dto);
        Task<List<NotificationDto>> GetUserNotificationsAsync(string userId);
        Task<int> GetUnreadCountAsync(string userId);
        Task<bool> MarkAsReadAsync(int id, string userId);
        Task<bool> DeleteNotificationAsync(int id, string userId);

        Task<int> DeleteAllNotificationsAsync(string userId);

    }


}
