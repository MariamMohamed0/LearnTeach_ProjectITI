using LearnTeach.Application.Dtos.AdminCertRepotDtos;
using LearnTeach.Domain.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LearnTeach.Application.IServices
{
    public interface ISkillService
    {

        Task<IEnumerable<SkillReadDto>> GetAllAsync();
        Task<IEnumerable<SkillReadUserDto>> GetAllSkillsAsync(int userId);
        Task AddSkillUserAsync(int userId, SkillWriteUserDto skillDto);
        Task UpdateSkillAsync(int skillId, SkillWriteDto skillDto);
        Task UpdateUserSkillAsync(int userId, int skillId, int goodAtIt);
        Task DeleteSkillUserAsync(int skillId, int userId);

        Task<Skill> CreateSkillAsync(SkillWriteDto dto);
        Task<Skill> UpdateSkillByIdAsync(int skillId, SkillWriteDto dto);
        Task DeleteSkillByIdAsync(int skillId);
        Task<IEnumerable<SkillReadUserDto>> GetAllUserSkillsAsync();


    }


}
