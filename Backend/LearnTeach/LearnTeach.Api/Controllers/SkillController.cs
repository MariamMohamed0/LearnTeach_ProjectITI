using LearnTeach.Application.Dtos.AdminCertRepotDtos;
using LearnTeach.Application.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillController : ControllerBase
    {
      
        private readonly ISkillService _skillService;

        public SkillController(ISkillService skillService)
        {
            _skillService = skillService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var skills = await _skillService.GetAllAsync();
            return Ok(skills);
        }

        [HttpGet("user-skills")]
        public async Task<IActionResult> GetAllUserSkills()
        {
            var userSkills = await _skillService.GetAllUserSkillsAsync();
            return Ok(userSkills);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetSkillsByUserId(int userId)
        {
            var skills = await _skillService.GetAllSkillsAsync(userId);
            if (skills == null || !skills.Any())
                return NotFound($"No skills found for user with ID {userId}");
            return Ok(skills);
        }

        [HttpPost("{userId}")]
        public async Task<IActionResult> AddSkill(int userId, [FromBody] SkillWriteUserDto dto)
        {
            if (dto == null)
                return BadRequest("Skill data is required.");

            await _skillService.AddSkillUserAsync(userId, dto);
            return Ok("Skill added successfully.");
        }


        [HttpPut("{skillId}/{userId}")]
        public async Task<IActionResult> UpdateSkill(int skillId, int userId, [FromBody] SkillWriteDto dto)
        {
            if (dto == null)
                return BadRequest("Skill data is required.");

            await _skillService.UpdateSkillAsync(skillId, dto);
            return Ok($"{dto.Name} skill updated successfully.");
        }

        [HttpDelete("{skillId}/{userId}")]
        public async Task<IActionResult> DeleteSkill(int skillId, int userId)
        {
            await _skillService.DeleteSkillUserAsync(skillId, userId);
            return Ok($"Skill with Id {skillId} deleted successfully for user {userId}.");
        }

        [HttpPost]
        public async Task<IActionResult> CreateSkill([FromBody] SkillWriteDto dto)
        {
            var skill = await _skillService.CreateSkillAsync(dto);
            return Ok(skill);
        }

        [HttpPut("{skillId}")]
        public async Task<IActionResult> UpdateSkillById(int skillId, [FromBody] SkillWriteDto dto)
        {
            var updatedSkill = await _skillService.UpdateSkillByIdAsync(skillId, dto);
            return Ok(updatedSkill);
        }

        [HttpDelete("{skillId}")]
        public async Task<IActionResult> DeleteSkillById(int skillId)
        {
            await _skillService.DeleteSkillByIdAsync(skillId);
            return Ok($"Skill with Id {skillId} deleted successfully.");
        }


    }

}

