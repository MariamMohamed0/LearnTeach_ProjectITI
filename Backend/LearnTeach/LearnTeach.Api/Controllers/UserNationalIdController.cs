using LearnTeach.Application.Dtos.NationalIdDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static System.Net.WebRequestMethods;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserNationalIdController : ControllerBase
    {
        private readonly IUserNationalIdService _nationalIdService;
        private readonly IHttpContextAccessor _http;
        private readonly IRepository<Usersprofile> _userRepo;

        public UserNationalIdController(IUserNationalIdService nationalIdService, IHttpContextAccessor http, IRepository<Usersprofile> userRepo)
        {
            _nationalIdService = nationalIdService;
            _http = http;
            _userRepo = userRepo;
        }



        [HttpPost]
        [Authorize(Roles = "Student,Teacher")]
        public async Task<IActionResult> Create([FromForm] CreateUserNationalIdDto dto)
        {
            int userId = GetCurrentUserId();
            var result = await _nationalIdService.CreateAsync(userId, dto);
            return Ok(result);
        }

        [HttpPut]
        [Authorize(Roles = "Student,Teacher")]
        public async Task<IActionResult> Update([FromForm] UpdateUserNationalIdDto dto)
        {
            int userId = GetCurrentUserId();
            var result = await _nationalIdService.UpdateByUserAsync(userId, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("me")]
        [Authorize(Roles = "Student,Teacher")]
        public async Task<IActionResult> GetMyNationalId()
        {
            int userId = GetCurrentUserId();
            var result = await _nationalIdService.GetByUserIdAsync(userId);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("status")]
        [Authorize(Roles = "Student,Teacher")]
        public async Task<IActionResult> GetMyVerificationStatus()
        {
            int userId = GetCurrentUserId();
            var result = await _nationalIdService.GetVerificationStatusAsync(userId);
            return Ok(result);
        }


        [HttpGet("status/{userId}")]
        [Authorize(Roles = "Student,Teacher")]
        public async Task<IActionResult> GetUserVerificationStatus(int userId)
        {
            var result = await _nationalIdService.GetVerificationStatusAsync(userId);
            return Ok(result);
        }



        [HttpGet("admin/pending")]

        public async Task<IActionResult> GetPending()
        {
            var result = await _nationalIdService.GetPendingVerificationsAsync();
            return Ok(result);
        }

        [HttpGet("admin/{id}")]

        public async Task<IActionResult> GetById(int id)
        {
            var result = await _nationalIdService.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPut("admin/verify/{id}")]
        public async Task<IActionResult> Verify(int id)
        {
            var success = await _nationalIdService.VerifyNationalIdAsync(id);
            if (!success) return NotFound();
            return Ok(new { Message = "National ID approved successfully." });
        }

        [HttpPut("admin/reject/{id}")]
        public async Task<IActionResult> Reject(int id, [FromBody] RejectNationalIdDto dto)
        {
            var success = await _nationalIdService.RejectNationalIdAsync(id, dto.RejectionReason);
            if (!success) return NotFound();
            return Ok(new { Message = "National ID rejected successfully." });
        }

        [HttpDelete("admin/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _nationalIdService.DeleteAsync(id);
            if (!success) return NotFound();
            return Ok(new { Message = "National ID deleted successfully." });
        }



        private int GetCurrentUserId()
        {
            var authId = _http.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(authId))
                throw new UnauthorizedAccessException("User not logged in.");

            var user = _userRepo.Query().FirstOrDefault(u => u.Authuserid == authId);
            if (user == null) throw new UnauthorizedAccessException("User profile not found.");

            return user.UserId;
        }
    }
}