using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using LearnTeach.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LearnTeach.Infrastructure.Repository
{
    public class ReportRepository : Repository<Report>, IReportRepository
    {
        private readonly LEANRANDTEACHContext _context;

        public ReportRepository(LEANRANDTEACHContext context) : base(context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Report>> GetUserReportsAsync(int userId)
        {
            return await _context.Reports
                .Include(r => r.ReportedByNavigation)
                .Include(r => r.ReportedUser)
                .ToListAsync();
            //.Where(r => r.ReportedBy== userId)
            //.ToListAsync();
        }

        public async Task<IEnumerable<Report>> GetPendingAsync()
        {
            return await _context.Reports.Where(r => r.ReportStatus.ToLower() == "pending").ToListAsync();
        }


    }
}

