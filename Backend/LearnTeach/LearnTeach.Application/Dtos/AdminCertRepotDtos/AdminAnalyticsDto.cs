using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos
{
    public class AdminAnalyticsDto
    {
        public int TotalUsers { get; set; }
        public int TotalReports { get; set; }
        public int PendingReports { get; set; }
        public int BannedUsers { get; set; }
    }
}
