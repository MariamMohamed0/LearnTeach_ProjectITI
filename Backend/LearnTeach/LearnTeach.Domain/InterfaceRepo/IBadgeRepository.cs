
using LearnTeach.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Domain.GenericRepo
{
    public interface IBadgeRepository
    {
            Task AddBadgeAsync(Badge badge);
            Task UpdateBadgeAsync(Badge badge);
            Task<Badge?> GetBadgeByRatingAsync(double avgRating);
            Task SaveUserBadgeAsync(int userId, int badgeId);
            Task<double> GetUserAverageRatingAsync(int userId);
            Task<Badge> GetUserBadgeAsync(int userId);
            Task<UserRatingForBadge> GetUserWithRatingandBadgeAsync(int userId);



    }

}
