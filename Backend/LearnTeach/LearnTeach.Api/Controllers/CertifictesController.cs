using LearnTeach.Application.Dtos;
using LearnTeach.Application.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearnTeach.Api.Controllers
{
    [Route("api/certifictes")]
    [ApiController]
    public class CertifictesController : ControllerBase
    {
        private readonly ICertificateService service;
        public CertifictesController(ICertificateService _service)
        {
            service = _service;
        }
        [HttpGet]
        public async Task<IActionResult> GetUserCertificates()
        {
            var result = await service.GetUserCertificatesAsync();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCertificate([FromForm] CertificateUpdateDto dto)
        {
            var result = await service.CreateCertificateAsync(dto);
            return Ok(result);
        }
        [HttpPut("{cerId}")]
        public async Task<IActionResult> UpdateCertificate(int cerId, [FromForm] CertificateUpdateDto dto)
        {
            var result = await service.UpdateCertificateAsync(cerId, dto);
            return Ok(result);
        }

        [HttpDelete("{cerId}")]
        public async Task<IActionResult> DeleteCertificate(int cerId)
        {
            await service.DeleteCertificateAsync(cerId);
            return NoContent();
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserCertificates(int userId)
        {
            var result = await service.GetUserCertificatesAsync(userId);
            return Ok(result);
        }

        [HttpPost("user/{userId}")]
        public async Task<IActionResult> CreateCertificate(int userId, [FromForm] CertificateUpdateDto dto)
        {
            var result = await service.CreateCertificateAsync(userId, dto);
            return Ok(result);
        }
        [HttpPut("{cerId}/user/{userId}")]
        public async Task<IActionResult> UpdateCertificate(int cerId, int userId, [FromForm] CertificateUpdateDto dto)
        {
            var result = await service.UpdateCertificateAsync(cerId, userId, dto);
            return Ok(result);
        }
        [HttpDelete("{cerId}/user/{userId}")]
        public async Task<IActionResult> DeleteCertificate(int cerId, int userId)
        {
            await service.DeleteCertificateAsync(cerId, userId);
            return NoContent();
        }
    }
}