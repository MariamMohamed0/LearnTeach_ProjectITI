using AutoMapper;
using LearnTeach.Application.Dtos.DiamondDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;

namespace LearnTeach.Application.Services
{
    public class DiamondService : IDiamondService
    {
        private readonly IRepository<Diamond> _diamondRepository;
        private readonly IRepository<DiamondTransaction> _diamondTransactionRepository;
        private readonly IRepository<DiamondPackage> _diamondPackageRepository;
        private readonly IRepository<UserDiamondPackage> _userDiamondPackageRepository;
        private readonly IMapper _mapper;

        public DiamondService(
            IRepository<Diamond> diamondRepository,
            IRepository<DiamondTransaction> diamondTransactionRepository,
            IRepository<DiamondPackage> diamondPackageRepository,
            IRepository<UserDiamondPackage> userDiamondPackageRepository,
            IMapper mapper
            )

        {
            _diamondRepository = diamondRepository;
            _diamondTransactionRepository = diamondTransactionRepository;
            _diamondPackageRepository = diamondPackageRepository;
            _userDiamondPackageRepository = userDiamondPackageRepository;
            _mapper = mapper;
        }

        public async Task<DiamondPackageDto> AddDiamondPackageAsync(AddDiamondPackageDto dto)
        {
            var package = _mapper.Map<DiamondPackage>(dto);
            await _diamondPackageRepository.AddAsync(package);
            await _diamondPackageRepository.SaveChangesAsync();
            return _mapper.Map<DiamondPackageDto>(package);
        }

        public async Task<DiamondPackageDto> UpdateDiamondPackageAsync(int packageId, UpdateDiamondPackageDto dto)
        {
            var package = await _diamondPackageRepository.GetByIdAsync(packageId);
            if (package == null)
                throw new KeyNotFoundException("Diamond package not found.");

            package.Title = dto.Title;
            package.DiamondAmount = dto.DiamondAmount;
            package.Price = dto.Price;
            package.Currency = dto.Currency;

            _diamondPackageRepository.Update(package);
            await _diamondPackageRepository.SaveChangesAsync();

            return _mapper.Map<DiamondPackageDto>(package);
        }

        public async Task DeleteDiamondPackageAsync(int packageId)
        {
            var package = await _diamondPackageRepository.GetByIdAsync(packageId);
            if (package == null)
                throw new KeyNotFoundException("Diamond package not found.");

            var relatedTransactions = await _diamondTransactionRepository.FindAsync(t => t.DiamondPackageId == packageId);
            if (relatedTransactions.Any())
                _diamondTransactionRepository.RemoveRange(relatedTransactions);

            var relatedUserPackages = await _userDiamondPackageRepository.FindAsync(up => up.DiamondPackageId == packageId);
            if (relatedUserPackages.Any())
                _userDiamondPackageRepository.RemoveRange(relatedUserPackages);

            _diamondPackageRepository.Remove(package);
            await _diamondTransactionRepository.SaveChangesAsync();
            await _userDiamondPackageRepository.SaveChangesAsync();
            await _diamondPackageRepository.SaveChangesAsync();
        }

