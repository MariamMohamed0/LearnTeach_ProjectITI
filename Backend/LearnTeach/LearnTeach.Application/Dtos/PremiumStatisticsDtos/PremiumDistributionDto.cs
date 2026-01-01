using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.PremiumStatisticsDtos
{
    public class PremiumDistributionDto
    {
        public int SilverMembers { get; set; }
        public int GoldMembers { get; set; }
        public int PlatinumMembers { get; set; }
    }
}
