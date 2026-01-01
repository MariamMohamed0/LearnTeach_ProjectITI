using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.UserProfileDtos
{
    public class UserProfileDto
    {
        public int UserId { get; set; }
        public string Fname { get; set; }
        public string Lname { get; set; }
        public string ExperienceText { get; set; }
        public string ProfilePic { get; set; }
        public string Authuserid { get; set; }
    }
}
