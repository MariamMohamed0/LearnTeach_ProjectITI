using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.FeedbackDtos
{
    public class FeedbackDto
    {
        public int UserId { get; set; }
        public int Feedbackrange { get; set; }

        public string? Feedbackdetails { get; set; }
    }
}
