using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos
{
    public class CreateReportDto
    {
        public int? ReportedUserId { get; set; }

        public int EntityId { get; set; }
        public string EntityType { get; set; }
        public string ReportDescription { get; set; }
    }
}