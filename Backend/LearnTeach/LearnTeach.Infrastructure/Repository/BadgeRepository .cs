using LearnTeach.Application.Dtos.Badge_Dtos;
using LearnTeach.Domain.GenericRepo;
using LearnTeach.Domain.Models;
using LearnTeach.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Paymob.Net.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Infrastructure.Repository
{
    public class BadgeRepository : IBadgeRepository
    {
        readonly LEANRANDTEACHContext _context;


        public BadgeRepository(LEANRANDTEACHContext context)
        {
            _context = context;
        }
        public async Task AddBadgeAsync(Badge badge)
        {
            await _context.Badges.AddAsync(badge);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateBadgeAsync(Badge badge)
        {
            _context.Badges.Update(badge);
            await _context.SaveChangesAsync();
        }

        public async Task<double> GetUserAverageRatingAsync(int userId)
        {
            return await _context.Usersessionfeedbacks
                .Where(f => f.RatedToUserId == userId)
                .AverageAsync(f => (double?)f.RatingValue) ?? 0;
        }

        public async Task<Badge?> GetBadgeByRatingAsync(double avgRating)
        {
            return await _context.Badges
                .Where(b => avgRating >= b.MinRating && avgRating <= b.MaxRating)
                .FirstOrDefaultAsync();
        }

        public async Task SaveUserBadgeAsync(int userId, int badgeId)
        {
            var user = await _context.Usersprofiles.FindAsync(userId);
            if (user == null) return;

            user.BadgeId = badgeId;
            _context.Usersprofiles.Update(user);
            await _context.SaveChangesAsync();
        }
        public async Task<Badge> GetUserBadgeAsync(int userId)
        {
            return await _context.Usersprofiles
                .Where(u => u.UserId == userId)
                .Include(u => u.Badge)
                .Select(u => u.Badge)
                .FirstOrDefaultAsync();
        }

        public async Task<UserRatingForBadge> GetUserWithRatingandBadgeAsync(int userId)
        {
            var user = await _context.Usersprofiles
        .Where(u => u.UserId == userId)
        .Select(u => new UserRatingForBadge
        {
            UserId = u.UserId,
            BadgeId = u.BadgeId,
            BadgeName = u.Badge != null ? u.Badge.Name : null,
            AverageRating = u.UsersessionfeedbackRatedToUsers.Any()
                ? u.UsersessionfeedbackRatedToUsers.Average(r => r.RatingValue)
                : 0
        })
        .FirstOrDefaultAsync();

            return user;
        }
    }

}
