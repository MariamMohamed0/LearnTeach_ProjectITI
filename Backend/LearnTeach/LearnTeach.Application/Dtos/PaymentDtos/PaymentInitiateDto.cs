using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.PaymentDtos
{
    public class PaymentInitiateDto
    {
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "EGP"; 
        public bool Mastercard { get; set; } = false;
        public bool Visa { get; set; } = false;
    }
}
