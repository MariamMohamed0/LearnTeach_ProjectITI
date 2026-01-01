using System.Security.Claims;

namespace LearnTeach.Domain.Interfaceses.Authentication
{
    public interface ITokenManagement
    {
        string GetRefreshToken();
        List<Claim> GetUserClaimsFrimToken(string email);
        Task<bool> ValidateRefreshToken(string refreshToken);
        Task<string>GetUserIdByRefreshToken(string refreshToken);
        Task<int> AddrefreshToken(string userId, string refreshToken);
        Task<int> UpdaterefreshToken(string userId, string refreshToken);
        string GenerateToken(List<Claim> claims);


        // OTP
        Task<string> GenerateOtp(string userId);
        Task<bool> VerifyOtp(string userId, string code);

        // Password Reset
        Task<string> GeneratePasswordResetToken(string userId);
        Task<bool> ResetPassword(string userId, string token, string newPassword);

        // Logout
        Task RemoveRefreshToken(string userId);


        //Generate Register OTP
        Task<string> GenerateRegistrationOtp(string userId);

        Task<bool> VerifyRegistrationOtp(string userId, string code);

    }
}
