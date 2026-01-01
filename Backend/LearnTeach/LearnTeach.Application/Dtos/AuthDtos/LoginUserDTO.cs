using System.ComponentModel.DataAnnotations;

namespace LearnTeach.Application.Dtos.AuthDtos
{
    public class LoginUserDTO
    {
        [Required(ErrorMessage = "Email is required")]
        public required string Email { get; set; }
        [Required(ErrorMessage = "Password is required")]
        public required string Password { get; set; }
    }
}