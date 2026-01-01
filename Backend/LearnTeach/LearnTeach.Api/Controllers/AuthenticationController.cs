using LearnTeach.Application.Dtos.AuthDtos;
using LearnTeach.Application.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        #region Nada
        //private  readonly IAuthenticationService authServices;
        //public AuthenticationController(IAuthenticationService _authServices)
        //{
        //    authServices=_authServices;
        //}
        //[HttpPost("Register")]

        //public async Task<IActionResult> CreateUser(RegisterUserDTO  user)
        //{
        //    var _user = await authServices.SignIn(user);
        //    return _user.Success ? Ok(_user) : BadRequest();
        //}
        //[HttpPost("Login")]
        //public async Task<IActionResult> Login(LoginUserDTO  user)
        //{
        //    var _user = await authServices.Login(user);
        //    return _user.Success ? Ok(_user) : BadRequest();
        //}
        //[HttpPost("RefreshToken")]
        //public async Task<IActionResult> ReviveToken([FromBody] string request)
        //{
        //    var _token = await authServices.RefreshToken(request);
        //    return _token.Success ? Ok(_token) : BadRequest(_token.message);
        //}
        #endregion

        #region Maysoon
        private readonly IAuthenticationService _authService;

        public AuthenticationController(IAuthenticationService authService)
        {
            _authService = authService;
        }

        [HttpPost("RegisterAdmin")]
        public async Task<IActionResult> RegisterAdmin(RegisterUserDTO dto)
        {
            var result = await _authService.RegisterAdmin(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPost("RegisterUser")]
        public async Task<IActionResult> RegisterUser(RegisterUserDTO dto)
        {
            var result = await _authService.RegisterUser(dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginUserDTO dto)
        {
            var result = await _authService.Login(dto);
            return result.Success ? Ok(result) : Unauthorized(result);
        }

        [HttpPost("Login2FA")]
        public async Task<IActionResult> Login2FA(string email, string otp)
        {
            var result = await _authService.Login2FA(email, otp);
            return result.Success ? Ok(result) : Unauthorized(result);
        }

        [HttpGet("GenerateOTP/{email}")]
        public async Task<IActionResult> GenerateOTP(string email)
        {
            var code = await _authService.GenerateOTP(email);
            return Ok(new { OTP = code });
        }



        [HttpPost("ForgetPassword")]
        public async Task<IActionResult> ForgetPassword([FromBody] ForgetPasswordDTO dto)
        {
            var result = await _authService.ForgetPassword(dto);
            return result ? Ok("Verification code sent") : BadRequest("User not found");
        }

        [HttpPost("VerifyCode")]
        public IActionResult VerifyCode([FromBody] VerifyCodeDTO dto)
        {
            var result = _authService.VerifyCode(dto).Result;
            return result ? Ok("Code verified") : BadRequest("Invalid or expired code");
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCodeDTO dto)
        {
            var result = await _authService.ResetPassword(dto);
            return result ? Ok("Password reset successfully") : BadRequest("Invalid request");
        }


        [HttpGet("Profile")]
        [Authorize]  
        public async Task<IActionResult> GetProfile()
        {
            var profile = await _authService.GetProfile(User);
            if (profile == null)
                return NotFound("Profile not found");

            return Ok(profile);
        }

        [HttpPost("Google")]
        public async Task<IActionResult> GoogleLogin([FromBody] ExternalAuthDTO model)
        {
            var result = await _authService.GoogleLogin(model);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpPost("Facebook")]
        public async Task<IActionResult> FacebookLogin([FromBody] ExternalAuthDTO model)
        {
            var result = await _authService.FacebookLogin(model);
            return result.Success ? Ok(result) : BadRequest(result);
        }


        [HttpPost("GenerateRegistrationOTP/{email}")]
        public async Task<IActionResult> GenerateRegistrationOTP(string email)
        {
            var code = await _authService.GenerateRegistrationOTP(email);
            return Ok(new { OTP = code });
        }


      

        #endregion



    }

}

