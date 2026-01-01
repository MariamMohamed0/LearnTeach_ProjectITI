using LearnTeach.Application.Dtos.PostDtos;
using LearnTeach.Application.Dtos.UserProfileDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.PostDtos
{
    public  class PostDto
    {
        public int PostId { get; set; }
        public string Content { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int TotalLiked { get; set; }
        public int TotalComments { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }

        public UserProfileDto User { get; set; }

        public string SkillName { get; set; }

        public List<PostMediaDto> Medias { get; set; }
    }

}
