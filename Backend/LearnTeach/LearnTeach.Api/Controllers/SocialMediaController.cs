using LearnTeach.Application.Dtos.SocialMediaDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SocialMediaController : ControllerBase
    {
        private readonly ISocialMediaService _service;

        public SocialMediaController(ISocialMediaService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllSocialMedia()
        {
            try
            {
                var SocialMedia = await _service.GetAllSocialAccountsAsync();
                if (SocialMedia == null || !SocialMedia.Any())
                    return NotFound(new { Message = "No SocialMedia found." });

                return Ok(SocialMedia);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching SocialMedia.", Error = ex.Message });
            }
        }
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var result = await _service.GetSocialAccountsByUserAsync(userId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSocialMediaDto dto)
        {
            var account = await _service.CreateSocialAccountAsync(dto);
            return Ok(account);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateSocialMediaDto dto)
        {
            var success = await _service.UpdateSocialAccountAsync(id, dto);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteSocialAccountAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}