using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Domain.Models
{
    public class UserSkills
    {
            public int UserId { get; set; }
            public Usersprofile User { get; set; }

            public int SkillId { get; set; }
            public Skill Skill { get; set; }

            public int GoodAtIt { get; set; }

    }
}
