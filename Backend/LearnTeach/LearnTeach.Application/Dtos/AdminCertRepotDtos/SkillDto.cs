using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.AdminCertRepotDtos
{
    public class SkillReadDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CateId { get; set; }
        public string CategoryName { get; set; }
    }

    public class SkillReadUserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int GoodAtIt { get; set; }
        public int CateId { get; set; }
        public string CategoryName { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
    }

    public class SkillWriteDto
    {
        public string Name { get; set; }
        public int CateId { get; set; }
    }
    public class SkillWriteUserDto
    {
        public string Name { get; set; }
        public int GoodAtIt { get; set; }
        public int CateId { get; set; }
    }

}
