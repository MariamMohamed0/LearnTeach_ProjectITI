using AutoMapper;
using LearnTeach.Application.Dtos.DiamondOffersDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;

namespace LearnTeach.Application.Services
{
    public class DiamondOffersService : IDiamondOffersService
    {
        private readonly IRepository<DiamondPackage> _repo;
        private readonly IMapper _mapper;

        public DiamondOffersService(IRepository<DiamondPackage> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<DiamondOffersPackageDto> CreateAsync(CreateDiamondOffersPackageDto dto)
        {
            var entity = _mapper.Map<DiamondPackage>(dto);
            await _repo.AddAsync(entity);
            await _repo.SaveChangesAsync();
            return _mapper.Map<DiamondOffersPackageDto>(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity == null) return false;

            _repo.Remove(entity);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<DiamondOffersPackageDto>> GetAllAsync()
        {
            var all = await _repo.GetAllAsync();
            var ordered = all.OrderByDescending(x => x.DiamondPackageId);
            return _mapper.Map<IEnumerable<DiamondOffersPackageDto>>(ordered);
        }

        public async Task<DiamondOffersPackageDto> GetByIdAsync(int id)
        {
            var entity = await _repo.GetByIdAsync(id);
            return _mapper.Map<DiamondOffersPackageDto>(entity);
        }

        public async Task<bool> UpdateAsync(int id, UpdateDiamondOffersPackageDto dto)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity == null) return false;

            _mapper.Map(dto, entity);
            _repo.Update(entity);
            await _repo.SaveChangesAsync();
            return true;
        }
    }
}
