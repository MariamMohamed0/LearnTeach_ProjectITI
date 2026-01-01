using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.SessionDtos
{
    public class SessionDto
    {
        public int SessionId { get; set; }

        public string SessionTitle { get; set; } = null!;
        public DateTime ScheduleStartEgypt { get; set; }
        public DateTime ScheduleEndEgypt { get; set; }
        public string Status { get; set; }
        public string? OtherUserFullName { get; set; }
        public string SkillName { get; set; } = null!;

        public string? ZoomMeetingId { get; set; }
        public string? ZoomJoinUrl { get; set; }
    }
}