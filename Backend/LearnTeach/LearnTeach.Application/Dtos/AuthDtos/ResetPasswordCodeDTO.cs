using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.AuthDtos
{
    public class ResetPasswordCodeDTO
    {
        public string Email { get; set; } = null!;
        public string ConfirmPassword { get; set; } = null!;

    }
}
