using LearnTeach.Application.Dtos.Badge_Dtos;
using LearnTeach.Application.IServices;
using LearnTeach.Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BadgeController : ControllerBase
    {
        private readonly IBadgeService _service;

        public BadgeController(IBadgeService service)
        {
            _service = service;
        }

        [HttpPost("Add")]
        public async Task<IActionResult> AddBadge([FromBody] BadgeDto dto)
            => Ok(await _service.AddBadge(dto));

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> UpdateBadge(int id, [FromBody] BadgeDto dto)
            => Ok(await _service.UpdateBadge(id, dto));

        [HttpGet("Assign/Update/{userId}")]
        public async Task<IActionResult> AssignBadge(int userId)
            => Ok(await _service.AssignBadgeToUser(userId));

        [HttpGet("user/{userId}/badge")]
        public async Task<IActionResult> GetUserBadge(int userId)
        {
            var result = await _service.GetUserRatingAndBadge(userId);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

    }
}
