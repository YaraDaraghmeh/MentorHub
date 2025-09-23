using MentorHup.APPLICATION.DTOs.DTOs;
using MentorHup.APPLICATION.Service.Message;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

[Authorize]
public class ChatHub : Hub
{
    private readonly IMessageService _messageService;

    public ChatHub(IMessageService messageService)
    {
        _messageService = messageService;
    }

    public async Task SendMessage(string receiverId, string content)
    {
        var senderId = Context.UserIdentifier;

        if (senderId == null) throw new Exception("UserIdentifier is null");


        var dto = new CreateMessageDto { Content = content, ReceiverId = receiverId };

        var message = await _messageService.SendMessageAsync(senderId, dto);

        await Clients.User(receiverId).SendAsync("ReceiveMessage", message);
        await Clients.Caller.SendAsync("ReceiveMessage", message);
    }

    public async Task MarkMessageAsRead(int messageId)
    {
        var message = await _messageService.MarkMessageAsReadAsync(messageId);

        if (message != null)
        {
            // إرسال حدث Real-Time للمرسل ليعرف أن الرسالة تم قراءتها
            await Clients.User(message.SenderId).SendAsync("MessageRead", messageId);
        }
    }

}
