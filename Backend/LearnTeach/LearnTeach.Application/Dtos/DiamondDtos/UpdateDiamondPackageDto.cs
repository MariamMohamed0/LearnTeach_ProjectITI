using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.DiamondDtos
{
    public class UpdateDiamondPackageDto
    {
        public string Title { get; set; }
        public int DiamondAmount { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; } = "EGP";
    }
}
