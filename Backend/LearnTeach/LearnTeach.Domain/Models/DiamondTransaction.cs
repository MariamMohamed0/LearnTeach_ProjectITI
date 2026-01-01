using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Domain.Models
{
    public class DiamondTransaction
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? DiamondPackageId { get; set; }
        public int PointsChanged { get; set; }
        public string Reason { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;

        // Navigation
        public virtual Usersprofile Users { get; set; }
        public virtual DiamondPackage DiamondPackage { get; set; }

    }
}
