using AutoMapper;
using LearnTeach.Application.Dtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.AspNetCore.Http;
using System.Globalization;
using System.Security.Claims;


namespace LearnTeach.Application.Services
{
    public class AdminReportService : IAdminReportService
    {
        private readonly IRepository<Report> _repo;
        private readonly IReportRepository _reportRepository;
        private readonly IRepository<Usersprofile> _userRepo;
        private readonly INotificationService _notifServ;
        private readonly IHttpContextAccessor _http;
        private readonly IMapper _mapper;


        public AdminReportService(IRepository<Report> repo,
            IReportRepository reportRepository,
            IRepository<Usersprofile> userRepo,
             INotificationService notifServ,
             IHttpContextAccessor http,
            IMapper mapper)
        {
            _repo = repo;
            _reportRepository = reportRepository;
            _userRepo = userRepo;
            _notifServ = notifServ;
            _mapper = mapper;
        }
        //public async Task<IEnumerable<ReportDto>> GetAllReportsAsync()
        //{
        //    var reports = await _repo.GetAllAsync();
        //    return _mapper.Map<IEnumerable<ReportDto>>(reports);
        //}
        public async Task<IEnumerable<ReportDto>> GetAllReportsAsync()
        {
            var reports = await _repo.GetAllAsync();

            var result = new List<ReportDto>();

            foreach (var report in reports)
            {
                var dto = _mapper.Map<ReportDto>(report);

                if (report.ReportedUserId.HasValue)
                {
                    var user = await _userRepo.GetByIdAsync(report.ReportedUserId.Value);
                    dto.ReportedUserStatus = user?.Status;
                    dto.ReportedUserName = user != null ? $"{user.Fname} {user.Lname}" : null;
                }

                result.Add(dto);
            }

            return result;
        }


        public async Task<IEnumerable<AdminUserDto>> GetPendingReportsAsync()
        {
            var pendingReports = await _reportRepository.GetPendingAsync();
            return _mapper.Map<IEnumerable<AdminUserDto>>(pendingReports);
        }

        public async Task<bool> UpdateStatusAsync(int reportId, string newStatus)
        {
            var report = await _repo.GetByIdAsync(reportId);
            if (report == null)
                return false;

            report.ReportStatus = newStatus.ToLower();
            _repo.Update(report);
            await _repo.SaveChangesAsync();

            if (!report.ReportedUserId.HasValue)
            {
                // Notify reporter only
                await NotifyReporter(report, newStatus);
                return true;
            }

            var userId = report.ReportedUserId.Value;

            if (newStatus == "approved")
            {
                // Count approved reports against this user
                var approvedReportsCount = (await _repo.GetAllAsync())
                                            .Count(r => r.ReportedUserId == userId && r.ReportStatus == "approved");

                if (approvedReportsCount >= 10)
                {
                    await UpdateUserStatusAndNotify(userId ,
                        "suspended",
                        "Your Account Was Suspended",
                        $"Your account has been suspended after receiving {approvedReportsCount} approved reports.");
                }
                else if (approvedReportsCount >= 5)
                {
                    await _notifServ.NotifyAsync(
                        userId,
                        "Warning: Multiple Reports Received",
                        $"Your account has received {approvedReportsCount} approved reports. Please review your behavior.",
                        "Report",
                        report.ReportId,
                        "/user/account-status",
                        null
                    );
                }

                await NotifyReporter(report, newStatus);
                await NotifyReportedUser(report, newStatus);
            }

            if (newStatus == "rejected")
            {

                await NotifyReporter(report, newStatus);
            }

            return true;
        }

        private async Task UpdateUserStatusAndNotify(int userId, string status, string title, string message)
        {

            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) return;

            user.Status = status;
            _userRepo.Update(user);
            await _userRepo.SaveChangesAsync();

            await _notifServ.NotifyAsync(user.UserId, title, message, "Report", null, "/user/account-status", null);
        }

        private async Task NotifyReporter(Report report, string status)
        {
            string title = status == "approved"
                ? "Your Report Was Approved"
                : "Your Report Was Rejected";

            string message = status == "approved"
                ? "We reviewed your report and action has been taken."
                : "After review, your report was rejected.";

            string reportedUserName = "Account Not Available";
            if (report.ReportedUserId.HasValue)
            {
                var user = await _userRepo.GetByIdAsync(report.ReportedUserId.Value);
                if (user != null)
                {
                    reportedUserName = $"{user.Fname} {user.Lname}";
                }
            }

            string details =
                "──────── Report Details ────────\n" +
                $"• Target: {report.EntityType} → {reportedUserName}\n" +
                $"• Description: {report.ReportDescription}\n" +
                $"• Reported At: {report.CreatedAt}\n";

            
            string fullMessage = message + "\n\n" + details;

            await _notifServ.NotifyAsync(
                report.ReportedBy,
                title,
                fullMessage,
                "Report",
                report.ReportId,
                $"/reports/details/{report.ReportId}",
                null
            );
        }


        public async Task<bool> SuspendOrRestoreUserAsync(int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) return false;

            string newStatus;
            string title;
            string message;

            if (user.Status == "suspended")
            {
                newStatus = "active";
                title = "Your Account Has Been Restored";
                message = "An admin restored your account.";
            }
            else
            {
                newStatus = "suspended";
                title = "Your Account Has Been Suspended";
                message = "An admin suspended your account.";
            }

            user.Status = newStatus;
            _userRepo.Update(user);
            await _userRepo.SaveChangesAsync();

            await _notifServ.NotifyAsync(user.UserId, title, message, "AdminAction", null, "/user/account-status", null);

            return true;
        }


        public async Task<bool> DeleteReportAsync(int id)
        {
            var report = await _repo.GetByIdAsync(id);
            if (report == null)
                return false; 


            _repo.Remove(report);
            await _repo.SaveChangesAsync();
            return true; 
        }

        private async Task NotifyReportedUser(Report report, string status)
        {
            if (!report.ReportedUserId.HasValue)
                return;

            var user = await _userRepo.GetByIdAsync(report.ReportedUserId.Value);
            if (user == null) return;

            string title = status == "approved"
                ? "A Report Against You Was Approved"
                : "A Report Against You Was Rejected";

            string message = status == "approved"
                ? "A report filed against you was reviewed and approved."
                : "A report filed against you was reviewed but rejected.";

            string details =
                "──────── Report Details ────────\n" +
                $"• Description: {report.ReportDescription}\n" +
                $"• Filed At: {report.CreatedAt}\n";

            await _notifServ.NotifyAsync(
                user.UserId,
                title,
                message + "\n\n" + details,
                "Report",
                report.ReportId,
                "/user/account-status",
                null
            );
        }


    }
}