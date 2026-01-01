using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.FeedbackDtos
{
    public class UserFeedbackDto
    {

        public int Feedbackid { get; set; }

        public int Feedbackrange { get; set; }
        public string? Feedbackdetails { get; set; }
        public DateTime SubmittedAt { get; set; }

    }
}
