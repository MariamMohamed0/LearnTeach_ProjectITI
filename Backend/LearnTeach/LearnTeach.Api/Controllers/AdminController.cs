using LearnTeach.Application.Dtos;
using LearnTeach.Application.IServices;
using LearnTeach.Infrastructure.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/admin/reports")]
[ApiController]
public class AdminReportController : ControllerBase
{
    private readonly IReportService _service;
    private readonly IAdminReportService _adminReportService;
    private readonly IReportRepository _reportRepository;

    public AdminReportController(IReportService service , IAdminReportService adminReportService , IReportRepository reportRepository)
    {
        _service = service;
        _adminReportService = adminReportService;
        _reportRepository =reportRepository;
    }
    [HttpGet]
    public async Task<IActionResult> GetAllReports()
    {
        var reports = await _adminReportService.GetAllReportsAsync();
        return Ok(reports);
    }

    
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.Status))
            return BadRequest("Status is required.");

        var newStatus = dto.Status.Trim().ToLower();
        var allowedStatuses = new[] { "pending", "approved", "rejected" };

        if (!allowedStatuses.Contains(newStatus))
            return BadRequest("Invalid status value.");

        var updated = await _adminReportService.UpdateStatusAsync(id, newStatus);
        if (!updated)
            return NotFound("Report not found.");

        return Ok(new { message = $"Status updated to {newStatus}" });
    }

    [HttpPost("user/{userId}/suspend-restore")]
    public async Task<IActionResult> SuspendOrRestoreUser(int userId)
    {
        var success = await _adminReportService.SuspendOrRestoreUserAsync(userId);
        if (!success)
            return NotFound("User not found.");

        return Ok(new { message = "User status updated successfully." });
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingReports()
    {
        var pending = await _adminReportService.GetPendingReportsAsync();
        return Ok(pending);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReport(int id)
    {
        var deleted = await _adminReportService.DeleteReportAsync(id);
        if (!deleted)
            return NotFound("Report not found.");
        return NoContent();
    }
    public class UpdateStatusDto
    {
        public string Status { get; set; }
    }
}

