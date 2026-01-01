using AutoMapper.Execution;
using LearnTeach.Application.Dtos.PremiumStatisticsDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;

namespace LearnTeach.Application.Services
{
    public class PremiumDashboardService : IPremiumDashboardService
    {
        private readonly IRepository<PremiumSubscriber> _premiumRepo;
        private readonly IRepository<UserPayment> _paymentRepo;
        private readonly IRepository<Usersprofile> _userRepo;
        private readonly IRepository<Package> _packageRepo;
        private readonly decimal _exchangeRate; 

        public PremiumDashboardService(
            IRepository<PremiumSubscriber> premiumRepo,
            IRepository<UserPayment> paymentRepo,
            IRepository<Usersprofile> userRepo,
            IRepository<Package> packageRepo)
        {
            _premiumRepo = premiumRepo;
            _paymentRepo = paymentRepo;
            _userRepo = userRepo;
            _packageRepo = packageRepo;
            _exchangeRate = 47.85m;
        }

        public async Task<PremiumSummaryDto> GetSummaryAsync()
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var allPremiums = await _premiumRepo.GetAllAsync();
            var allPackages = await _packageRepo.GetAllAsync();

            var totalUsers = allPremiums.Select(p => p.UserId).Distinct().Count();

            var activeSubscriptions = allPremiums.Count(p => p.StartDate <= today && p.EndDate >= today);

            decimal totalRevenue = 0m;

            foreach (var subscription in allPremiums)
            {
                var package = allPackages.FirstOrDefault(pkg => pkg.Packageid == subscription.PackageId);
                if (package == null)
                    continue;

                decimal price = package.Packageprice;

                price /= _exchangeRate;

                totalRevenue += price;
            }

            return new PremiumSummaryDto
            {
                TotalUsers = totalUsers,
                ActiveSubscriptions = activeSubscriptions,
                TotalRevenue = totalRevenue
            };
        }

        public async Task<PremiumDistributionDto> GetDistributionAsync()
        {
            var allPremiums = await _premiumRepo.GetAllAsync();
            var allPackages = await _packageRepo.GetAllAsync();
            var joined = from sub in allPremiums
                         join pkg in allPackages
                         on sub.PackageId equals pkg.Packageid
                         select pkg.Packagename;

            var silverMembers = joined.Count(name => name == "Silver");
            var goldMembers = joined.Count(name => name == "Gold");
            var platinumMembers = joined.Count(name => name == "Platinum");

            var totalUsers = allPremiums
                .Select(p => p.UserId)
                .Distinct()
                .Count();

            return new PremiumDistributionDto
            {
                SilverMembers = silverMembers,
                GoldMembers = goldMembers,
                PlatinumMembers = platinumMembers,
            };
        }

        public async Task<List<PremiumUserDto>> GetUsersAsync()
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var allPremiums = await _premiumRepo.GetAllAsync();
            var allUsers = await _userRepo.GetAllAsync();
            var allPackages = await _packageRepo.GetAllAsync();
            var allPayments = await _paymentRepo.GetAllAsync();

            var result = new List<PremiumUserDto>();

            foreach (var subscription in allPremiums)
            {
                var user = allUsers.FirstOrDefault(u => u.UserId == subscription.UserId);
                var package = allPackages.FirstOrDefault(pkg => pkg.Packageid == subscription.PackageId);

                var diamonds = package?.Diamondpoints ?? 0;

                var totalPaid = (package?.Packageprice ?? 0) / _exchangeRate;
                var status =
                    subscription.EndDate < today ? "Expired" :
                    subscription.StartDate > today ? "Upcoming" :
                    "Active";

                result.Add(new PremiumUserDto
                {
                    Username = user != null ? $"{user.Fname} {user.Lname}" : "Unknown",
                    SubscriptionPlan = package?.Packagename ?? "Unknown",
                    StartDate = subscription.StartDate,
                    EndDate = subscription.EndDate,
                    Status = status,
                    TotalPaid = totalPaid,
                    Diamonds = diamonds
                });
            }

            return result;
        }


    }
}