        public async Task<List<DiamondPackageDto>> GetAllDiamondPackagesAsync()
        {
            var packages = await _diamondPackageRepository.GetAllAsync();
            return _mapper.Map<List<DiamondPackageDto>>(packages);
        }
        public async Task<DiamondTransactionDto> PurchaseDiamondPackageAsync(PurchaseDiamondPackageDto dto)
        {
            var userDiamond = (await _diamondRepository.FindAsync(d => d.UserId == dto.UserId)).FirstOrDefault();
            var package = await _diamondPackageRepository.GetByIdAsync(dto.DiamondPackageId);

            if (package == null)
                throw new KeyNotFoundException("Package not found.");

            if (userDiamond == null)
            {
                userDiamond = new Diamond
                {
                    UserId = dto.UserId,
                    TotalPoints = 0,
                    LastUpdated = DateTime.Now
                };
                await _diamondRepository.AddAsync(userDiamond);
            }
            var userPackage = new UserDiamondPackage
            {
                UserId = dto.UserId,
                DiamondPackageId = dto.DiamondPackageId,
                PurchasedAt = DateTime.Now
            };
            await _userDiamondPackageRepository.AddAsync(userPackage);

            userDiamond.TotalPoints += package.DiamondAmount;
            userDiamond.LastUpdated = DateTime.Now;
            _diamondRepository.Update(userDiamond);

            var transaction = new DiamondTransaction
            {
                UserId = dto.UserId,
                DiamondPackageId = dto.DiamondPackageId,
                PointsChanged = package.DiamondAmount,
                Reason = $"Purchased package: {package.Title}",
                Date = DateTime.Now
            };
            await _diamondTransactionRepository.AddAsync(transaction);

            await _diamondRepository.SaveChangesAsync();
            await _diamondTransactionRepository.SaveChangesAsync();
            await _userDiamondPackageRepository.SaveChangesAsync();

            return _mapper.Map<DiamondTransactionDto>(transaction);
        }

        public async Task<DiamondDto> GetUserPointsAsync(int userId)
        {
            var diamond = (await _diamondRepository.FindAsync(d => d.UserId == userId)).FirstOrDefault();
            if (diamond == null)
                throw new KeyNotFoundException("User not found or no diamond record.");

            return _mapper.Map<DiamondDto>(diamond);
        }

        public async Task<DiamondTransactionDto> AddPointsAsync(AddPointsDto dto)
        {
            var diamond = (await _diamondRepository.FindAsync(d => d.UserId == dto.UserId)).FirstOrDefault();
            if (diamond == null)
                throw new KeyNotFoundException("User not found.");

            diamond.TotalPoints += dto.Points;
            diamond.LastUpdated = DateTime.Now;
            _diamondRepository.Update(diamond);

            var transaction = _mapper.Map<DiamondTransaction>(dto);
            transaction.PointsChanged = dto.Points;
            transaction.Reason = "Admin added points";
            transaction.Date = DateTime.Now;

            await _diamondTransactionRepository.AddAsync(transaction);
            await _diamondRepository.SaveChangesAsync();
            await _diamondTransactionRepository.SaveChangesAsync();

            return _mapper.Map<DiamondTransactionDto>(transaction);
        }

        public async Task<DiamondTransactionDto> DeductPointsAsync(DeductPointsDto dto)
        {
            var diamond = (await _diamondRepository.FindAsync(d => d.UserId == dto.UserId)).FirstOrDefault();
            if (diamond == null)
                throw new KeyNotFoundException("User not found.");

            if (diamond.TotalPoints < dto.Points)
                throw new InvalidOperationException("Not enough diamond points.");

            diamond.TotalPoints -= dto.Points;
            diamond.LastUpdated = DateTime.Now;
            _diamondRepository.Update(diamond);

            var transaction = _mapper.Map<DiamondTransaction>(dto);
            transaction.PointsChanged = -dto.Points;
            transaction.Reason = "Points deducted";
            transaction.Date = DateTime.Now;

            await _diamondTransactionRepository.AddAsync(transaction);
            await _diamondRepository.SaveChangesAsync();
            await _diamondTransactionRepository.SaveChangesAsync();

            return _mapper.Map<DiamondTransactionDto>(transaction);
        }

        public async Task<List<DiamondTransactionDto>> GetAllTransactionsAsync(int userId)
        {
            var transactions = await _diamondTransactionRepository.FindAsync(t => t.UserId == userId);
            return _mapper.Map<List<DiamondTransactionDto>>(transactions);
        }

        public async Task CreateDiamondRecordForUser(int userId)
        {
            var existing = (await _diamondRepository.FindAsync(d => d.UserId == userId)).FirstOrDefault();
            if (existing != null)
                return; 

            var diamond = new Diamond
            {
                UserId = userId,
                TotalPoints = 100,
                LastUpdated = DateTime.UtcNow
            };

            await _diamondRepository.AddAsync(diamond);
            await _diamondRepository.SaveChangesAsync();
        }

    }
}
