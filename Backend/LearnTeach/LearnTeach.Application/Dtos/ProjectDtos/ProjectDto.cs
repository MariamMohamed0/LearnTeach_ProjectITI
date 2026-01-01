using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.ProjectDtos
{
    public class ProjectDto
    {
        public int ProjectId { get; set; }
        public int UserId { get; set; }
        public string ProjectName { get; set; }
        public string Repolink { get; set; }
        public string ProjectDesc { get; set; }
    }
}
