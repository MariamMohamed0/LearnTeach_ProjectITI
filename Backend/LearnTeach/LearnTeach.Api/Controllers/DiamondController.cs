using LearnTeach.Application.Dtos.DiamondDtos;
using LearnTeach.Application.IServices;
using Microsoft.AspNetCore.Mvc;

namespace LearnTeach.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiamondController : ControllerBase
    {
        private readonly IDiamondService _diamondService;

        public DiamondController(IDiamondService diamondService)
        {
            _diamondService = diamondService;
        }

        [HttpPost("package/add")]
        public async Task<IActionResult> AddDiamondPackage([FromBody] AddDiamondPackageDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Invalid package data." });

            var result = await _diamondService.AddDiamondPackageAsync(dto);
            return Ok(result);
        }

        [HttpPut("package/update/{packageId}")]
        public async Task<IActionResult> UpdateDiamondPackage(int packageId, [FromBody] UpdateDiamondPackageDto dto)
        {
            var result = await _diamondService.UpdateDiamondPackageAsync(packageId, dto);
            return Ok(result);
        }

        [HttpDelete("package/delete/{packageId}")]
        public async Task<IActionResult> DeleteDiamondPackage(int packageId)
        {
            await _diamondService.DeleteDiamondPackageAsync(packageId);
            return Ok(new { message = "Package deleted successfully." });
        }


        [HttpGet("packages")]
        public async Task<IActionResult> GetAllDiamondPackages()
        {
            var result = await _diamondService.GetAllDiamondPackagesAsync();
            return Ok(result);
        }

        [HttpPost("package/purchase")]
        public async Task<IActionResult> PurchaseDiamondPackage([FromBody] PurchaseDiamondPackageDto dto)
        {
            var result = await _diamondService.PurchaseDiamondPackageAsync(dto);
            return Ok(result);
        }


        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserPoints(int userId)
        {
            var result = await _diamondService.GetUserPointsAsync(userId);
            if (result == null)
                return NotFound(new { message = "User not found or has no diamond record." });

            return Ok(result);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddPoints([FromBody] AddPointsDto dto)
        {
            if (dto.Points <= 0)
                return BadRequest(new { message = "Points must be greater than zero." });

            var result = await _diamondService.AddPointsAsync(dto);
            return Ok(result);
        }

        [HttpPost("deduct")]
        public async Task<IActionResult> DeductPoints([FromBody] DeductPointsDto dto)
        {
            if (dto.Points <= 0)
                return BadRequest(new { message = "Points must be greater than zero." });

            try
            {
                var result = await _diamondService.DeductPointsAsync(dto);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("transactions/{userId}")]
        public async Task<IActionResult> GetAllTransactions(int userId)
        {
            var transactions = await _diamondService.GetAllTransactionsAsync(userId);
            if (transactions == null || transactions.Count == 0)
                return NotFound(new { message = "No diamond transactions found." });

            return Ok(transactions);
        }
    }
}
