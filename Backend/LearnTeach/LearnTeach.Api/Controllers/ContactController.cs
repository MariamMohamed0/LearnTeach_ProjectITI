using LearnTeach.Application.Dtos;
using LearnTeach.Application.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public ContactController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage(ContactDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid input");

            
            await _emailService.SendEmailAsync(
                "LearnandTeach2025@gmail.com",
                $"New Contact Message from {dto.Name}",
                $"Email: {dto.Email}\nMessage:\n{dto.Message}"
            );

            return Ok(new { message = "Message sent successfully" });
        }
    }
}
