using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.SessionDtos
{
    public class UpdateSessionDto
    {
        public string SessionTitle { get; set; } = null!;
        public int LearnerId { get; set; }
        public int SkillId { get; set; }
        public DateTime ScheduleStart { get; set; }
        public DateTime ScheduleEnd { get; set; }
    }

}