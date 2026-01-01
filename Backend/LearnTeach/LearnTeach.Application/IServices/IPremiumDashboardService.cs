using LearnTeach.Application.Dtos.PremiumStatisticsDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.IServices
{
    public interface IPremiumDashboardService
    {
        Task<PremiumSummaryDto> GetSummaryAsync();
        Task<PremiumDistributionDto> GetDistributionAsync();
        Task<List<PremiumUserDto>> GetUsersAsync();
    }

}
