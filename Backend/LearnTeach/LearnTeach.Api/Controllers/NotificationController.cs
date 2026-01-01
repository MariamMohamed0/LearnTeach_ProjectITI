using LearnTeach.Application.Dtos.NotificationDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using static System.Net.WebRequestMethods;
namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly IHttpContextAccessor _http;
        private readonly IRepository<Usersprofile> _userRepo;

        public NotificationsController(INotificationService notificationService, IHttpContextAccessor http, IRepository<Usersprofile> userRepo)
        {
            _notificationService = notificationService;
            _http = http;
            _userRepo = userRepo;
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUserNotifications()
        {
            var list = await _notificationService.GetNotificationsForUserAsync();
            return Ok(list);
        }

        [HttpPut("mark-seen/{notificationId}")]
        public async Task<IActionResult> MarkAsRead(int notificationId)
        {
            await _notificationService.MarkAsReadAsync(notificationId);
            return NoContent();
        }

        [HttpPut("mark-all-seen")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            int userId = CurrentUserId();
            await _notificationService.MarkAllAsReadAsync(userId);
            return NoContent();
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