using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.DiamondDtos
{
    public class DiamondTransactionDto
    {
        public int TransactionId { get; set; } 
        public int UserId { get; set; }
        public int PointsChanged { get; set; } 
        public string Reason { get; set; } 
        public DateTime TransactionDate { get; set; }
    }

}
