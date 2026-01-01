using LearnTeach.Application.Dtos;
using LearnTeach.Application.IServices;
using Microsoft.AspNetCore.Mvc;

namespace LearnTeach.Api.Controllers
{
    [Route("api/user/reports")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _service;
        public ReportController(IReportService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> CreateReport([FromBody] CreateReportDto dto)
        {
            var result = await _service.CreateReportAsync(dto);
            return Ok(result);
        }


        [HttpGet]
        public async Task<IActionResult> GetUserReports()
        {
            var reports = await _service.GetUserReportsAsync();
            return Ok(reports);
        }
    }
}