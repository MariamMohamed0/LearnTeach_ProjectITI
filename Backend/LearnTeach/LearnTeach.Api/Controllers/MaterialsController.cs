using LearnTeach.Application.Dtos.MaterialDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaterialsController : ControllerBase
    {
        private readonly IMaterialService _service;
        private readonly IAzureService _azureService;

        public MaterialsController(IMaterialService service, IAzureService azureService)
        {
            _service = service;
            _azureService = azureService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var materials = await _service.GetAllAsync();
            return Ok(materials);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var material = await _service.GetByIdAsync(id);
            if (material == null) return NotFound();
            return Ok(material);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateMaterialDto dto, IFormFile file)
        {
            var newMaterial = await _service.CreateAsync(dto);

            string fileUrl = null;
            if (file != null)
            {
                fileUrl = await _azureService.UploadMaterialAsync(file, newMaterial.Materialid);
                await _service.UpdateFileUrlAsync(newMaterial.Materialid, fileUrl);
            }

            return Ok(new
            {
                Message = "Material created successfully.",
                Material = newMaterial,
                FileUrl = fileUrl
            });
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateMaterialDto dto, IFormFile? file)
        {
            var material = await _service.GetByIdAsync(id);
            if (material == null) return NotFound();

            await _service.UpdateAsync(id, dto);

            string newFileUrl = material.FileUrl;

            if (file != null)
            {
             
                if (!string.IsNullOrEmpty(material.FileUrl))
                {
                    await _azureService.DeleteFileAsync(material.FileUrl);
                }

            
                newFileUrl = await _azureService.UploadMaterialAsync(file, id);

           
                await _service.UpdateFileUrlAsync(id, newFileUrl);
            }

            return Ok(new
            {
                Message = "Material updated successfully.",
                FileUrl = newFileUrl
            });
        }


    }
}
