using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.PaymentDtos
{
    public class PremiumSubscriptionDto
    {
        public int UserId { get; set; }
        public int PackageId { get; set; }
        public string Packagename { get; set; }
        public decimal Packageprice { get; set; }
        public string Packageduration { get; set; }
    }
}
