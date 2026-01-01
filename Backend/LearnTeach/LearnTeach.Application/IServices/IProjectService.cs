using LearnTeach.Application.Dtos.ProjectDtos;
using LearnTeach.Application.Dtos.UserProfileDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.IServices
{
    public interface IProjectService
    {
        Task<List<ProjectDto>> GetAllProjectAsync();
        Task<IEnumerable<ProjectDto>> GetProjectsByUserAsync(int userId);
        Task<ProjectDto> CreateProjectAsync(CreateProjectDto dto);
        Task<bool> UpdateProjectAsync(int id, UpdateProjectDto dto);
        Task<bool> DeleteProjectAsync(int id);
    }
}
