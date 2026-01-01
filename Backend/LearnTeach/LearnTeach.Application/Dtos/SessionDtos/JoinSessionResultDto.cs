using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.SessionDtos
{
    public class JoinSessionResultDto
    {
        public string Token { get; set; } = string.Empty;
        public string AcsUserId { get; set; } = string.Empty;
        public DateTimeOffset ExpiresOn { get; set; }
        public string? ZoomMeetingId { get; set; }=string.Empty;
        public string? ZoomJoinUrl { get; set; }=string.Empty;
    }
}
