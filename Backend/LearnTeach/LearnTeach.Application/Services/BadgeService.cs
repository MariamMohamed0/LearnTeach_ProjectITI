using AutoMapper;
using LearnTeach.Application.Dtos.Badge_Dtos;
using LearnTeach.Application.Dtos.UserSessionFeedbackDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.GenericRepo;
using LearnTeach.Domain.Models;
using LearnTeach.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LearnTeach.Application.Services
{
    public class BadgeService : IBadgeService
    {
        private readonly IBadgeRepository _repo;


        
        public BadgeService(IBadgeRepository badgeRepo)
        {
            _repo = badgeRepo;
        }

        public async Task<bool> AddBadge(BadgeDto dto)
        {
            var badge = new Badge
            {
                Name = dto.Name,
                MinRating = dto.MinRating,
                MaxRating = dto.MaxRating
            };
            await _repo.AddBadgeAsync(badge);
            return true;
        }

        public async Task<bool> UpdateBadge(int id, BadgeDto dto)
        {
            var badge = new Badge
            {
                Id = id,
                Name = dto.Name,
                MinRating = dto.MinRating,
                MaxRating = dto.MaxRating
            };
             await _repo.UpdateBadgeAsync(badge);
            return true;
        }

        public async Task<UserBadgeResultDto> AssignBadgeToUser(int userId)
        {
            double avgRating = await _repo.GetUserAverageRatingAsync(userId);

            var badge = await _repo.GetBadgeByRatingAsync(avgRating);

            if (badge != null)
                await _repo.SaveUserBadgeAsync(userId, badge.Id);

            return new UserBadgeResultDto
            {
                UserId = userId,
                BadgeName = badge?.Name,
                AverageRating = avgRating
            };
        }
        public async Task<UserRatingForBadge?> GetUserRatingAndBadge(int userId)
        {
            return await _repo.GetUserWithRatingandBadgeAsync(userId);
        }

    }

}
