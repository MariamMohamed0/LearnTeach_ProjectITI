using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.MaterialDtos
{
    public class CreateMaterialDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int Cateid { get; set; }
        public int Uploaderid { get; set; }
   

    }
}
