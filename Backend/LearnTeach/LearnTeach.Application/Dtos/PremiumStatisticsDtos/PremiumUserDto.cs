using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.PremiumStatisticsDtos
{
    public class PremiumUserDto
    {
        public string Username { get; set; }
        public string SubscriptionPlan { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string Status { get; set; } 
        public decimal TotalPaid { get; set; } 
        public int Diamonds { get; set; }
    }

}
