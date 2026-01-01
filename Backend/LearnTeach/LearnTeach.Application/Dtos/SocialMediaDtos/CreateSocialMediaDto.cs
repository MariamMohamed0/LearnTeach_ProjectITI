using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.SocialMediaDtos
{
    public class CreateSocialMediaDto
    {
        public int UserId { get; set; }
        public string FacebookLink { get; set; }
        public string Linkedin { get; set; }
        public string PersonalWebsite { get; set; }
    }
}
