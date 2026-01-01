using AutoMapper;
using LearnTeach.Application.Dtos;
using LearnTeach.Application.Dtos.UserProfileDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Services
{
    public class UserProfileService : IUserProfileService
    {
        private readonly IRepository<Usersprofile> _profileRepository;
        private readonly IMapper _mapper;

        public UserProfileService(IRepository<Usersprofile> profileRepository, IMapper mapper)
        {
            _profileRepository = profileRepository;
            _mapper = mapper;
        }
        public async Task<List<UserProfileDto>> GetAllProfilesAsync()
        {
            var profiles = await _profileRepository.GetAllAsync();
            return _mapper.Map<List<UserProfileDto>>(profiles);
        }


        public async Task<bool> CreateProfileAsync(UserProfileDto profile)
        {
            var entity = _mapper.Map<Usersprofile>(profile);
            await _profileRepository.AddAsync(entity);
            await _profileRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteProfileAsync(int id)
        {
            var profile = await _profileRepository.GetByIdAsync(id);
            if (profile == null)
                return false;

            _profileRepository.Remove(profile);
            await _profileRepository.SaveChangesAsync();
            return true;
        }


        public async Task<UserProfileDto> GetProfileAsync(int id)
        {
            var profile = await _profileRepository.GetByIdAsync(id);
            if (profile == null)
                return null;

            return _mapper.Map<UserProfileDto>(profile);
        }

        public async Task<bool> UpdateProfileAsync(int id, UpdateUserProfileDto dto)
        {
            var profile = await _profileRepository.GetByIdAsync(id);
            if (profile == null)
                return false;

            _mapper.Map(dto, profile);
            _profileRepository.Update(profile); 
            await _profileRepository.SaveChangesAsync();
            return true;
        }
        public async Task<bool> UpdateProfileEntityAsync(UserProfileDto profile)
        {
            var existingProfile = await _profileRepository.GetByIdAsync(profile.UserId);
            if (existingProfile == null) return false;

           
            existingProfile.Fname = profile.Fname;
            existingProfile.Lname = profile.Lname;
            existingProfile.ExperienceText = profile.ExperienceText;
            existingProfile.ProfilePic = profile.ProfilePic;

            _profileRepository.Update(existingProfile);
            await _profileRepository.SaveChangesAsync();

            return true;
        }

        public Task<int> GetUserDiamonds(int id)
        {
            throw new NotImplementedException();
        }
    }
}