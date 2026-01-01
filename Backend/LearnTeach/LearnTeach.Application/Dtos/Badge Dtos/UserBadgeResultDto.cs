using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.Badge_Dtos
{
    public class UserBadgeResultDto
    {
        public int UserId { get; set; }
        public string? BadgeName { get; set; }
        public double AverageRating { get; set; }
    }

}
