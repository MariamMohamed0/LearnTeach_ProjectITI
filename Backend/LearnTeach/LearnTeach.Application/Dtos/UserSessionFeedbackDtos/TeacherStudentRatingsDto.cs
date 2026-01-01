using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.UserSessionFeedbackDtos
{
    public class TeacherStudentRatingsDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public double AsTeacherRating { get; set; }
        public int AsTeacherTotalFeedbacks { get; set; }
        public double AsStudentRating { get; set; }
        public int AsStudentTotalFeedbacks { get; set; }
    }
}
