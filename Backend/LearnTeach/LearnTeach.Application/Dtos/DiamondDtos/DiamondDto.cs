using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.DiamondDtos
{
    public class DiamondDto
    {
        public int UserId { get; set; }
        public int TotalPoints { get; set; }
        public DateTime? LastUpdated { get; set; }
    }

}
