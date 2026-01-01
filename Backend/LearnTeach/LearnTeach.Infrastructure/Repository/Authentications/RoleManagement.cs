using AutoMapper.Configuration;
using LearnTeach.Domain.Interfaceses.Authentication;
using LearnTeach.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;


namespace LearnTeach.Infrastructure.Repository.Authentications
{
    public class RoleManagement(UserManager<ApplicationUser> userManager) : IRoleManagement
    {
        public async Task<bool> AddUserToRole(ApplicationUser appuser, string roleName)=>
            (await userManager.AddToRoleAsync(appuser, roleName)).Succeeded;


        public async Task<string?> GetUserRole(string Email)
        {
            var user =await userManager.FindByEmailAsync(Email);
            return (await userManager.GetRolesAsync(user!)).FirstOrDefault();
        }

        public async Task<List<string>> GetUserRoles(ApplicationUser user)
        {
            return (await userManager.GetRolesAsync(user)).ToList();
        }
    }
}
