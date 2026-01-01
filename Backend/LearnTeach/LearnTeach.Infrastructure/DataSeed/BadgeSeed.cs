using LearnTeach.Domain.Models;
using LearnTeach.Infrastructure.Data;

namespace LearnTeach.Infrastructure.DataSeed
{
    public static class BadgeSeed
    {
        public static async Task SeedBadgesAsync(LEANRANDTEACHContext context)
        {
            if (!context.Badges.Any())
            {
                var badges = new List<Badge>
                {
                new Badge { Name = "Bronze", MinRating = 200, MaxRating = 400, IconUrl="bronze.png"},
                new Badge { Name = "Silver", MinRating = 420, MaxRating = 620, IconUrl="silver.png"},
                new Badge { Name = "Gold", MinRating = 820, MaxRating = 1020, IconUrl="gold.png"},
                new Badge { Name = "Diamond", MinRating = 1040, MaxRating = 99999, IconUrl="diamond.png"}
                };

                await context.Badges.AddRangeAsync(badges);
                await context.SaveChangesAsync();
            }
        }
    }
}
