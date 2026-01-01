using LearnTeach.Infrastructure.Data;
using System.Security.Claims;

namespace LearnTeach.Domain.Interfaceses.Authentication
{
    public interface IUserManagement
    {
        Task<bool> CreateUser(ApplicationUser appuser, string password);
        Task<bool> LoginUser(ApplicationUser appuser, string password);
        Task<ApplicationUser?> GEtUserByEmail(string email);
        Task<ApplicationUser?> GEtUserById(string id);
        Task<IEnumerable<ApplicationUser?>> GetAllUsers();
        Task<int> RemoveUserByEmail(string email);
        Task<List<Claim>> GetUserClaims(string email);
        Task<bool> UpdatePassword(string id, string newPassword);
    }
}
