using LearnTeach.Application.Dtos.NotificationDtos;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace LearnTeach.Application.IServices
{
    public interface INotificationService
    {
        Task<NotificationDto> NotifyAsync(
            int userId,
            string title,
            string details,
            string entityType = null,
            int? entityId = null,
            string redirectUrl = null,
            int? senderId = null
        );

        Task<IEnumerable<NotificationDto>> GetNotificationsForUserAsync();

        Task MarkAsReadAsync(int notificationId);

        Task MarkAllAsReadAsync(int userId);
    }

}