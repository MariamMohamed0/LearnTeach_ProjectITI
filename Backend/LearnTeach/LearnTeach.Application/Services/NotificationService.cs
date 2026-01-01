using LearnTeach.Application.Dtos.NotificationDtos;
using LearnTeach.Application.Hubs;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using LearnTeach.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using static System.Net.WebRequestMethods;
namespace LearnTeach.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IRepository<Notification> _notificationRepo;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IEmailService _emailService;
        private readonly IRepository<Usersprofile> _userRepo;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHttpContextAccessor _http;

        public NotificationService(
            IRepository<Notification> notificationRepo,
            IHubContext<NotificationHub> hubContext,
            IEmailService emailService,
            IRepository<Usersprofile> userRepo,
            UserManager<ApplicationUser> userManager,
            IHttpContextAccessor http)
        {
            _notificationRepo = notificationRepo;
            _hubContext = hubContext;
            _emailService = emailService;
            _userRepo = userRepo;
            _userManager = userManager;
            _http = http;
        }



        public async Task<NotificationDto> NotifyAsync(
         int userId,
         string title,
         string details,
         string entityType = null,
         int? entityId = null,
         string redirectUrl = null,
         int? senderId = null)
        {
            var notification = new Notification
            {
                UserId = userId,
                SenderId = senderId,
                Title = title,
                Details = details,
                EntityType = entityType,
                EntityId = entityId,
                RedirectUrl = redirectUrl,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            await _notificationRepo.AddAsync(notification);
            await _notificationRepo.SaveChangesAsync();
            var notificationDto = new NotificationDto
            {
                NotificationId = notification.NotificationId,
                Title = title,
                Details = details,
                EntityType = entityType,
                EntityId = entityId,
                RedirectUrl = redirectUrl,
                SenderId = senderId,
                CreatedAt = notification.CreatedAt,

                IsRead = notification.IsRead
            };

            await _hubContext.Clients.User(userId.ToString())
                .SendAsync("ReceiveNotification", notificationDto);

            var userProfile = await _userRepo.GetByIdAsync(userId);
            if (userProfile != null && !string.IsNullOrEmpty(userProfile.Authuserid))
            {
                var appUser = await _userManager.FindByIdAsync(userProfile.Authuserid);
                if (appUser != null && !string.IsNullOrEmpty(appUser.Email))
                {
                    await _emailService.SendEmailAsync(appUser.Email, title, details);
                }
            }

            return notificationDto;
        }



        public async Task<IEnumerable<NotificationDto>> GetNotificationsForUserAsync()
        {
            int userId = CurrentUserId();
            var list = await _notificationRepo.Query()
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return list.Select(n => new NotificationDto
            {
                NotificationId = n.NotificationId,
                Title = n.Title,
                Details = n.Details,
                CreatedAt = n.CreatedAt.HasValue
                ? TimeZoneInfo.ConvertTimeFromUtc(n.CreatedAt.Value, _egyptTimeZone)
                : (DateTime?)null,
                IsRead = n.IsRead,
                EntityType = n.EntityType,
                EntityId = n.EntityId,
                RedirectUrl = n.RedirectUrl,
                SenderId = n.SenderId
            });
        }

        public async Task MarkAsReadAsync(int notificationId)
        {
            var notification = await _notificationRepo.GetByIdAsync(notificationId);
            if (notification != null)
            {
                notification.IsRead = true;
                notification.ReadAt = DateTime.UtcNow;
                _notificationRepo.Update(notification);
                await _notificationRepo.SaveChangesAsync();
            }
        }

        public async Task MarkAllAsReadAsync(int userId)
        {
            var list = await _notificationRepo.Query()
                .Where(n => n.UserId == userId && (n.IsRead == null || n.IsRead == false))
                .ToListAsync();

            foreach (var n in list)
            {
                n.IsRead = true;
                n.ReadAt = DateTime.UtcNow;
                _notificationRepo.Update(n);
            }

            await _notificationRepo.SaveChangesAsync();
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

        private readonly TimeZoneInfo _egyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");

    }
}