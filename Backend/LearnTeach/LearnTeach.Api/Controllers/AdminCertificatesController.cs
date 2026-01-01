using LearnTeach.Application.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearnTeach.Api.Controllers
{
    [Route("api/admin/certificates")]
    [ApiController]
    public class AdminCertificatesController : ControllerBase
    {
        private readonly ICertificateService _service;

        public AdminCertificatesController(ICertificateService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllCertificates()
        {
            var result = await _service.GetAllCertificatesAsync();
            return Ok(result);
        }

        [HttpDelete("{cerId}")]
        public async Task<IActionResult> DeleteCertificate(int cerId)
        {
            var cert = await _service.GetUserCertificatesAsync();
            if (cert == null || !cert.Any())
                return NotFound(new { message = "Certificate not found" });

            await _service.DeleteCertificateByAdminAsync(cerId);

            return Ok(new { message = "Certificate deleted successfully" });
        }
    }

}