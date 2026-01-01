using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Domain.AuthModel
{
    public class PasswordResetCode
    {
        public int Id { get; set; }

        public string Email { get; set; } = null!;
        public string Code { get; set; } = null!;
        public DateTime Expiry { get; set; }
    }

}
