using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.UserSessionFeedbackDtos
{
    public class UserSessionFeedbackLiteDto
    {
        public string RatedByUserName { get; set; }
        public int RatingValue { get; set; }
        public string Comment { get; set; } = string.Empty;
        public string SessionInfo { get; set; } = string.Empty;
    }
}
