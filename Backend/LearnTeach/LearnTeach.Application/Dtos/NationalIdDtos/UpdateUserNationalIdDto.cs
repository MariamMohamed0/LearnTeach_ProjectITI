using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.NationalIdDtos
{
    public class UpdateUserNationalIdDto
    {
        public IFormFile? FrontPic { get; set; }
        public IFormFile? BackPic { get; set; }
        public IFormFile? SelfieWithId { get; set; }
    }
}
