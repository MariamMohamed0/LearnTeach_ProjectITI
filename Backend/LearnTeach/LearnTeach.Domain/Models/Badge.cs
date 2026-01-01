using LearnTeach.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Domain.Models
{
    public class Badge
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? IconUrl { get; set; }
        public int MinRating { get; set; }
        public int MaxRating { get; set; }
        public ICollection<Usersprofile>? Users { get; set; }
    }
}
