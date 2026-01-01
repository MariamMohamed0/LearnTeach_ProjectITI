using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Domain.Models
{
    public class UserRatingForBadge
    {
        public int UserId { get; set; }
        public int? BadgeId { get; set; }
        public string? BadgeName { get; set; }
        public double AverageRating { get; set; }
    }

}
