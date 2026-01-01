using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos
{
    public class CertificateDto
    {
        public int UserId { get; set; }
        public int Cerid { get; set; }
        public string Cername { get; set; }
        public string InstatutionName { get; set; }
        public int? EarnedYear { get; set; }
        public string Cerpic { get; set; }
    }
}
