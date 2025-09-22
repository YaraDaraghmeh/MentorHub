using MentorHup.APPLICATION.DTOs.DTOs;
using MentorHup.APPLICATION.Service.Conversation;
using MentorHup.APPLICATION.Service.Message;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/messages")]
[Authorize(Roles = "Mentor,Mentee,Admin")]
public class MessagesController(IConversationService _conversationService, IMessageService _messageService) : ControllerBase
{


    [HttpGet("{otherUserId}")]
    [ProducesResponseType(typeof(IEnumerable<MessageDto>), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetConversation(string otherUserId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
             ?? User.FindFirst("sub")?.Value!;
        var messages = await _messageService.GetConversationAsync(userId, otherUserId);
        return Ok(messages);
    }

    [HttpPost]
    [ProducesResponseType(401)]
    [ProducesResponseType(typeof(MessageDto), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> SendMessage([FromBody] CreateMessageDto dto)
    {
        var senderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(senderId))
            return Unauthorized("Invalid Token: senderId missing");

        var message = await _messageService.SendMessageAsync(senderId, dto);

        return Ok(message);
    }

    [HttpGet("conversations")]
    public async Task<IActionResult> GetConversations([FromQuery] string? searchTerm = null)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
            return Unauthorized();

        var conversations = await _conversationService.GetConversationsListAsync(userId, searchTerm);

        return Ok(conversations);
    }
}