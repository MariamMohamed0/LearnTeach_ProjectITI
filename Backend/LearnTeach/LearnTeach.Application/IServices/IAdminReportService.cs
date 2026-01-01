using LearnTeach.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.IServices
{
    public interface IAdminReportService
    {
        Task<IEnumerable<ReportDto>> GetAllReportsAsync();
        Task<bool> UpdateStatusAsync(int reportId, string newStatus);
        Task<IEnumerable<AdminUserDto>> GetPendingReportsAsync();
        Task<bool> SuspendOrRestoreUserAsync(int userId);
        Task<bool> DeleteReportAsync(int id);
    }
}
