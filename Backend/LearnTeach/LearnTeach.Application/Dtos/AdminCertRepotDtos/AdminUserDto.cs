using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos
{
    public class AdminUserDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string? ProfilePic { get; set; }
        public string PendingReports { get; set; }


    }
}
