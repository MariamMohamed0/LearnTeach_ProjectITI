using LearnTeach.Application.Dtos;
using LearnTeach.Application.Dtos.DiamondStatistics;
using Microsoft.AspNetCore.Mvc;

[Route("api/admin/diamonds")]
[ApiController]
public class AdminDiamondController : ControllerBase
{
    private readonly IAdminDiamondService _service;

    public AdminDiamondController(IAdminDiamondService service)
    {
        _service = service;
    }

    [HttpGet("average")]
    public async Task<ActionResult<DiamondAverageDto>> GetAverageDiamonds()
    {
        return Ok(await _service.GetAverageDiamondsAsync());
    }

    [HttpGet("buyers-count")]
    public async Task<ActionResult<DiamondBuyersCountDto>> GetBuyersCount()
    {
        return Ok(await _service.GetBuyersCountAsync());
    }

    [HttpGet("total-usd")]
    public async Task<ActionResult<TotalUsdDto>> GetTotalUsd()
    {
        return Ok(await _service.GetTotalUsdAsync());
    }

    [HttpGet("users-details")]
    public async Task<ActionResult<List<UserDiamondDetailDto>>> GetAllUsersDetails()
    {
        return Ok(await _service.GetAllUsersDiamondDetailsAsync());
    }
}
