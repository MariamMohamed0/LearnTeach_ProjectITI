using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.NotificationDtos
{
    public class NotificationDto
    {
        public int NotificationId { get; set; }
        public string Title { get; set; }
        public string Details { get; set; }
        public DateTime? CreatedAt { get; set; }
        public bool? IsRead { get; set; }
        public int? EntityId { get; set; }
        public string EntityType { get; set; }
        public string RedirectUrl { get; set; }
        public int? SenderId { get; set; }
    }


}
