using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace LearnTeach.Application.Dtos.AuthDtos
{
    public class RegisterUserDTO
    {
        [Required(ErrorMessage ="First name is required")]
        public required  string FName { get; set; }
        [Required(ErrorMessage = "Last name is required")]
        public required string LName { get; set; }
        [Required(ErrorMessage = "Email is required")]

        public required string Email { get; set; }
        [Required(ErrorMessage = "Password is required")]
        public required string Password { get; set; }
        [Required(ErrorMessage = "Please, Confirm password")]
        [Compare("Password")]
        public required string ConfirmedPassword { get; set; }


        public string OTP { get; set; } = null!;
        public string? ProfilePic { get; set; }
    }
}
