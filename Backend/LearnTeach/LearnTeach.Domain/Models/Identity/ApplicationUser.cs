using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Infrastructure.Data
{
    public class ApplicationUser:IdentityUser
    {
        public string Fullname { get; set; } = string.Empty;
        public string Fname { get; set; }
        public string Lname { get; set; }
        public string? ProfilePic { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
