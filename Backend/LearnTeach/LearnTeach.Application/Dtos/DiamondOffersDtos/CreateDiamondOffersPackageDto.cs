using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.DiamondOffersDtos
{
    public class CreateDiamondOffersPackageDto
    {
        [Required]
        public string Title { get; set; }
        [Range(1, int.MaxValue)]
        public int DiamondAmount { get; set; }
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }
        public string Currency { get; set; } = "USD";
    }
}
