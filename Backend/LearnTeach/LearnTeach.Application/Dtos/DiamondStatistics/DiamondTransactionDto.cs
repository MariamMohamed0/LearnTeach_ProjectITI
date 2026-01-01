using LearnTeach.Application.Dtos.DiamondDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.DiamondStatistics
{
    public class DiamondTransactionDto
    {
        public string Reason { get; set; }
        public int PointsChanged { get; set; }
        public DateTime Date { get; set; }
        public decimal? PriceUsd { get; set; }
    }
}
