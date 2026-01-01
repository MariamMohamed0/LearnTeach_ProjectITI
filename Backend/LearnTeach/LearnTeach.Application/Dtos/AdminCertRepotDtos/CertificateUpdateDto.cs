using Microsoft.AspNetCore.Http;

namespace LearnTeach.Application.Dtos
{
    public class CertificateUpdateDto
    {

        public string Cername { get; set; }
        public string InstatutionName { get; set; }
        public int? EarnedYear { get; set; }
        public IFormFile Cerpic { get; set; }
    }
}
