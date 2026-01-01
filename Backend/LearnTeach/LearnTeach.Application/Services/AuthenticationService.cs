using AutoMapper;
using Google.Apis.Auth;
using LearnTeach.Application.Constants;
using LearnTeach.Application.Dtos.AuthDtos;
using LearnTeach.Application.Dtos.MessageDtos;
using LearnTeach.Application.Dtos.Rcords;
using LearnTeach.Application.Dtos.UserSessionFeedbackDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Application.Services;
using LearnTeach.Domain.AuthModel;
using LearnTeach.Domain.Interfaceses.Authentication;
using LearnTeach.Domain.Models;
using LearnTeach.Infrastructure.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Infrastructure.Services.Authentications
{
 
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUserManagement _userManagement;
        private readonly IRoleManagement _roleManagement;
        private readonly ITokenManagement _tokenManagement;
        private readonly IMapper _mapper;
        private readonly IRepository<Usersprofile> _userProfileRepo;
        private readonly IEmailService _emailService;
        private readonly IDiamondService _diamondService;
        private readonly IRepository<Report> _reportRepo;

        private static readonly Dictionary<string, PasswordResetCode> _passwordResetStore = new();

        public AuthenticationService(
            IUserManagement userManagement,
            IRoleManagement roleManagement,
            ITokenManagement tokenManagement,
            IMapper mapper,
            IRepository<Usersprofile> userProfileRepo,
            IEmailService emailService,
            IDiamondService diamondService,
            IRepository<Report> reportRepo)
        {
            _userManagement = userManagement;
            _roleManagement = roleManagement;
            _tokenManagement = tokenManagement;
            _mapper = mapper;
            _userProfileRepo = userProfileRepo;
            _emailService = emailService;
            _diamondService = diamondService;
            _reportRepo = reportRepo;
        }


        public async Task<RegisterRuselt> RegisterAdmin(RegisterUserDTO dto)
        {
            if (!string.IsNullOrEmpty(dto.OTP))
            {
                bool otpValid = await VerifyRegistrationOtp(dto.Email, dto.OTP);
                if (!otpValid)
                    return new RegisterRuselt(false, "Invalid or expired registration OTP");
            }

            var user = _mapper.Map<ApplicationUser>(dto);
            user.UserName = dto.Email;
            user.Fullname = dto.FName + " " + dto.LName;
            user.EmailConfirmed = true;

            bool created = await _userManagement.CreateUser(user, dto.Password);
            if (!created) return new RegisterRuselt(false, "User already exists");

            await _roleManagement.AddUserToRole(user, "Admin");

            await _emailService.SendEmailAsync(user.Email, "Welcome Admin", $"Hello {dto.FName}, Admin account created.");

            var claims = await _userManagement.GetUserClaims(user.Email);
            string accessToken = _tokenManagement.GenerateToken(claims);
            string refreshToken = _tokenManagement.GetRefreshToken();
            await _tokenManagement.AddrefreshToken(user.Id, refreshToken);

            return new RegisterRuselt(true, "Admin registered successfully", accessToken, refreshToken);
        }


        public async Task<RegisterRuselt> RegisterUser(RegisterUserDTO dto)
        {
            if (!string.IsNullOrEmpty(dto.OTP))
            {
                bool otpValid = await VerifyRegistrationOtp(dto.Email, dto.OTP);
                if (!otpValid)
                    return new RegisterRuselt(false, "Invalid or expired registration OTP");
            }

            var user = _mapper.Map<ApplicationUser>(dto);
            user.UserName = dto.Email;
            user.Fullname = dto.FName + " " + dto.LName;
            user.EmailConfirmed = true;

            bool created = await _userManagement.CreateUser(user, dto.Password);
            if (!created) return new RegisterRuselt(false, "User already exists");

          
            await _roleManagement.AddUserToRole(user, "Student");
            await _roleManagement.AddUserToRole(user, "Teacher");

            var profile = new Usersprofile
            {
                Fname = dto.FName,
                Lname = dto.LName,
                Authuserid = user.Id,
                CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow),
                ProfilePic = "",
                ExperienceText = ""
            };

            await _userProfileRepo.AddAsync(profile);
            await _userProfileRepo.SaveChangesAsync(); 

            await _diamondService.CreateDiamondRecordForUser(profile.UserId);

            await _emailService.SendEmailAsync(user.Email, "Welcome User 🌟", $"Hello {dto.FName}, User account created.");

            var claims = await _userManagement.GetUserClaims(user.Email);
            string accessToken = _tokenManagement.GenerateToken(claims);
            string refreshToken = _tokenManagement.GetRefreshToken();
            await _tokenManagement.AddrefreshToken(user.Id, refreshToken);

            return new RegisterRuselt(true, "Student registered successfully", accessToken, refreshToken);
        }

        //public async Task<LoginRuselt> Login(LoginUserDTO dto)
        //{
        //    var user = await _userManagement.GEtUserByEmail(dto.Email);
        //    if (user == null) return new LoginRuselt(false, "Invalid email or password");

        //    bool valid = await _userManagement.LoginUser(user, dto.Password);
        //    if (!valid) return new LoginRuselt(false, "Invalid email or password");

        //    // Get Profile linked to AuthUserId
        //    var profile = await _userProfileRepo.Query()
        //        .FirstOrDefaultAsync(x => x.Authuserid == user.Id);

        //    // Build claims manually
        //    var claims = new List<Claim>
        //    {
        //        new Claim(ClaimTypes.NameIdentifier, user.Id),
        //        new Claim(ClaimTypes.Email, user.Email),
        //        new Claim(ClaimTypes.Name, user.Fullname),
        //        new Claim("ProfileId", profile?.UserId.ToString() ?? "")
        //    };

        //    var roles = await _roleManagement.GetUserRoles(user);
        //    foreach (var role in roles)
        //    {
        //        claims.Add(new Claim(ClaimTypes.Role, role));
        //    }

        //    string accessToken = _tokenManagement.GenerateToken(claims);
        //    string refreshToken = _tokenManagement.GetRefreshToken();
        //    await _tokenManagement.AddrefreshToken(user.Id, refreshToken);

        //    return new LoginRuselt(true, "Login successful", accessToken, refreshToken);
        //}

        public async Task<LoginRuselt> Login(LoginUserDTO dto)
        {
            // 1. Check user exists
            var user = await _userManagement.GEtUserByEmail(dto.Email);
            if (user == null)
                return new LoginRuselt(false, "Invalid email or password");

            // 2. Validate password
            bool valid = await _userManagement.LoginUser(user, dto.Password);
            if (!valid)
                return new LoginRuselt(false, "Invalid email or password");

            // 3. Get user profile if exists (Admin may not have profile)
            var profile = await _userProfileRepo.Query()
                .FirstOrDefaultAsync(x => x.Authuserid == user.Id);

            // 4. Check status if profile exists
            if (profile != null)
            {
                // userProfile.Status: "active" OR "suspended"
                if (profile.Status?.ToLower() == "suspended")
                {
                    return new LoginRuselt(false,
                        "This account is suspended. Please contact support.");
                }
            }

            // 5. Build claims
            var claims = new List<Claim>
            {
              new Claim(ClaimTypes.NameIdentifier, user.Id),
              new Claim(ClaimTypes.Email, user.Email),
              new Claim(ClaimTypes.Name, user.Fullname),
              new Claim("ProfileId", profile?.UserId.ToString() ?? "")
            };

            // 6. Add roles
            var roles = await _roleManagement.GetUserRoles(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            // 7. Generate tokens
            string accessToken = _tokenManagement.GenerateToken(claims);
            string refreshToken = _tokenManagement.GetRefreshToken();
            await _tokenManagement.AddrefreshToken(user.Id, refreshToken);

            // 8. Return success
            return new LoginRuselt(true, "Login successful", accessToken, refreshToken);
        }



        public async Task<string> GenerateOTP(string email)
        {
            var user = await _userManagement.GEtUserByEmail(email);
            if (user == null) throw new Exception("User not found");

            string code = await _tokenManagement.GenerateOtp(user.Id);

            await _emailService.SendEmailAsync(user.Email, "Your OTP Code", $"Your OTP is: {code}");
            return code;
        }

        public async Task<LoginRuselt> Login2FA(string email, string otp)
        {
            var user = await _userManagement.GEtUserByEmail(email);
            if (user == null) return new LoginRuselt(false, "User not found");

            bool valid = await _tokenManagement.VerifyOtp(user.Id, otp);
            if (!valid) return new LoginRuselt(false, "Invalid OTP");

            var claims = await _userManagement.GetUserClaims(user.Email);

            string accessToken = _tokenManagement.GenerateToken(claims);
            string refreshToken = _tokenManagement.GetRefreshToken();
            await _tokenManagement.AddrefreshToken(user.Id, refreshToken);

            return new LoginRuselt(true, "2FA login successful", accessToken, refreshToken);
        }



        public async Task<bool> ForgetPassword(ForgetPasswordDTO dto)
        {
            var user = await _userManagement.GEtUserByEmail(dto.Email);
            if (user == null) return false;

            Random rnd = new Random();
            string code = rnd.Next(100000, 999999).ToString();

            _passwordResetStore[dto.Email] = new PasswordResetCode
            {
                Email = dto.Email,
                Code = code,
                Expiry = DateTime.UtcNow.AddMinutes(10)
            };

            await _emailService.SendEmailAsync(user.Email, "Password Reset Code", $"Your code: {code}");
            return true;
        }

        public Task<bool> VerifyCode(VerifyCodeDTO dto)
        {
            if (!_passwordResetStore.TryGetValue(dto.Email, out var storedCode))
                return Task.FromResult(false);

            if (storedCode.Expiry < DateTime.UtcNow) return Task.FromResult(false);

            return Task.FromResult(storedCode.Code == dto.Code);
        }

        public async Task<bool> ResetPassword(ResetPasswordCodeDTO dto)
        {
            if (!_passwordResetStore.ContainsKey(dto.Email))
                return false;

            var user = await _userManagement.GEtUserByEmail(dto.Email);
            if (user == null) return false;

            await _userManagement.UpdatePassword(user.Id, dto.ConfirmPassword);

            _passwordResetStore.Remove(dto.Email);

            return true;
        }
        public Task Logout(string userId)
        {
            return _tokenManagement.RemoveRefreshToken(userId);
        }


        public async Task<UserProfileDTO?> GetProfile(ClaimsPrincipal userClaims)
        {
            var authId = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(authId))
                return null;
            var appUser = await _userManagement.GEtUserById(authId);
            if (appUser == null)
                return null;
            var profile = await _userProfileRepo.Query()
                .FirstOrDefaultAsync(p => p.Authuserid == authId);

            var role = userClaims.FindFirst(ClaimTypes.Role)?.Value ?? "";
            string finalRole;
            if (role == "Student")
                finalRole = "User";
            else if (role == "Teacher")
                finalRole = "User";
            else
                finalRole = "admin";

            return new UserProfileDTO
            {
                FullName = profile != null
                    ? $"{profile.Fname} {profile.Lname}"
                    : appUser.Fullname,

                Email = appUser.Email,
                Role = finalRole,
                ProfilePic = profile?.ProfilePic
            };
        }


        public async Task<LoginRuselt> GoogleLogin(ExternalAuthDTO dto)
        {
            try
            {
                string idToken = dto.AccessToken;
                var payload = await GoogleJsonWebSignature.ValidateAsync(idToken);

                string email = payload.Email!;
                string fullName = payload.Name ?? payload.Email!;
                string googleId = payload.Subject;


                var user = await _userManagement.GEtUserByEmail(email);

                if (user == null)
                {

                    user = new ApplicationUser
                    {
                        Email = email,
                        UserName = email.Split('@')[0],
                        Fullname = fullName,

                    };

                    var created = await _userManagement.CreateUser(user, "Google_Auth_Login_Only@123");
                    if (!created)
                        return new LoginRuselt(false, "Cannot create Google user.");


                    await _roleManagement.AddUserToRole(user, AppRoles.Student);
                }


                var claims = await _userManagement.GetUserClaims(email);
                var access = _tokenManagement.GenerateToken(claims);
                var refresh = _tokenManagement.GetRefreshToken();

                await _tokenManagement.UpdaterefreshToken(user.Id, refresh);

                return new LoginRuselt(true, access, refresh);
            }
            catch
            {
                return new LoginRuselt(false, "Invalid Google token.");
            }
        }


        public async Task<LoginRuselt> FacebookLogin(ExternalAuthDTO dto)
        {
            string accessToken = dto.AccessToken;
            try
            {
                string url = $"https://graph.facebook.com/me?fields=id,name,email&access_token={accessToken}";

                using var client = new HttpClient();
                var fbUser = await client.GetFromJsonAsync<FacebookUserDTO>(url);

                if (fbUser == null || string.IsNullOrEmpty(fbUser.Email))
                    return new LoginRuselt(false, "Invalid Facebook token.");

                string email = fbUser.Email;
                string fullName = fbUser.Name;
                string facebookId = fbUser.Id;

                var user = await _userManagement.GEtUserByEmail(email);

                if (user == null)
                {
                    user = new ApplicationUser
                    {
                        Email = email,
                        UserName = email.Split('@')[0],
                        Fullname = fullName,

                    };

                    var created = await _userManagement.CreateUser(user, "Facebook_Auth_Only@123");
                    if (!created)
                        return new LoginRuselt(false, "Error creating Facebook user.");

                    await _roleManagement.AddUserToRole(user, AppRoles.Student);
                }

                var claims = await _userManagement.GetUserClaims(email);
                var access = _tokenManagement.GenerateToken(claims);
                var refresh = _tokenManagement.GetRefreshToken();

                await _tokenManagement.UpdaterefreshToken(user.Id, refresh);

                return new LoginRuselt(true, access, refresh);
            }
            catch
            {
                return new LoginRuselt(false, "Error validating Facebook token.");
            }
        }


        public async Task<string> GenerateRegistrationOTP(string email)
        {
            string code = await _tokenManagement.GenerateRegistrationOtp(email);
            await _emailService.SendEmailAsync(email, "Your Registration OTP", $"Your registration OTP is: {code}");
            return "Sent Successfully";
        }

        public async Task<bool> VerifyRegistrationOtp(string email, string code)
        {
            return await _tokenManagement.VerifyRegistrationOtp(email, code);
        }





    }


}
