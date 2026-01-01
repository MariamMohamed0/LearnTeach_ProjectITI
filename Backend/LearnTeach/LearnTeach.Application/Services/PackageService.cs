using AutoMapper;
using LearnTeach.Application.Dtos.PackageDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace LearnTeach.Application.Services
{
    public class PackageService : IPackageService
    {
        private readonly IRepository<Package> _packageRepository;
        private readonly IRepository<PremiumSubscriber> _premiumSubscriberRepository;
        private readonly IRepository<Usersprofile> _userRepository;
        private readonly IRepository<Diamond> _diamondRepository;
        private readonly IRepository<UserPayment> _userPaymentRepository;
        private readonly IRepository<Paymenttransaction> _paymentRepository;
        private readonly IRepository<DiamondTransaction> _diamondTransactionRepository;
        private readonly IMapper _mapper;

        public PackageService(
            IRepository<Package> packageRepository,
            IRepository<PremiumSubscriber> premiumSubscriberRepository,
            IRepository<Usersprofile> userRepository,
            IRepository<Diamond> diamondRepository,
            IRepository<UserPayment> userPaymentRepository,
            IRepository<Paymenttransaction> paymentRepository,
            IRepository<DiamondTransaction> diamondTransactionRepository,
            IMapper mapper)
        {
            _packageRepository = packageRepository;
            _premiumSubscriberRepository = premiumSubscriberRepository;
            _userRepository = userRepository;
            _diamondRepository = diamondRepository;
            _userPaymentRepository = userPaymentRepository;
            _paymentRepository = paymentRepository;
            _diamondTransactionRepository = diamondTransactionRepository;
            _mapper = mapper;
        }


        public async Task<IEnumerable<PackageDto>> GetAllPackagesAsync()
        {
            var packages = await _packageRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<PackageDto>>(packages);
        }

        public async Task<PackageDto> GetPackageByIdAsync(int packageId)
        {
            var package = await _packageRepository.GetByIdAsync(packageId);
            return _mapper.Map<PackageDto>(package);
        }

        public async Task<IEnumerable<PackageDto>> GetUserPackagesAsync(int userId)
        {
            var userSubscriptions = await _premiumSubscriberRepository
                .FindAsync(ps => ps.UserId == userId);

            var packages = new List<PackageDto>();

            foreach (var sub in userSubscriptions)
            {
                var package = await _packageRepository.GetByIdAsync(sub.PackageId);
                if (package != null)
                {
                    packages.Add(new PackageDto
                    {
                        PackageId = package.Packageid,
                        PackageName = package.Packagename,
                        PackageDetails = package.Packagedetails,
                        PackageDuration = package.Packageduration,
                        PackagePrice = package.Packageprice,
                        DiamondPoints = package.Diamondpoints,
                        StartDate = sub.StartDate,
                        EndDate = sub.EndDate,
                        SubscribedAt = sub.SubscribedAt
                    });
                }
            }

            return packages;
        }

     
        public async Task PurchasePackageAsync(PurchasePackageDto dto)
        {

            var user = await _userRepository.GetByIdAsync(dto.UserId);
            var package = await _packageRepository.GetByIdAsync(dto.PackageId);

            if (user == null || package == null)
                throw new KeyNotFoundException("User or Package not found");

            var subscription = new PremiumSubscriber
            {
                UserId = user.UserId,
                PackageId = package.Packageid,
                StartDate = DateOnly.FromDateTime(DateTime.Now),
                EndDate = DateOnly.FromDateTime(DateTime.Now.AddMonths(GetNumberFromString(package.Packageduration))),
                SubscribedAt = DateOnly.FromDateTime(DateTime.Now)
            };
            await _premiumSubscriberRepository.AddAsync(subscription);
            var diamond = (await _diamondRepository.FindAsync(d => d.UserId == user.UserId)).FirstOrDefault();
            diamond.TotalPoints += package.Diamondpoints;
            diamond.LastUpdated = DateTime.Now;
            _diamondRepository.Update(diamond);
            var transaction = new DiamondTransaction
            {
                UserId = user.UserId,
                PointsChanged = package.Diamondpoints,
                Reason = $"Purchased package: {package.Packagename}",
                Date = DateTime.Now
            };
            await _diamondTransactionRepository.AddAsync(transaction);
            await _premiumSubscriberRepository.SaveChangesAsync();
            await _diamondRepository.SaveChangesAsync();
            await _diamondTransactionRepository.SaveChangesAsync();
        }

        private int GetNumberFromString(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return 0;

            var match = System.Text.RegularExpressions.Regex.Match(text, @"\d+");

            if (match.Success)
                return int.Parse(match.Value);

            return 0;
        }
        private int GetPackageDurationMonths(string duration)
        {
            if (duration.Contains("Month"))
            {
                var value = duration.Split(' ')[0];
                return int.TryParse(value, out int months) ? months : 1;
            }
            return 1;
        }


        public async Task<PackageDto> CreatePackageAsync(CreatePackageDto dto)
        {
            var package = _mapper.Map<Package>(dto);
            await _packageRepository.AddAsync(package);
            await _packageRepository.SaveChangesAsync();
            return _mapper.Map<PackageDto>(package);
        }

        public async Task<PackageDto> UpdatePackageAsync(int id, UpdatePackageDto dto)
        {
            var package = await _packageRepository.GetByIdAsync(id);
            if (package == null)
                throw new KeyNotFoundException("Package not found");

            _mapper.Map(dto, package);
            _packageRepository.Update(package);
            await _packageRepository.SaveChangesAsync();
            return _mapper.Map<PackageDto>(package);
        }

        public async Task DeletePackageAsync(int id)
        {
            var package = await _packageRepository.GetByIdAsync(id);
            if (package == null)
                throw new KeyNotFoundException("Package not found");

            _packageRepository.Remove(package);
            await _packageRepository.SaveChangesAsync();
        }
    }
}
