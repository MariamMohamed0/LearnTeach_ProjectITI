using LearnTeach.Application.Dtos.ProjectDtos;
using LearnTeach.Application.Dtos.SocialMediaDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.IServices
{
    public interface ISocialMediaService
    {
        Task<List<SocialMediaDto>> GetAllSocialAccountsAsync();
        Task<IEnumerable<SocialMediaDto>> GetSocialAccountsByUserAsync(int userId);
        Task<SocialMediaDto> CreateSocialAccountAsync(CreateSocialMediaDto dto);
        Task<bool> UpdateSocialAccountAsync(int id, UpdateSocialMediaDto dto);
        Task<bool> DeleteSocialAccountAsync(int id);
    }
}
