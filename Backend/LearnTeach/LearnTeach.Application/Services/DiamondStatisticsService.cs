using LearnTeach.Application.Dtos;
using LearnTeach.Application.Dtos.DiamondStatistics;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.EntityFrameworkCore;

public class AdminDiamondService : IAdminDiamondService
{
    private readonly IRepository<Usersprofile> _userRepo;
    private readonly IRepository<Diamond> _diamondRepo;
    private readonly IRepository<DiamondTransaction> _diamondTransRepo;
    private readonly IRepository<DiamondPackage> _diamondPackageRepo;
    private readonly IRepository<UserDiamondPackage> _userDiamondPackageRepo;
    private readonly IRepository<Paymenttransaction> _paymentRepo;

    public AdminDiamondService(
        IRepository<Usersprofile> userRepo,
        IRepository<Diamond> diamondRepo,
        IRepository<DiamondTransaction> diamondTransRepo,
        IRepository<DiamondPackage> diamondPackageRepo,
        IRepository<UserDiamondPackage> userDiamondPackageRepo,
        IRepository<Paymenttransaction> paymentRepo)
    {
        _userRepo = userRepo;
        _diamondRepo = diamondRepo;
        _diamondTransRepo = diamondTransRepo;
        _diamondPackageRepo = diamondPackageRepo;
        _userDiamondPackageRepo = userDiamondPackageRepo;
        _paymentRepo = paymentRepo;
    }

    // متوسط الماسات لكل مستخدم
    public async Task<DiamondAverageDto> GetAverageDiamondsAsync()
    {
        var diamonds = await _diamondRepo.GetAllAsync();
        var totalDiamonds = diamonds.Sum(d => d.TotalPoints);
        var userCount = diamonds.Select(d => d.UserId).Distinct().Count();

        return new DiamondAverageDto
        {
            AverageDiamonds = userCount > 0 ? (double)totalDiamonds / userCount : 0
        };
    }


    public async Task<DiamondBuyersCountDto> GetBuyersCountAsync()
    {
        var buyers = await _userDiamondPackageRepo.GetAllAsync();
        var uniqueUserCount = buyers.Select(b => b.UserId).Distinct().Count();
        return new DiamondBuyersCountDto { BuyersCount = uniqueUserCount };
    }

    public async Task<TotalUsdDto> GetTotalUsdAsync()
    {
        var payments = await _paymentRepo.GetAllAsync();

        var exchangeRates = new Dictionary<string, decimal>
        {
            { "EGP", 1m / 30m },
            { "USD", 1m }
        };

        decimal totalUsd = 0m;
        foreach (var p in payments)
        {
            if (exchangeRates.TryGetValue(p.Currency, out var rate))
            {
                totalUsd += p.Amount * rate;
            }
        }

        return new TotalUsdDto { TotalUsd = totalUsd };
    }


    public async Task<List<UserDiamondDetailDto>> GetAllUsersDiamondDetailsAsync()
    {
        var users = await _userRepo.GetAllAsync();
        var diamonds = await _diamondRepo.GetAllAsync();
        var result = new List<UserDiamondDetailDto>();

        foreach (var u in users)
        {
            var userDiamond = diamonds.FirstOrDefault(d => d.UserId == u.UserId);
            var transactions = await _diamondTransRepo.FindAsync(dt => dt.UserId == u.UserId);

            var totalBought = transactions.Sum(t => t.PointsChanged);
            var purchasedBefore = transactions.Any();


            var totalUsd = transactions.Sum(t =>
                t.DiamondPackage != null
                    ? (t.DiamondPackage.Currency == "EGP" ? t.DiamondPackage.Price / 30 : t.DiamondPackage.Price)
                    : 0
            );

            var transactionDtos = transactions.Select(t => new DiamondTransactionDto
            {
                Reason = t.Reason,
                PointsChanged = t.PointsChanged,
                Date = t.Date,
                PriceUsd = t.DiamondPackage != null
                    ? (t.DiamondPackage.Currency == "EGP" ? t.DiamondPackage.Price / 30 : t.DiamondPackage.Price)
                    : (decimal?)null
            }).ToList();

            result.Add(new UserDiamondDetailDto
            {
                Username = $"{u.Fname} {u.Lname}",
                CurrentDiamonds = userDiamond?.TotalPoints ?? 0,
                PurchasedBefore = purchasedBefore,
                TotalDiamondBought = totalBought,
                TotalUsd = totalUsd,
                DiamondTransactions = transactionDtos
            });
        }

        return result;
    }
}
