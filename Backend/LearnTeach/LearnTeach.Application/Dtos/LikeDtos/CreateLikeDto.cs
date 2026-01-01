using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.LikeDtos
{
    public class CreateLikeDto
    {
        public int UserId { get; set; }
        public int PostId { get; set; }
    }
}
