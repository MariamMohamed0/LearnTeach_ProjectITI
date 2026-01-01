using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.CommentDtos
{
    
        public class CommentDto
        {
            public int CommentId { get; set; }
            public string CommentText { get; set; }
            public DateTime CreatedAt { get; set; }

            public int UserId { get; set; }
            public string UserName { get; set; } 
            public int PostId { get; set; }
        }
    }

