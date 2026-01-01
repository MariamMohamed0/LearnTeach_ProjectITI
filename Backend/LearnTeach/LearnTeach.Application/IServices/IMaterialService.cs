using LearnTeach.Application.Dtos.MaterialDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.IServices
{
    public interface IMaterialService
    {
        Task<IEnumerable<MaterialDto>> GetAllAsync();
        Task<MaterialDto> GetByIdAsync(int id);
        Task<MaterialDto> CreateAsync(CreateMaterialDto dto);
        Task<bool> UpdateAsync(int id, UpdateMaterialDto dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> UpdateFileUrlAsync(int materialId, string fileUrl);

    }
}
