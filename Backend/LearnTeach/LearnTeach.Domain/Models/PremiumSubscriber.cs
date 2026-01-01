using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Domain.Models
{
    public partial class PremiumSubscriber
    {
        public int UserId { get; set; }
        public int PackageId { get; set; }

        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public DateOnly SubscribedAt { get; set; } // اختياري

        // Navigation
        public Usersprofile Users { get; set; }
        public Package Package { get; set; }

    }
}
