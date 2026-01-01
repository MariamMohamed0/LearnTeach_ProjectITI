using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.NationalIdDtos
{
    public class UserNationalIdVerificationDto
    {
        public int UserId { get; set; }
        public bool IsVerified { get; set; }
        public string VerificationStatus { get; set; } = string.Empty;
        public DateTime? SubmittedAt { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public string? RejectionReason { get; set; }
    }
}
