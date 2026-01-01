using LearnTeach.Application.Dtos;
using LearnTeach.Application.Dtos.DiamondStatistics;

public interface IAdminDiamondService
{
    Task<DiamondAverageDto> GetAverageDiamondsAsync();
    Task<DiamondBuyersCountDto> GetBuyersCountAsync();
    Task<TotalUsdDto> GetTotalUsdAsync();
    Task<List<UserDiamondDetailDto>> GetAllUsersDiamondDetailsAsync();
}
