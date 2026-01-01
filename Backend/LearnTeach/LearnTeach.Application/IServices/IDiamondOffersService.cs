using LearnTeach.Application.Dtos.DiamondOffersDtos;
namespace LearnTeach.Application.IServices
{
    public interface IDiamondOffersService
    {
        Task<IEnumerable<DiamondOffersPackageDto>> GetAllAsync();
        Task<DiamondOffersPackageDto> GetByIdAsync(int id);
        Task<DiamondOffersPackageDto> CreateAsync(CreateDiamondOffersPackageDto dto);
        Task<bool> UpdateAsync(int id, UpdateDiamondOffersPackageDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
