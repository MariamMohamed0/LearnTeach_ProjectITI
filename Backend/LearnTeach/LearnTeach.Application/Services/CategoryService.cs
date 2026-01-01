using AutoMapper;
using LearnTeach.Application.Dtos.CategoryDtos;
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
    public class CategoryService : ICategoryService
    {
        private readonly IRepository<Categoriess> _categoryRepository;
        private readonly IMapper _mapper;

        public CategoryService(IRepository<Categoriess> categoryRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<CategoryDto>>(categories);
        }
        public async Task<IEnumerable<CategoryDto>> GetCategoryAsync(int CateId)
        {
            var category = await _categoryRepository.FindAsync(a => a.CateId == CateId);
            return _mapper.Map<IEnumerable<CategoryDto>>(category);
        }
        public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
        {
            var category = _mapper.Map<Categoriess>(dto);
            await _categoryRepository.AddAsync(category);
            await _categoryRepository.SaveChangesAsync();

            return _mapper.Map<CategoryDto>(category);
        }

        public async Task<bool> UpdateAsync(int id, UpdateCategoryDto dto)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
                return false;

            _mapper.Map(dto, category);
            _categoryRepository.Update(category);
            await _categoryRepository.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
                return false;

            _categoryRepository.Remove(category);
            await _categoryRepository.SaveChangesAsync();

            return true;
        }
    }
}