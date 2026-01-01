using LearnTeach.Application.Dtos.AuthDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Infrastructure.Services.Authentications;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExternalAuthController : ControllerBase
    {
        private readonly IAuthenticationService _auth;

        public ExternalAuthController(IAuthenticationService auth)
        {
            _auth = auth;
        }

        [HttpPost("Google")]
        public async Task<IActionResult> GoogleLogin([FromBody] ExternalAuthDTO model)
        {
            var result = await _auth.GoogleLogin(model);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPost("Facebook")]
        public async Task<IActionResult> FacebookLogin([FromBody] ExternalAuthDTO model)
        {
            var result = await _auth.FacebookLogin(model);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}
