using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.Badge_Dtos
{
    public class BadgeDto
    {
        public string Name { get; set; } = null!;
        public int MinRating { get; set; }
        public int MaxRating { get; set; }

        public string IconUrl { get; set; } = null!;
    }

}
