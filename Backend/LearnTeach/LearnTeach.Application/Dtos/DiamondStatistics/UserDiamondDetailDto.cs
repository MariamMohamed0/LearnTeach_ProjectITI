using LearnTeach.Application.Dtos.DiamondDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.DiamondStatistics
{
    public class UserDiamondDetailDto
    {
        public string Username { get; set; }
        public int CurrentDiamonds { get; set; }
        public bool PurchasedBefore { get; set; }
        public int TotalDiamondBought { get; set; }
        public decimal TotalUsd { get; set; }
        public List<DiamondTransactionDto> DiamondTransactions { get; set; }
    }
}
