using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Domain.Models
{

    public partial class UserPayment
    {

        public int PayId { get; set; }
        public int UserId { get; set; }

        // Navigation
        public Usersprofile Users { get; set; }
        public Paymenttransaction Paymenttransaction { get; set; }
    }

}
