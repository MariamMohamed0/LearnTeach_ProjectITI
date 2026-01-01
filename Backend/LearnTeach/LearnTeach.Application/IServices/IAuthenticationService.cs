using LearnTeach.Application.Dtos.AuthDtos;
using LearnTeach.Application.Dtos.Rcords;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.IServices
{
    public interface IAuthenticationService
    {

        Task<RegisterRuselt> RegisterAdmin(RegisterUserDTO dto);
        Task<RegisterRuselt> RegisterUser(RegisterUserDTO dto);
        Task<LoginRuselt> Login(LoginUserDTO dto);
        Task<LoginRuselt> Login2FA(string email, string otp);
        Task<string> GenerateOTP(string email);


        Task<bool> ForgetPassword(ForgetPasswordDTO dto);
        Task<bool> VerifyCode(VerifyCodeDTO dto);
        Task<bool> ResetPassword(ResetPasswordCodeDTO dto);

        Task Logout(string userId);

        Task<UserProfileDTO?> GetProfile(ClaimsPrincipal userClaims);
        Task<LoginRuselt> GoogleLogin(ExternalAuthDTO dto);
        Task<LoginRuselt> FacebookLogin(ExternalAuthDTO dto);

        Task<string> GenerateRegistrationOTP(string email);

        Task<bool> VerifyRegistrationOtp(string email, string code);



    }

}
