using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.IServices
{

        public interface IReportRepository : IRepository<Report>
        {
            Task<IEnumerable<Report>> GetUserReportsAsync(int userId);
            Task<IEnumerable<Report>> GetPendingAsync();
        }

}
