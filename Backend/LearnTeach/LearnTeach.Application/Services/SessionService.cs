using LearnTeach.Application.Dtos.SessionDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace LearnTeach.Application.Services
{
    public class SessionService : ISessionService
    {
        private readonly IRepository<Session> _sessionRepo;
        private readonly IRepository<DiamondTransaction> _diamondTransactionRepo;
        private readonly IRepository<Usersprofile> _userRepo;
        private readonly IRepository<Skill> _skillRepo;
        private readonly INotificationService _notificationService;
        private readonly IZoomService _zoomService;
        private readonly IHttpContextAccessor _http;
        private readonly IRepository<Usersessionfeedback> _feedbackRepo;

        private readonly TimeZoneInfo _egyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");

        public SessionService(
            IRepository<Session> sessionRepo,
            IRepository<Usersprofile> userRepo,
            IRepository<Skill> skillRepo,
            IZoomService zoomService,
            INotificationService notificationService,
            IHttpContextAccessor http,
            IRepository<DiamondTransaction> diamondTransactionRepo,
            IRepository<Usersessionfeedback> feedbackRepo)
        {
            _sessionRepo = sessionRepo;
            _userRepo = userRepo;
            _skillRepo = skillRepo;
            _zoomService = zoomService;
            _notificationService = notificationService;
            _http = http;
            _diamondTransactionRepo = diamondTransactionRepo;
            _feedbackRepo = feedbackRepo;
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

        private DateTime GetNowEgyptTime() =>
            TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, _egyptTimeZone);



        public async Task<SessionDto> CreateSessionAsync(CreateSessionDto dto)
        {
            int userId = CurrentUserId();

            if (dto.Role.ToLower() != "teacher")
                throw new UnauthorizedAccessException("Only teachers can create sessions.");

            if (dto.ScheduleStart < DateTime.UtcNow)
                throw new ArgumentException("Start time cannot be in the past.");

            if (dto.ScheduleEnd <= dto.ScheduleStart)
                throw new ArgumentException("End time must be after start time.");

            var learner = await _userRepo.GetByIdAsync(dto.LearnerId);
            if (learner == null) throw new ArgumentException("Learner not found.");

            var skill = await _skillRepo.GetByIdAsync(dto.SkillId);
            if (skill == null) throw new ArgumentException("Skill not found.");

            bool teacherConflict = await _sessionRepo.Query()
                .AnyAsync(s => s.TeacherId == userId && s.ScheduleStart < dto.ScheduleEnd && s.ScheduleEnd > dto.ScheduleStart && s.Status != "Completed");
            if (teacherConflict) throw new InvalidOperationException("Teacher has a conflicting session.");

            bool learnerConflict = await _sessionRepo.Query()
                .AnyAsync(s => s.LearnerId == dto.LearnerId && s.ScheduleStart < dto.ScheduleEnd && s.ScheduleEnd > dto.ScheduleStart && s.Status != "Completed");
            if (learnerConflict) throw new InvalidOperationException("Learner has a conflicting session.");

            var session = new Session
            {
                SessionTitle = dto.SessionTitle,
                TeacherId = userId,
                LearnerId = dto.LearnerId,
                SkillId = dto.SkillId,
                ScheduleStart = dto.ScheduleStart,
                ScheduleEnd = dto.ScheduleEnd,
                CreatedAt = DateTime.UtcNow,
                Status = "Scheduled",

                UpcomingNotificationSent = false,
                StartedNotificationSent = false,
                EndedNotificationSent = false
            };


            try
            {
                var (meetingId, joinUrl) = await _zoomService.CreateMeetingAsync(
                    $"Session with {learner.Fname}", dto.ScheduleStart, (int)(dto.ScheduleEnd - dto.ScheduleStart).TotalMinutes);
                session.ZoomMeetingId = meetingId;
                session.ZoomJoinUrl = joinUrl;
            }
            catch (HttpRequestException ex)
            {
                throw new InvalidOperationException($"Failed to create Zoom meeting: {ex.Message}");
            }

            await _sessionRepo.AddAsync(session);
            await _sessionRepo.SaveChangesAsync();

            var egyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");
            var scheduleStartEgypt = TimeZoneInfo.ConvertTimeFromUtc(dto.ScheduleStart, egyptTimeZone);
            var scheduleEndEgypt = TimeZoneInfo.ConvertTimeFromUtc(dto.ScheduleEnd, egyptTimeZone);

            var teacherName = session.Teacher != null ? $"{session.Teacher.Fname} {session.Teacher.Lname}" : "Unknown Teacher";

            string notificationMessage = $@"
            <p>You have a <b>{session.SessionTitle}</b>  session <br> with <b>{teacherName}</b></p>
            <p>Start: {scheduleStartEgypt:HH:mm} | End: {scheduleEndEgypt:HH:mm}</p>
            <p>Join Zoom: <a href='{session.ZoomJoinUrl}' target='_blank'>Click Here</a></p><br>
            <p>Hava a good day 🌟</p>";


            await _notificationService.NotifyAsync(
                dto.LearnerId,
                "New session scheduled ✨",
                notificationMessage,
                "Session",
                session.Sessionid,
                session.ZoomJoinUrl,
                userId
            );

            return new SessionDto
            {
                SessionTitle = session.SessionTitle,
                SessionId = session.Sessionid,
                ScheduleStartEgypt = TimeZoneInfo.ConvertTimeFromUtc(session.ScheduleStart, _egyptTimeZone),
                ScheduleEndEgypt = TimeZoneInfo.ConvertTimeFromUtc(session.ScheduleEnd, _egyptTimeZone),
                Status = session.Status,
                OtherUserFullName = $"{learner.Fname} {learner.Lname}".Trim(),
                ZoomMeetingId = session.ZoomMeetingId,
                ZoomJoinUrl = session.ZoomJoinUrl
            };
        }


    
        public async Task<(IEnumerable<SessionDto> Sessions, int TotalCount)> GetSessionsForUserAsync(
    string role = null,
    int pageNumber = 1,
    int pageSize = 10,
    string order = "desc")
        {
            int userId = CurrentUserId();

            IQueryable<Session> query = _sessionRepo.Query()
                .Include(s => s.Teacher)
                .Include(s => s.Learner)
                .Include(s => s.Skill);

     
            if (!string.IsNullOrEmpty(role))
            {
                role = role.ToLower();
                if (role == "teacher") query = query.Where(s => s.TeacherId == userId);
                else if (role == "student") query = query.Where(s => s.LearnerId == userId);
            }
            else
            {
                query = query.Where(s => s.TeacherId == userId || s.LearnerId == userId);
            }


            int totalCount = await query.CountAsync();

            if (order.ToLower() == "asc")
                query = query.OrderBy(s => s.ScheduleStart);
            else
                query = query.OrderByDescending(s => s.ScheduleStart);


            var list = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            foreach (var s in list)
            {
                UpdateSessionStatus(s);
            }

            return (list.Select(s => new SessionDto
            {
                SessionId = s.Sessionid,
                SessionTitle = s.SessionTitle,
                Status = s.Status,
                OtherUserFullName = s.TeacherId == userId
                    ? $"{s.Learner.Fname} {s.Learner.Lname}".Trim()
                    : $"{s.Teacher.Fname} {s.Teacher.Lname}".Trim(),
                ZoomJoinUrl = s.ZoomJoinUrl,
                ZoomMeetingId = s.ZoomMeetingId,
                ScheduleStartEgypt = TimeZoneInfo.ConvertTimeFromUtc(s.ScheduleStart, _egyptTimeZone),
                ScheduleEndEgypt = TimeZoneInfo.ConvertTimeFromUtc(s.ScheduleEnd, _egyptTimeZone),
                SkillName = s.Skill.Name
            }), totalCount);
        }






        public async Task<bool> UpdateSessionAsync(int sessionId, UpdateSessionDto dto)
        {
            int userId = CurrentUserId();

            var session = await _sessionRepo.GetByIdAsync(sessionId);
            if (session == null) return false;

            if (session.Status == "Completed" && session.Status == "Ongoing") return false;


            if (session.TeacherId != userId)
                throw new UnauthorizedAccessException("Only the teacher who created the session can edit it.");

            if (dto.ScheduleStart < DateTime.UtcNow)
                throw new ArgumentException("Start time cannot be in the past.");

            if (dto.ScheduleEnd <= dto.ScheduleStart)
                throw new ArgumentException("End time must be after start time.");

            var learner = await _userRepo.GetByIdAsync(dto.LearnerId) ?? throw new ArgumentException("Learner not found.");
            var skill = await _skillRepo.GetByIdAsync(dto.SkillId) ?? throw new ArgumentException("Skill not found.");

            bool teacherConflict = await _sessionRepo.Query()
                .AnyAsync(s => s.Sessionid != sessionId && s.TeacherId == userId &&
                               s.ScheduleStart < dto.ScheduleEnd && s.ScheduleEnd > dto.ScheduleStart);
            if (teacherConflict) throw new InvalidOperationException("Teacher has a conflicting session.");

            bool learnerConflict = await _sessionRepo.Query()
                .AnyAsync(s => s.Sessionid != sessionId && s.LearnerId == dto.LearnerId &&
                               s.ScheduleStart < dto.ScheduleEnd && s.ScheduleEnd > dto.ScheduleStart);
            if (learnerConflict) throw new InvalidOperationException("Learner has a conflicting session.");

            session.ScheduleStart = dto.ScheduleStart;
            session.SessionTitle = dto.SessionTitle;
            session.ScheduleEnd = dto.ScheduleEnd;
            session.SkillId = dto.SkillId;
            session.LearnerId = dto.LearnerId;


            session.UpcomingNotificationSent = false;
            session.StartedNotificationSent = false;
            session.EndedNotificationSent = false;

            _sessionRepo.Update(session);
            await _sessionRepo.SaveChangesAsync();

            var teacher = await _userRepo.GetByIdAsync(userId);
            string teacherName = $"{teacher.Fname} {teacher.Lname}";

            var egyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");
            var scheduleStartEgypt = TimeZoneInfo.ConvertTimeFromUtc(dto.ScheduleStart, egyptTimeZone);
            var scheduleEndEgypt = TimeZoneInfo.ConvertTimeFromUtc(dto.ScheduleEnd, egyptTimeZone);

            string updateMessage = $@"
            <p>Your <b>{session.SessionTitle}</b> session  <br> with <b>{teacherName}</b> was updated</p>
            <p>Start: {scheduleStartEgypt:HH:mm} | End: {scheduleEndEgypt:HH:mm}</p>
            <p>Join Zoom: <a href='{session.ZoomJoinUrl}' target='_blank'>Click Here</a></p> <br>
            <p>Hava a good day 🌟</p>";




            await _notificationService.NotifyAsync(
                dto.LearnerId,
                "Session Updated",
                updateMessage,
                "Session",
                session.Sessionid,
                session.ZoomJoinUrl,
                userId
            );

            return true;
        }



        public async Task<bool> DeleteSessionAsync(int sessionId)
        {
            int userId = CurrentUserId();

            var session = await _sessionRepo.Query()
                .Include(s => s.Teacher)
                .Include(s => s.Learner)
                .FirstOrDefaultAsync(s => s.Sessionid == sessionId);

            if (session == null) return false;

            if (session.TeacherId != userId)
                throw new UnauthorizedAccessException("Only the teacher who created the session can delete it.");


            var feedbacks = await _feedbackRepo.Query()
             .Where(f => f.SessionId == sessionId)
             .ToListAsync();

            foreach (var f in feedbacks)
            {
                _feedbackRepo.Remove(f);
            }



            var teacherName = $"{session.Teacher.Fname} {session.Teacher.Lname}";

            var startEgypt = TimeZoneInfo.ConvertTimeFromUtc(session.ScheduleStart, _egyptTimeZone);

            string cancelMessage = $@"
             <p>Your session <b>{session.SessionTitle}</b> with <b>{teacherName}</b> scheduled at {startEgypt:HH:mm} has been cancelled.</p>";



            if (session.Status != "Completed")
            {
                await _notificationService.NotifyAsync(
              session.LearnerId,
              "Session Cancelled",
              cancelMessage,
              "Session",
              session.Sessionid,
              "",
              userId
             );
            }



            _sessionRepo.Remove(session);
            await _sessionRepo.SaveChangesAsync();
            return true;
        }

        public async Task<string> JoinSessionAsync(int sessionId)
        {
            int userId = CurrentUserId();

            var session = await _sessionRepo.Query()
                .Include(s => s.Teacher)
                .Include(s => s.Learner)
                .Include(s => s.Learner.Diamond)
                .Include(s => s.Teacher.Diamond)
                .FirstOrDefaultAsync(s => s.Sessionid == sessionId);

            if (session == null)
                throw new ArgumentException("Session not found.");

            if (DateTime.UtcNow < session.ScheduleStart)
                throw new InvalidOperationException("Session has not started yet.");

            bool isTeacher = (userId == session.TeacherId);
            bool isStudent = (userId == session.LearnerId);

            if (!isTeacher && !isStudent)
                throw new UnauthorizedAccessException("You are not related to this session.");


            if (isTeacher) session.TeacherJoined = true;
            if (isStudent) session.StudentJoined = true;

            if (session.TeacherJoined && session.StudentJoined && !session.PointsApplied)
            {
                session.PointsApplied = true;

                session.Teacher.Diamond.TotalPoints += 20;

                session.Learner.Diamond.TotalPoints -= 20;

                await _diamondTransactionRepo.AddAsync(new DiamondTransaction
                {
                    UserId = session.TeacherId,
                    PointsChanged = +20,
                    Reason = $"Teacher & Student joined session {session.SessionTitle}",
                    Date = DateTime.UtcNow
                });

                await _diamondTransactionRepo.AddAsync(new DiamondTransaction
                {
                    UserId = session.LearnerId,
                    PointsChanged = -20,
                    Reason = $"Teacher & Student joined session {session.SessionTitle}",
                    Date = DateTime.UtcNow
                });
            }

            await _sessionRepo.SaveChangesAsync();

            return session.ZoomJoinUrl;

        }






        private void UpdateSessionStatus(Session session)
        {
            var now = GetNowEgyptTime(); 
            var startEgypt = TimeZoneInfo.ConvertTimeFromUtc(session.ScheduleStart, _egyptTimeZone);
            var endEgypt = TimeZoneInfo.ConvertTimeFromUtc(session.ScheduleEnd, _egyptTimeZone);

            if (now < startEgypt) session.Status = "Scheduled";
            else if (now >= startEgypt && now <= endEgypt) session.Status = "Ongoing";
            else session.Status = "Completed";
        }

    }
}