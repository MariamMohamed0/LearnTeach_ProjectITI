using LearnTeach.Api.Client;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using static System.Net.WebRequestMethods;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ChatClient _chat;
        private readonly IHttpContextAccessor _http;
        private readonly IRepository<Usersprofile> _userRepo;

        public ChatController(ChatClient chat, IHttpContextAccessor http, IRepository<Usersprofile> userRepo)
        {
            _chat = chat;
            _http = http;
            _userRepo = userRepo;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateChat( string user2)
        {
            int user1= CurrentUserId();
            var chatId = await _chat.CreateChatAsync(user1.ToString(), user2);
            return Ok(new { chatId });
        }

        private int CurrentUserId()
        {
            var authId = _http.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(authId))
                throw new UnauthorizedAccessException("User not logged in.");

            var user = _userRepo.Query().FirstOrDefault(u => u.Authuserid == authId);
            if (user == null) throw new UnauthorizedAccessException("User profile not found.");

            return user.UserId;
        }
    }
}
