using LearnTeach.Application.Dtos.UserProfileDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.AdminCertRepotDtos
{
   public class UserSkillDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int GoodAtIt { get; set; }
        public int CateId { get; set; }
        public string CategoryName { get; set; }
        public List<UserProfileDto> Users { get; set; } = new List<UserProfileDto>();
    }
}
