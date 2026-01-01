using LearnTeach.Application.Dtos;
using LearnTeach.Application.Dtos.UserSessionFeedbackDtos;
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
    public class UserSessionFeedbackService : IUserSessionFeedbackService
    {
        private readonly IRepository<Usersessionfeedback> _feedbackRepository;
        private readonly IRepository<Session> _sessionRepository;
        private readonly IRepository<Usersprofile> _userRepository;
        private readonly INotificationService _notificationService;
        private readonly IHttpContextAccessor _http;

        public UserSessionFeedbackService(
            IRepository<Usersessionfeedback> feedbackRepository,
            IRepository<Session> sessionRepository,
            IRepository<Usersprofile> userRepository,
            INotificationService notificationService,
            IHttpContextAccessor http)
        {
            _feedbackRepository = feedbackRepository;
            _sessionRepository = sessionRepository;
            _userRepository = userRepository;
            _notificationService = notificationService;
            _http = http;
        }

        private int CurrentUserId()
        {
            var authId = _http.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(authId))
                throw new UnauthorizedAccessException("User not logged in.");

            var user = _userRepository.Query().FirstOrDefault(u => u.Authuserid == authId);
            if (user == null) throw new UnauthorizedAccessException("User profile not found.");

            return user.UserId;
        }

        public async Task<IEnumerable<UserSessionFeedbackResponseDto>> GetAllFeedbacksAsync()
        {
            var feedbacks = await _feedbackRepository.Query()
                .Include(f => f.RatedByUser)
                .Include(f => f.RatedToUser)
                .Include(f => f.Session).ThenInclude(s => s.Skill)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            return feedbacks.Select(MapToDto);
        }

        public async Task<UserSessionFeedbackResponseDto?> GetFeedbackByIdAsync(int id)
        {
            var feedback = await _feedbackRepository.Query()
                .Include(f => f.RatedByUser)
                .Include(f => f.RatedToUser)
                .Include(f => f.Session).ThenInclude(s => s.Skill)
                .FirstOrDefaultAsync(f => f.FeedbackId == id);

            return feedback != null ? MapToDto(feedback) : null;
        }

        public async Task<UserSessionFeedbackResponseDto> CreateFeedbackAsync(CreateUserSessionFeedbackDto createDto)
        {
            int currentUserId = CurrentUserId();

            var session = await _sessionRepository.Query()
                .Include(s => s.Teacher)
                .Include(s => s.Learner)
                .Include(s => s.Skill)
                .FirstOrDefaultAsync(s => s.Sessionid == createDto.SessionId);

            if (session == null)
                throw new ArgumentException("الجلسة غير موجودة");

            if (!await CanUserGiveFeedbackAsync(createDto.SessionId, currentUserId))
                throw new UnauthorizedAccessException("غير مسموح لك بتقييم هذه الجلسة");

            if (await HasUserGivenFeedbackAsync(createDto.SessionId, currentUserId))
                throw new InvalidOperationException("لقد قيمت هذه الجلسة مسبقاً");

            int ratedToUserId = currentUserId == session.TeacherId ? session.LearnerId : session.TeacherId;

            var feedback = new Usersessionfeedback
            {
                RatingValue = createDto.RatingValue,
                Comment = createDto.Comment,
                RatedByUserId = currentUserId,
                RatedToUserId = ratedToUserId,
                SessionId = createDto.SessionId,
                CreatedAt = DateTime.UtcNow
            };

            await _feedbackRepository.AddAsync(feedback);
            await _feedbackRepository.SaveChangesAsync();

            // إرسال إشعار للمستلم
            var rater = currentUserId == session.TeacherId ? session.Teacher : session.Learner;
            var ratedUser = currentUserId == session.TeacherId ? session.Learner : session.Teacher;

            string title = "تم استلام تقييم لك في الجلسة";
            string body = $"{rater.Fname} {rater.Lname} قيّمك في الجلسة '{session.SessionTitle}' بـ {feedback.RatingValue} نجوم." +
                          (!string.IsNullOrEmpty(feedback.Comment) ? $" تعليق: {feedback.Comment}" : "");



            await _notificationService.NotifyAsync(
                ratedUser.UserId,
                title,
                body,
                "Feedback",
                session.Sessionid,
                "",
                currentUserId
            );

            return await GetFeedbackByIdAsync(feedback.FeedbackId) ?? throw new Exception("Feedback creation failed.");
        }

        // ==================== تحديث تقييم ====================
        public async Task<UserSessionFeedbackResponseDto?> UpdateFeedbackAsync(int id, UpdateUserSessionFeedbackDto updateDto)
        {
            int currentUserId = CurrentUserId();
            var feedback = await _feedbackRepository.GetByIdAsync(id);
            if (feedback == null) return null;

            if (feedback.RatedByUserId != currentUserId)
                throw new UnauthorizedAccessException("يمكنك فقط تعديل تقييماتك الخاصة");

            if (updateDto.RatingValue.HasValue)
            {
                if (updateDto.RatingValue < 1 || updateDto.RatingValue > 5)
                    throw new ArgumentException("RatingValue يجب أن يكون بين 1 و5");

                feedback.RatingValue = updateDto.RatingValue.Value;
            }

            if (!string.IsNullOrEmpty(updateDto.Comment))
                feedback.Comment = updateDto.Comment;

            _feedbackRepository.Update(feedback);
            await _feedbackRepository.SaveChangesAsync();



            // بعد حفظ التعديلات بنجاح

            var session = await _sessionRepository.Query()
                .Include(s => s.Teacher)
                .Include(s => s.Learner)
                .FirstOrDefaultAsync(s => s.Sessionid == feedback.SessionId);

            var ratedUser = feedback.RatedToUserId == session.TeacherId ? session.Teacher : session.Learner;
            var rater = feedback.RatedByUserId == session.TeacherId ? session.Teacher : session.Learner;

           

            string title = " Feedback Updated";
            string body = $"{rater.Fname} {rater.Lname} قيّمك في الجلسة '{session.SessionTitle}' بـ {feedback.RatingValue} نجوم." +
                          (!string.IsNullOrEmpty(feedback.Comment) ? $" تعليق: {feedback.Comment}" : "");
            await _notificationService.NotifyAsync(
                ratedUser.UserId,
                title,
                body,
                "Feedback",
                session.Sessionid,
                "",
                currentUserId
            );




            return await GetFeedbackByIdAsync(id);
        }

        public async Task<bool> DeleteFeedbackAsync(int id)
        {
            int currentUserId = CurrentUserId();
            var feedback = await _feedbackRepository.GetByIdAsync(id);
            if (feedback == null) return false;

            if (feedback.RatedByUserId != currentUserId)
                throw new UnauthorizedAccessException("يمكنك فقط حذف تقييماتك الخاصة");


            var session = await _sessionRepository.Query()
            .Include(s => s.Teacher)
            .Include(s => s.Learner)
            .FirstOrDefaultAsync(s => s.Sessionid == feedback.SessionId);

            var ratedUser = feedback.RatedToUserId == session.TeacherId ? session.Teacher : session.Learner;
            var rater = feedback.RatedByUserId == session.TeacherId ? session.Teacher : session.Learner;

            string title = " Feedback Deleted";
            string body = $"{rater.Fname} {rater.Lname} deleted their rating for your session '{session.SessionTitle}' ";
                         


            await _notificationService.NotifyAsync(
                ratedUser.UserId,
                title,
                body,
                "Feedback",
                session.Sessionid,
                "",
                currentUserId
            );



            _feedbackRepository.Remove(feedback);
            await _feedbackRepository.SaveChangesAsync();
            return true;
        }


        public async Task<IEnumerable<UserSessionFeedbackResponseDto>> GetUserFeedbacksAsync()
        {
            int currentUserId = CurrentUserId();
            var feedbacks = await _feedbackRepository.Query()
                .Include(f => f.RatedByUser)
                .Include(f => f.RatedToUser)
                .Include(f => f.Session).ThenInclude(s => s.Skill)
                .Where(f => f.RatedToUserId == currentUserId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            return feedbacks.Select(MapToDto);
        }


        public async Task<IEnumerable<UserSessionFeedbackResponseDto>> GetSessionFeedbacksAsync(int sessionId)
        {
            var feedbacks = await _feedbackRepository.Query()
                .Include(f => f.RatedByUser)
                .Include(f => f.RatedToUser)
                .Include(f => f.Session).ThenInclude(s => s.Skill)
                .Where(f => f.SessionId == sessionId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            return feedbacks.Select(MapToDto);
        }

        public async Task<bool> CanUserGiveFeedbackAsync(int sessionId)
        {
            int currentUserId = CurrentUserId();
            var session = await _sessionRepository.GetByIdAsync(sessionId);
            return session != null && (session.TeacherId == currentUserId || session.LearnerId == currentUserId);
        }


        public async Task<bool> HasUserGivenFeedbackAsync(int sessionId)
        {
            int currentUserId = CurrentUserId();
            return await _feedbackRepository.Query()
                .AnyAsync(f => f.SessionId == sessionId && f.RatedByUserId == currentUserId);
        }


        public async Task<UserFeedbackStatsDto> GetUserFeedbackStatsAsync(int userId)
        {
            var feedbacks = await _feedbackRepository.Query()
                .Where(f => f.RatedToUserId == userId)
                .ToListAsync();

            if (!feedbacks.Any())
            {
                return new UserFeedbackStatsDto
                {
                    UserId = userId,
                    AverageRating = 0,
                    TotalFeedbacks = 0,
                    FiveStarRatings = 0,
                    FourStarRatings = 0,
                    ThreeStarRatings = 0,
                    TwoStarRatings = 0,
                    OneStarRatings = 0
                };
            }

            return new UserFeedbackStatsDto
            {
                UserId = userId,
                AverageRating = feedbacks.Average(f => f.RatingValue),
                TotalFeedbacks = feedbacks.Count,
                FiveStarRatings = feedbacks.Count(f => f.RatingValue == 5),
                FourStarRatings = feedbacks.Count(f => f.RatingValue == 4),
                ThreeStarRatings = feedbacks.Count(f => f.RatingValue == 3),
                TwoStarRatings = feedbacks.Count(f => f.RatingValue == 2),
                OneStarRatings = feedbacks.Count(f => f.RatingValue == 1)
            };
        }
        public async Task<UserRatingResultDto> GetUserAverageRatingAsync(int userId)
        {
            var feedbacks = await _feedbackRepository.Query()
                .Where(f => f.RatedToUserId == userId)
                .ToListAsync();

            double average = 0;
            if (feedbacks.Any())
            {
                average = Math.Round(feedbacks.Average(f => f.RatingValue), 1);
            }

            var badgeData = GetBadgeByRating(average);

            return new UserRatingResultDto
            {
                Rating = average,
                Badge = badgeData.Badge,
                BadgeUrl = badgeData.BadgeUrl
            };
        }

        public async Task<IEnumerable<UserSessionFeedbackLiteDto>> GetFeedbacksRatedToUserAsync()
        {
            int userId = CurrentUserId();

            var feedbacks = await _feedbackRepository.Query()
                .Include(f => f.RatedByUser)
                .Include(f => f.Session).ThenInclude(s => s.Skill)
                .Where(f => f.RatedToUserId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            return feedbacks.Select(f => new UserSessionFeedbackLiteDto
            {
                RatedByUserName = f.RatedByUser.Fname+" "+ f.RatedByUser.Lname ,
                RatingValue = f.RatingValue,
                Comment = f.Comment,
                SessionInfo = f.Session.SessionTitle
            });
        }

        public async Task<IEnumerable<UserSessionFeedbackLiteDto>> GetFeedbacksRatedToUserAsync(int userId)
        {

            var feedbacks = await _feedbackRepository.Query()
                .Include(f => f.RatedByUser)
                .Include(f => f.Session).ThenInclude(s => s.Skill)
                .Where(f => f.RatedToUserId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            return feedbacks.Select(f => new UserSessionFeedbackLiteDto
            {
                RatedByUserName = f.RatedByUser.Fname + " " + f.RatedByUser.Lname,
                RatingValue = f.RatingValue,
                Comment = f.Comment,
                SessionInfo = f.Session.SessionTitle
            });
        }



        public async Task<bool> CanUserGiveFeedbackAsync(int sessionId, int userId)
        {
            var session = await _sessionRepository.GetByIdAsync(sessionId);
            return session != null && (session.TeacherId == userId || session.LearnerId == userId);
        }

        public async Task<bool> HasUserGivenFeedbackAsync(int sessionId, int userId)
        {
            return await _feedbackRepository.Query()
                .AnyAsync(f => f.SessionId == sessionId && f.RatedByUserId == userId);
        }





        private static UserSessionFeedbackResponseDto MapToDto(Usersessionfeedback feedback)
        {
            return new UserSessionFeedbackResponseDto
            {
                FeedbackId = feedback.FeedbackId,
                RatingValue = feedback.RatingValue,
                Comment = feedback.Comment,
                RatedByUserId = feedback.RatedByUserId,
                RatedByUserName = $"{feedback.RatedByUser?.Fname ?? "Unknown"} {feedback.RatedByUser?.Lname ?? ""}".Trim(),
                RatedToUserId = feedback.RatedToUserId,
                RatedToUserName = $"{feedback.RatedToUser?.Fname ?? "Unknown"} {feedback.RatedToUser?.Lname ?? ""}".Trim(),
                SessionId = feedback.SessionId,
                SessionInfo = $"جلسة #{feedback.Session?.Sessionid ?? 0} - {feedback.Session?.Skill?.Name ?? "Unknown Skill"}",
                CreatedAt = feedback.CreatedAt
            };
        }


        private const string GoldBadgeUrl = "https://stlearnteach2.blob.core.windows.net/badges/gold.jpg";
        private const string SilverBadgeUrl = "https://stlearnteach2.blob.core.windows.net/badges/silver.jpg";
        private const string BronzeBadgeUrl = "https://stlearnteach2.blob.core.windows.net/badges/Bronze.jpg";
        private const string NoBadgeUrl = "https://stlearnteach2.blob.core.windows.net/badges/no.svg";

        private (string Badge, string BadgeUrl) GetBadgeByRating(double rating)
        {
            if (rating >= 4.5)
                return ("Gold", GoldBadgeUrl);

            if (rating >= 3.5)
                return ("Silver", SilverBadgeUrl);

            if (rating > 0)
                return ("Bronze", BronzeBadgeUrl);

            return ("NoRating", NoBadgeUrl);
        }




    }
}