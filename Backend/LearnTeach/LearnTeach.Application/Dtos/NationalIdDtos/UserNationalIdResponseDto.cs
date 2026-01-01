using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.NationalIdDtos
{
    public class UserNationalIdResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string FrontPic { get; set; } = string.Empty;
        public string BackPic { get; set; } = string.Empty;
        public string SelfieWithId { get; set; } = string.Empty;
        public bool IsVerified { get; set; }
        public string VerificationStatus { get; set; } = string.Empty;
        public DateTime? SubmittedAt { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public string? RejectionReason { get; set; }
    }
}
