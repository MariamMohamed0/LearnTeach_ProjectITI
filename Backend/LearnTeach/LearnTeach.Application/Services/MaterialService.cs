using AutoMapper;
using LearnTeach.Application.Dtos.MaterialDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Services
{
    public class MaterialService : IMaterialService
    {
        private readonly IRepository<Material> _repository;
        private readonly IMapper _mapper;

        public MaterialService(IRepository<Material> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<MaterialDto>> GetAllAsync()
        {
            var materials = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<MaterialDto>>(materials);
        }

        public async Task<MaterialDto> GetByIdAsync(int id)
        {
            var material = await _repository.GetByIdAsync(id);
            if (material == null) return null;
            return _mapper.Map<MaterialDto>(material);
        }

        public async Task<MaterialDto> CreateAsync(CreateMaterialDto dto)
        {
            var material = _mapper.Map<Material>(dto);
            await _repository.AddAsync(material);
            await _repository.SaveChangesAsync();
            return _mapper.Map<MaterialDto>(material);
        }

        public async Task<bool> UpdateAsync(int id, UpdateMaterialDto dto)
        {
            var material = await _repository.GetByIdAsync(id);
            if (material == null) return false;

            _mapper.Map(dto, material);
            _repository.Update(material);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var material = await _repository.GetByIdAsync(id);
            if (material == null) return false;

            _repository.Remove(material);
            await _repository.SaveChangesAsync();
            return true;
        }


        public async Task<bool> UpdateFileUrlAsync(int materialId, string fileUrl)
        {
            var material = await _repository.GetByIdAsync(materialId);
            if (material == null) return false;

            material.FileUrl = fileUrl;
            _repository.Update(material);
            await _repository.SaveChangesAsync();
            return true;
        }

    }
}