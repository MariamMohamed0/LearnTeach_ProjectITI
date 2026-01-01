using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.UserSessionFeedbackDtos
{
    public class RatingBreakdownDto
    {
        public string Role { get; set; } = string.Empty;
        public int FiveStars { get; set; }
        public int FourStars { get; set; }
        public int ThreeStars { get; set; }
        public int TwoStars { get; set; }
        public int OneStar { get; set; }
        public int Total => FiveStars + FourStars + ThreeStars + TwoStars + OneStar;
    }
}
