using LearnTeach.Application.Dtos;
using LearnTeach.Application.Dtos.UserSessionFeedbackDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.IServices
{
    public interface IUserSessionFeedbackService
    {
        Task<IEnumerable<UserSessionFeedbackResponseDto>> GetAllFeedbacksAsync();

        Task<UserSessionFeedbackResponseDto?> GetFeedbackByIdAsync(int id);

        Task<UserSessionFeedbackResponseDto> CreateFeedbackAsync(CreateUserSessionFeedbackDto createDto);

        Task<UserSessionFeedbackResponseDto?> UpdateFeedbackAsync(int id, UpdateUserSessionFeedbackDto updateDto);

        Task<bool> DeleteFeedbackAsync(int id);

        Task<IEnumerable<UserSessionFeedbackResponseDto>> GetSessionFeedbacksAsync(int sessionId);

        Task<IEnumerable<UserSessionFeedbackResponseDto>> GetUserFeedbacksAsync();

        Task<bool> CanUserGiveFeedbackAsync(int sessionId);

        Task<bool> HasUserGivenFeedbackAsync(int sessionId);

        Task<UserFeedbackStatsDto> GetUserFeedbackStatsAsync(int userId);

        Task<UserRatingResultDto> GetUserAverageRatingAsync(int userId);

        Task<IEnumerable<UserSessionFeedbackLiteDto>> GetFeedbacksRatedToUserAsync();

        Task<IEnumerable<UserSessionFeedbackLiteDto>> GetFeedbacksRatedToUserAsync(int userId);

    }
}