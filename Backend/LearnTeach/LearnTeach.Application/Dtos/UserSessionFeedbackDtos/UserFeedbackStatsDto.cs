using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.UserSessionFeedbackDtos
{
    public class UserFeedbackStatsDto
    {
        public int UserId { get; set; }
        public double AverageRating { get; set; }
        public int TotalFeedbacks { get; set; }
        public int FiveStarRatings { get; set; }
        public int FourStarRatings { get; set; }
        public int ThreeStarRatings { get; set; }
        public int TwoStarRatings { get; set; }
        public int OneStarRatings { get; set; }
    }
}
