using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Domain.AuthModel
{
    public class UserOtp
    {
       
            public int Id { get; set; }
            public string UserId { get; set; } = null!;
            public string Code { get; set; } = null!;
            public DateTime ExpireAt { get; set; }
            public string Purpose { get; set; } = "Login"; // Default = Login OR Register
        

    }
}
