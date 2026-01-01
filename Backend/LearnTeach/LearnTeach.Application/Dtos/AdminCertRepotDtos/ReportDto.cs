using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos
{

    public class ReportDto
    {
        public int ReportId { get; set; }
        public int? ReportedUserId { get; set; }
        public int ReportedBy { get; set; }
        public string ReportedByName { get; set; }       
        public string ReportedUserName { get; set; }
        public string EntityType { get; set; }
        public int EntityId { get; set; }
        public string ReportDescription { get; set; }
        public DateTime? CreatedAt { get; set; }

        public string ReportStatus { get; set; }

        public string ReportedUserStatus { get; set; }

    }

}

