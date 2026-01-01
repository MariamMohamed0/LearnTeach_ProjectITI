using LearnTeach.Domain.Interfaceses.Authentication;
using LearnTeach.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;




namespace LearnTeach.Infrastructure.Repository.Authentications
{
    public class UserManagement(IRoleManagement roleManagement, UserManager<ApplicationUser> userManager, AuthDbContext dbContext) : IUserManagement
    {
        public async Task<bool> CreateUser(ApplicationUser appuser, string password)
        {
            var existingUser = await GEtUserByEmail(appuser.Email!);
            if (existingUser != null) return false;

            var result = await userManager.CreateAsync(appuser, password);
            return result.Succeeded;
        }



        public async Task<IEnumerable<ApplicationUser?>> GetAllUsers() =>
            await dbContext.Users.ToListAsync();

        public async Task<ApplicationUser?> GEtUserByEmail(string email) =>
            await userManager.FindByEmailAsync(email);

        public async Task<ApplicationUser?> GEtUserById(string id) =>
            await userManager.FindByIdAsync(id);

        public async Task<List<Claim>> GetUserClaims(string email)
        {
            var _user = await GEtUserByEmail(email);
            string? rolename = await roleManagement.GetUserRole(_user!.Email!);

            List<Claim> claims = new()
            {
                new Claim(ClaimTypes.Name, _user.UserName!),
                new Claim(ClaimTypes.Email, _user.Email!),
                new Claim(ClaimTypes.Role, rolename ?? string.Empty),
                new Claim(ClaimTypes.NameIdentifier, _user.Id)
            };

            return claims;
        }

        public async Task<bool> LoginUser(ApplicationUser appuser, string password)
        {
            var _user = await GEtUserByEmail(appuser.Email!);
            if (_user is null) return false;

            string? rolename = await roleManagement.GetUserRole(_user.Email!);
            if (string.IsNullOrEmpty(rolename)) return false;

            return await userManager.CheckPasswordAsync(_user, password);
        }



        public async Task<int> RemoveUserByEmail(string email)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return 0;

            dbContext.Users.Remove(user);
            return await dbContext.SaveChangesAsync();
        }

        public async Task<bool> UpdatePassword(string id, string newPassword)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user == null) return false;

            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            var result = await userManager.ResetPasswordAsync(user, token, newPassword);

            return result.Succeeded;
        }


    }
}


