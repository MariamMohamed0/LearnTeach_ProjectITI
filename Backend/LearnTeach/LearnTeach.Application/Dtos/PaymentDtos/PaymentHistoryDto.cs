using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.PaymentDtos
{
    public class PaymentHistoryDto
    {
        public int PayId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string Status { get; set; }
        public string Token { get; set; }
        public DateOnly? TransactionDate { get; set; }
        public string GetwayTransactionId { get; set; }
        public string PaymentUrl { get; set; }

    }
}

