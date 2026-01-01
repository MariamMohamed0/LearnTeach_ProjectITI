using LearnTeach.Application.Dtos;
using LearnTeach.Application.Dtos.PackageDtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LearnTeach.Application.IServices
{
    public interface IPackageService
    {
        Task<IEnumerable<PackageDto>> GetAllPackagesAsync();
        Task<PackageDto> GetPackageByIdAsync(int packageId);
        Task<IEnumerable<PackageDto>> GetUserPackagesAsync(int userId);
        Task PurchasePackageAsync(PurchasePackageDto dto);

        Task<PackageDto> CreatePackageAsync(CreatePackageDto dto);
        Task<PackageDto> UpdatePackageAsync(int id, UpdatePackageDto dto);
        Task DeletePackageAsync(int id);
    }
}
