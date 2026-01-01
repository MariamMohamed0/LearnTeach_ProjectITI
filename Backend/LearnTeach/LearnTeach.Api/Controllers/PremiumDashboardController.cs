using LearnTeach.Application.Dtos.PremiumStatisticsDtos;
using LearnTeach.Application.IServices;
using Microsoft.AspNetCore.Mvc;

namespace LearnTeach.Api.Controllers
{
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class PremiumDashboardController : ControllerBase
    {
        private readonly IPremiumDashboardService _premiumService;

        public PremiumDashboardController(IPremiumDashboardService premiumService)
        {
            _premiumService = premiumService;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var summary = await _premiumService.GetSummaryAsync();
            return Ok(summary);
        }

        [HttpGet("distribution")]
        public async Task<IActionResult> GetDistribution()
        {
            var distribution = await _premiumService.GetDistributionAsync();
            return Ok(distribution);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _premiumService.GetUsersAsync();
            return Ok(users);
        }
    }

}
