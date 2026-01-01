

using LearnTeach.Application.Dtos.DiamondDtos;

namespace LearnTeach.Application.IServices
{
    public interface IDiamondService
    {
        Task<DiamondPackageDto> AddDiamondPackageAsync(AddDiamondPackageDto dto);
        Task<DiamondPackageDto> UpdateDiamondPackageAsync(int packageId, UpdateDiamondPackageDto dto);
        Task DeleteDiamondPackageAsync(int packageId);

        Task<List<DiamondPackageDto>> GetAllDiamondPackagesAsync();
        Task<DiamondTransactionDto> PurchaseDiamondPackageAsync(PurchaseDiamondPackageDto dto);

        Task<DiamondDto> GetUserPointsAsync(int userId);
        Task<DiamondTransactionDto> AddPointsAsync(AddPointsDto dto);
        Task<DiamondTransactionDto> DeductPointsAsync(DeductPointsDto dto);
        Task<List<DiamondTransactionDto>> GetAllTransactionsAsync(int userId);

        Task CreateDiamondRecordForUser(int userId);

    }
}
