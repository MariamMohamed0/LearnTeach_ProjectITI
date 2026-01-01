using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.UserProfileDtos
{
    public class CreateUserProfileDto
    {
        public string Fname { get; set; }
        public string Lname { get; set; }
        public string ExperienceText { get; set; }
    }
}
