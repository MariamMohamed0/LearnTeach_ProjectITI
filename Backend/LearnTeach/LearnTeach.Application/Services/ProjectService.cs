using AutoMapper;
using LearnTeach.Application.Dtos.ProjectDtos;
using LearnTeach.Application.Dtos.UserProfileDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Services
{
    public class ProjectService : IProjectService
    {
            private readonly IRepository<Project> _projectRepository;
            private readonly IMapper _mapper;

            public ProjectService(IRepository<Project> projectRepository, IMapper mapper)
            {
                _projectRepository = projectRepository;
                _mapper = mapper;
            }
        public async Task<List<ProjectDto>> GetAllProjectAsync()
        {
            var projects = await _projectRepository.GetAllAsync();
            return _mapper.Map<List<ProjectDto>>(projects);
        }
        public async Task<IEnumerable<ProjectDto>> GetProjectsByUserAsync(int userId)
            {
                var projects = await _projectRepository.FindAsync(p => p.UserId == userId);
                return _mapper.Map<IEnumerable<ProjectDto>>(projects);
            }

            public async Task<ProjectDto> CreateProjectAsync(CreateProjectDto dto)
            {
                var project = _mapper.Map<Project>(dto);
                await _projectRepository.AddAsync(project);
                await _projectRepository.SaveChangesAsync();
                return _mapper.Map<ProjectDto>(project);
            }

            public async Task<bool> UpdateProjectAsync(int id, UpdateProjectDto dto)
            {
                var existing = await _projectRepository.GetByIdAsync(id);
                if (existing == null) return false;

                _mapper.Map(dto, existing);
                _projectRepository.Update(existing);
                await _projectRepository.SaveChangesAsync();
                return true;
            }

            public async Task<bool> DeleteProjectAsync(int id)
            {
                var existing = await _projectRepository.GetByIdAsync(id);
                if (existing == null) return false;

                _projectRepository.Remove(existing);
                await _projectRepository.SaveChangesAsync();
                return true;
            }
        }
    }