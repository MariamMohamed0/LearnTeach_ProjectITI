using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.PaymentDtos
{
    public class PaymentConfirmDto
    {
        public string GetwayTransactionId { get; set; }
        public string Token { get; set; }
        public string Status { get; set; } = "Success"; 
    }
}
