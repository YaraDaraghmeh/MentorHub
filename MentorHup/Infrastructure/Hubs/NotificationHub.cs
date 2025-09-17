namespace MentorHup.Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;

public class NotificationHub : Hub
{
    public async Task SendNotification(string userId, object notification)
    {
        await Clients.User(userId).SendAsync("ReceiveNotification", notification);
    }
}
