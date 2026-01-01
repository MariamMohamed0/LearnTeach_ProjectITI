using LearnTeach.Application.Dtos;
using LearnTeach.Application.Dtos.UserProfileDtos;
using LearnTeach.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.IServices
{
    public interface IUserProfileService
    {
        Task<List<UserProfileDto>> GetAllProfilesAsync();

        Task<UserProfileDto> GetProfileAsync(int id);
        Task<bool> UpdateProfileAsync(int id, UpdateUserProfileDto dto);
        Task<bool> UpdateProfileEntityAsync(UserProfileDto profile);
        Task<bool> CreateProfileAsync(UserProfileDto profile);
        Task<bool> DeleteProfileAsync(int id);
        Task<int> GetUserDiamonds(int id);

    }

}
