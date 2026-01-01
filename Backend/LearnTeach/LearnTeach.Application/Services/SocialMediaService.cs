using AutoMapper;
using LearnTeach.Application.Dtos.ProjectDtos;
using LearnTeach.Application.Dtos.SocialMediaDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Services
{
    public class SocialMediaService : ISocialMediaService
    {
        private readonly IRepository<Socialmediaaccount> _repository;
        private readonly IMapper _mapper;

        public SocialMediaService(IRepository<Socialmediaaccount> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<List<SocialMediaDto>> GetAllSocialAccountsAsync()
        {
            var accounts = await _repository.GetAllAsync();
            return _mapper.Map<List<SocialMediaDto>>(accounts);
        }
        public async Task<IEnumerable<SocialMediaDto>> GetSocialAccountsByUserAsync(int userId)
        {
            var accounts = await _repository.FindAsync(a => a.UserId == userId);
            return _mapper.Map<IEnumerable<SocialMediaDto>>(accounts);
        }

        public async Task<SocialMediaDto> CreateSocialAccountAsync(CreateSocialMediaDto dto)
        {
            var account = _mapper.Map<Socialmediaaccount>(dto);
            await _repository.AddAsync(account);
            await _repository.SaveChangesAsync();
            return _mapper.Map<SocialMediaDto>(account);
        }

        public async Task<bool> UpdateSocialAccountAsync(int id, UpdateSocialMediaDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return false;

            _mapper.Map(dto, existing);
            _repository.Update(existing);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteSocialAccountAsync(int id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return false;

            _repository.Remove(existing);
            await _repository.SaveChangesAsync();
            return true;
        }
    }
}