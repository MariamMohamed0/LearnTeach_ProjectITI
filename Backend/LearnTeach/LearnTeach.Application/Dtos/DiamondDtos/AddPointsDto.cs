using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.DiamondDtos
{
    public class AddPointsDto
    {
        public int UserId { get; set; }
        public int Points { get; set; }
        public string Reason { get; set; }
    }

}
