using LearnTeach.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Domain.Interfaceses.Authentication
{
    public interface IRoleManagement
    {
        Task<string?>GetUserRole(string Email);
        Task<bool> AddUserToRole(ApplicationUser appuser, string roleName);

        Task<List<string>> GetUserRoles(ApplicationUser user);
    }

}

