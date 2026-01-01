using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.NationalIdDtos
{
    public class CreateUserNationalIdDto
    {
        [Required(ErrorMessage = "Front ID picture is required")]
        public IFormFile FrontPic { get; set; }

        [Required(ErrorMessage = "Back ID picture is required")]
        public IFormFile BackPic { get; set; }

        [Required(ErrorMessage = "Selfie with ID is required")]
        public IFormFile SelfieWithId { get; set; }
    }
}
