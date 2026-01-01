using AutoMapper;
using LearnTeach.Application.Dtos.AdminCertRepotDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearnTeach.Application.Services
{
    public class SkillService : ISkillService
    {
       
        private readonly IRepository<Skill> _skillRepo;
        private readonly IRepository<Usersprofile> _userRepo;
        private readonly IMapper _mapper;
        private readonly IRepository<UserSkills> _userSkillsRepo;


        public SkillService(IRepository<Skill> skillRepo, IRepository<Usersprofile> userRepo, IRepository<UserSkills> userSkillsRepo, IMapper mapper)
        {
            _skillRepo = skillRepo;
            _userRepo = userRepo;
            _userSkillsRepo = userSkillsRepo;
            _mapper = mapper;
        }


        public async Task<IEnumerable<SkillReadDto>> GetAllAsync()
        {
            var skills = await _skillRepo.Query()
                .Include(s => s.Cate)
                .ToListAsync();

            return skills.Select(s => new SkillReadDto
            {
                Id = s.SkillId,
                Name = s.Name,
                CateId = s.CateId ?? 0,
                CategoryName = s.Cate?.Name ?? "N/A"
            }).ToList();
        }

        public async Task<IEnumerable<SkillReadUserDto>> GetAllSkillsAsync(int userId)
        {
            var user = await _userRepo.Query()
                .Include(u => u.UserSkills)
                    .ThenInclude(us => us.Skill)
                        .ThenInclude(s => s.Cate)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
                return new List<SkillReadUserDto>();

            return user.UserSkills.Select(us => new SkillReadUserDto
            {
                Id = us.Skill.SkillId,
                Name = us.Skill.Name,
                GoodAtIt = us.GoodAtIt,
                CateId = us.Skill.CateId ?? 0,
                CategoryName = us.Skill.Cate?.Name ?? "N/A",
                UserId = user.UserId,
                UserName = $"{user.Fname} {user.Lname}"
            }).ToList();
        }

        public async Task UpdateSkillAsync(int skillId, SkillWriteDto skillDto)
        {
            var skill = await _skillRepo.GetByIdAsync(skillId);
            if (skill == null) throw new Exception("Skill not found");

            _mapper.Map(skillDto, skill);
            _skillRepo.Update(skill);
            await _skillRepo.SaveChangesAsync();
        }

        public async Task AddSkillUserAsync(int userId, SkillWriteUserDto skillDto)
        {
            var user = await _userRepo.Query()
                .Include(u => u.UserSkills)
                .FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) throw new Exception("User not found");

            var skill = await _skillRepo.Query()
                .FirstOrDefaultAsync(s => s.Name == skillDto.Name && s.CateId == skillDto.CateId);

            if (skill == null) throw new Exception("Skill not found");

            if (!user.UserSkills.Any(us => us.SkillId == skill.SkillId))
            {
                user.UserSkills.Add(new UserSkills
                {
                    SkillId = skill.SkillId,
                    GoodAtIt = skillDto.GoodAtIt
                });
            }

            _userRepo.Update(user);
            await _userRepo.SaveChangesAsync();
        }

        public async Task UpdateUserSkillAsync(int userId, int skillId, int goodAtIt)
        {
            var user = await _userRepo.Query()
                .Include(u => u.UserSkills)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null) throw new Exception("User not found");

            var userSkill = user.UserSkills.FirstOrDefault(us => us.SkillId == skillId);
            if (userSkill == null) throw new Exception("UserSkill not found");

            userSkill.GoodAtIt = goodAtIt;

            _userRepo.Update(user);
            await _userRepo.SaveChangesAsync();
        }

        public async Task DeleteSkillUserAsync(int skillId, int userId)
        {
            var user = await _userRepo.Query()
                .Include(u => u.UserSkills)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null) throw new Exception("User not found");

            var userSkill = user.UserSkills.FirstOrDefault(us => us.SkillId == skillId);
            if (userSkill != null)
            {
                user.UserSkills.Remove(userSkill);
                _userRepo.Update(user);
                await _userRepo.SaveChangesAsync();
            }
        }

        public async Task<Skill> CreateSkillAsync(SkillWriteDto dto)
        {
            var skill = new Skill { Name = dto.Name, CateId = dto.CateId };
            await _skillRepo.AddAsync(skill);
            await _skillRepo.SaveChangesAsync();
            return skill;
        }

        public async Task DeleteSkillByIdAsync(int skillId)
        {
            var skill = await _skillRepo.GetByIdAsync(skillId);
            if (skill != null)
            {
                _skillRepo.Remove(skill);
                await _skillRepo.SaveChangesAsync();
            }
        }

        public async Task<Skill> UpdateSkillByIdAsync(int skillId, SkillWriteDto dto)
        {
            var skill = await _skillRepo.GetByIdAsync(skillId);
            if (skill == null) throw new Exception("Skill not found");

            skill.Name = dto.Name;
            skill.CateId = dto.CateId;

            _skillRepo.Update(skill);
            await _skillRepo.SaveChangesAsync();

            return skill;
        }
        public async Task<IEnumerable<SkillReadUserDto>> GetAllUserSkillsAsync()
        {
            var allUserSkills = await _userSkillsRepo.Query()
                .Include(us => us.User)
                .Include(us => us.Skill)
                    .ThenInclude(s => s.Cate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<SkillReadUserDto>>(allUserSkills);
        }


    }

}



