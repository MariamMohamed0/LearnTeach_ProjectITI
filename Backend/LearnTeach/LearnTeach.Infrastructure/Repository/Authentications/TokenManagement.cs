using LearnTeach.Domain.AuthModel;
using LearnTeach.Domain.Interfaceses.Authentication;
using LearnTeach.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Paymob.Net.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;




namespace LearnTeach.Infrastructure.Repository.Authentications
{
    public class TokenManagement(AuthDbContext dbContext , Microsoft.Extensions.Configuration.IConfiguration config) : ITokenManagement
    {
        public Task<int> AddrefreshToken(string userId, string refreshToken)
        {
           dbContext.RefreshTokens.Add(new Domain.AuthModel.RefreshToken
            {
                UserId = userId,
                Token = refreshToken
                
            });
            return dbContext.SaveChangesAsync();    
        }

        public string GenerateToken(List<Claim> claims)
        {
            var key=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JWT:Key"]!));
            var creds=new SigningCredentials(key,SecurityAlgorithms.HmacSha256);
            var expiration=DateTime.Now.AddDays(1);
            var token=new JwtSecurityToken(
                issuer:config["JWT:Issuer"],
                audience:config["JWT:Audience"],
                claims:claims,
                expires:expiration,
                signingCredentials:creds
                );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GetRefreshToken()
        {
            const int bytesize = 64;
            byte[] randomBytes = new byte[bytesize];
            using(RandomNumberGenerator rng=RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return Convert.ToBase64String(randomBytes);
        }

        public List<Claim> GetUserClaimsFrimToken(string token)
        {
            var tokenHandler=new JwtSecurityTokenHandler();
            var jwtToken=tokenHandler.ReadJwtToken(token);
            if (jwtToken != null)
                return jwtToken.Claims.ToList();
            else
                return [];
        }

        public async Task<string> GetUserIdByRefreshToken(string refreshToken)
        {
            refreshToken = Uri.UnescapeDataString(refreshToken).Trim();

            var tokenEntity = await dbContext.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

            if (tokenEntity == null)
            {
                Console.WriteLine("[DEBUG] Token not found in DB!");
                return null;
            }

            return tokenEntity.UserId;
        }
        

        public async Task<int> UpdaterefreshToken(string userId, string refreshToken)
        {
            var user=await dbContext.RefreshTokens.FirstOrDefaultAsync(rt=>rt.UserId==userId);
            if (user == null) return -1;
            user.Token = refreshToken;
            return await dbContext.SaveChangesAsync();
        }

        public async Task<bool> ValidateRefreshToken(string refreshToken)
        {
            var user=await dbContext.RefreshTokens.FirstOrDefaultAsync(rt=>rt.Token==refreshToken);
            return user != null;
        }

        #region OTP

        // OTP generation (6 digits)
        public async Task<string> GenerateOtp(string userId)
        {
            const int length = 6;
            Random rnd = new();
            string otp = "";
            for (int i = 0; i < length; i++)
                otp += rnd.Next(0, 10);

            var existing = await dbContext.UserOtps.FirstOrDefaultAsync(u => u.UserId == userId);
            if (existing != null)
            {
                existing.Code = otp;
                existing.ExpireAt = DateTime.UtcNow.AddMinutes(5);
            }
            else
            {
                dbContext.UserOtps.Add(new Domain.AuthModel.UserOtp
                {
                    UserId = userId,
                    Code = otp,
                    ExpireAt = DateTime.UtcNow.AddMinutes(5),
                    Purpose = "Login"
                });
            }
            await dbContext.SaveChangesAsync();
            return otp;
        }

        public async Task<bool> VerifyOtp(string userId, string code)
        {
            var otp = await dbContext.UserOtps.FirstOrDefaultAsync(u => u.UserId == userId && u.Code == code);
            if (otp == null) return false;
            if (otp.ExpireAt < DateTime.UtcNow) return false;
            dbContext.UserOtps.Remove(otp);
            await dbContext.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Password Reset

        public async Task<string> GeneratePasswordResetToken(string userId)
        {
            string token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
            var existing = await dbContext.PasswordResetTokens.FirstOrDefaultAsync(p => p.UserId == userId);
            if (existing != null)
            {
                existing.Token = token;
                existing.ExpireAt = DateTime.UtcNow.AddMinutes(15);
            }
            else
            {
                dbContext.PasswordResetTokens.Add(new Domain.AuthModel.PasswordResetToken
                {
                    UserId = userId,
                    Token = token,
                    ExpireAt = DateTime.UtcNow.AddMinutes(15)
                });
            }
            await dbContext.SaveChangesAsync();
            return token;
        }

        public async Task<bool> ResetPassword(string userId, string token, string newPassword)
        {
            var tokenEntity = await dbContext.PasswordResetTokens
                .FirstOrDefaultAsync(p => p.UserId == userId && p.Token == token);

            if (tokenEntity == null || tokenEntity.ExpireAt < DateTime.UtcNow)
                return false;

            // Update password in Users table (using UserManager or direct)
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return false;

            var passwordHasher = new Microsoft.AspNetCore.Identity.PasswordHasher<ApplicationUser>();
            user.PasswordHash = passwordHasher.HashPassword(user, newPassword);

            dbContext.PasswordResetTokens.Remove(tokenEntity);
            await dbContext.SaveChangesAsync();
            return true;
        }

        public async Task RemoveRefreshToken(string userId)
        {
            // البحث عن الـ refresh token الخاص بالمستخدم في قاعدة البيانات
            var token = await dbContext.RefreshTokens.FirstOrDefaultAsync(rt => rt.UserId == userId);

            // إذا وجد، نحذفه
            if (token != null)
            {
                dbContext.RefreshTokens.Remove(token);
                await dbContext.SaveChangesAsync();
            }
        }

        #endregion


        #region Register OTP
        #region Register OTP
        public async Task<string> GenerateRegistrationOtp(string email)
        {
            const int length = 6;
            Random rnd = new();
            string otp = "";
            for (int i = 0; i < length; i++)
                otp += rnd.Next(0, 10);

            var existing = await dbContext.UserOtps
                .FirstOrDefaultAsync(u => u.UserId == email && u.Purpose == "Registration");

            if (existing != null)
            {
                existing.Code = otp;
                existing.ExpireAt = DateTime.UtcNow.AddMinutes(10);
            }
            else
            {
                dbContext.UserOtps.Add(new UserOtp
                {
                    UserId = email,   // email مؤقت بدل UserId الحقيقي
                    Code = otp,
                    ExpireAt = DateTime.UtcNow.AddMinutes(10),
                    Purpose = "Registration"
                });
            }

            await dbContext.SaveChangesAsync();
            return otp;
        }

        public async Task<bool> VerifyRegistrationOtp(string email, string code)
        {
            var otp = await dbContext.UserOtps
                .FirstOrDefaultAsync(u => u.UserId == email && u.Code == code && u.Purpose == "Registration");

            if (otp == null || otp.ExpireAt < DateTime.UtcNow)
                return false;

            dbContext.UserOtps.Remove(otp);
            await dbContext.SaveChangesAsync();
            return true;
        }
        #endregion


        #endregion
    }
}
