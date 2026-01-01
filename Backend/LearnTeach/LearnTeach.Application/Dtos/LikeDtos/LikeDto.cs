using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.LikeDtos
{
    public class LikeDto
    {
        public int LikeId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }   
        public int PostId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
