using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.UserSessionFeedbackDtos
{
    public class UserSessionFeedbackResponseDto
    {
        public int FeedbackId { get; set; }
        public int RatingValue { get; set; }
        public string? Comment { get; set; }
        public int RatedByUserId { get; set; }
        public string RatedByUserName { get; set; } = string.Empty;
        public int RatedToUserId { get; set; }
        public string RatedToUserName { get; set; } = string.Empty;
        public int SessionId { get; set; }
        public string SessionInfo { get; set; } = string.Empty;
        public DateTime? CreatedAt { get; set; }
    }
}
