using Google;
using LearnTeach.Domain.Models;
using LearnTeach.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace LearnTeach.Api.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly LEANRANDTEACHContext _context;

        public ChatHub(LEANRANDTEACHContext context)
        {
            _context = context;
        }

        public async Task SendMessage(string receiverId, string message)
        {
            var senderId = Context.User?.FindFirst("ProfileId")?.Value;
            var ids = new List<string> { senderId!, receiverId };
            ids.Sort();
            var chatId = $"{ids[0]}_{ids[1]}";

 
            var chatMessage = new ChatMessage
            {
                ChatId = chatId,
                SenderId = senderId!,
                ReceiverId = receiverId,
                Text = message,
                CreatedAt = DateTime.Now
            };
            _context.ChatMessages.Add(chatMessage);
            await _context.SaveChangesAsync();

 
            await Clients.User(receiverId).SendAsync("ReceiveMessage", senderId, message);
     
        }

    }

}
