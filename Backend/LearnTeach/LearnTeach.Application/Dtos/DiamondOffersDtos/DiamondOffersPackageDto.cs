using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.DiamondOffersDtos
{
    public class DiamondOffersPackageDto
    {
        public int DiamondPackageId { get; set; }
        public string Title { get; set; }
        public int DiamondAmount { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; }
    }
}
