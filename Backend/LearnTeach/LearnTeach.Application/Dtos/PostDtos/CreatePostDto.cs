using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.PostDtos
{
    public class CreatePostDto
    {

        public string Content { get; set; }

        public int? SkillId { get; set; }

        public string? PostType { get; set; }

        public List<PostMediaDto>? Medias { get; set; }

        public int UserId { get; set; }

        public int categoryId  { get; set; }
    }
}
