using LearnTeach.Application.Dtos.Badge_Dtos;
using LearnTeach.Application.Dtos.UserSessionFeedbackDtos;
using LearnTeach.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.IServices
{
    public interface IBadgeService
    {
        Task<bool> AddBadge(BadgeDto dto);
        Task<bool> UpdateBadge(int id, BadgeDto dto);
        Task<UserBadgeResultDto> AssignBadgeToUser(int userId);
        Task<UserRatingForBadge?> GetUserRatingAndBadge(int userId);



    }
}
