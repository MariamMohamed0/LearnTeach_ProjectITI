using AutoMapper;
using LearnTeach.Application.Dtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using static System.Net.WebRequestMethods;

namespace LearnTeach.Application.Services
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _repo;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _http;
        private readonly IRepository<Usersprofile> _userRepo;
        private readonly INotificationService _notifServ;
        public ReportService(IReportRepository repo, IMapper mapper, IHttpContextAccessor http, IRepository<Usersprofile> userRepo, INotificationService notifServ)
        {
            _repo = repo;
            _mapper = mapper;
            _http = http;
            _userRepo = userRepo;
            _notifServ = notifServ;

        }

        public async Task<IEnumerable<ReportDto>> GetUserReportsAsync()
        {
            int userId = CurrentUserId();
            var reports = await _repo.GetUserReportsAsync(userId);
            return _mapper.Map<IEnumerable<ReportDto>>(reports);
        }

        public async Task<ReportDto> CreateReportAsync(CreateReportDto dto)
        {
            int reportedById = CurrentUserId();

            var report = _mapper.Map<Report>(dto);
            if (report.ReportedUserId == CurrentUserId())
            {
                throw new ArgumentException("You can't Report Urself");
            }
            report.ReportStatus = "Pending";
            report.ReportedBy = reportedById;

            await _repo.AddAsync(report);
            await _repo.SaveChangesAsync();

            //Notify 
            await _notifServ.NotifyAsync(
               reportedById,
               "Report Submitted",
               $"Your report has been submitted:\n{report.ReportDescription}",
               "Report",
               report.ReportId,
               $"/reports/details/{report.ReportId}",
               null
            );

            
            if (report.ReportedUserId.HasValue)
            {
                var reportedUser = await _userRepo.GetByIdAsync(report.ReportedUserId.Value);
                if (reportedUser != null)
                {
                    await _notifServ.NotifyAsync(
                        reportedUser.UserId,
                        "A New Report Was Filed Against You",
                        $"A report has been filed against you.\n\nDescription:\n{report.ReportDescription}",
                        "Report",
                        report.ReportId,
                        "/user/account-status",
                        null
                    );
                }
            }

            return _mapper.Map<ReportDto>(report);
        }

        private int CurrentUserId()
        {
            var authId = _http.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(authId))
                throw new UnauthorizedAccessException("User not logged in.");

            var user = _userRepo.Query().FirstOrDefault(u => u.Authuserid == authId);
            if (user == null) throw new UnauthorizedAccessException("User profile not found.");

            return user.UserId;
        }
    }
}
