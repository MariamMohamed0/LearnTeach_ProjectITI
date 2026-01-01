using LearnTeach.Application.Dtos;
using LearnTeach.Application.Dtos.PackageDtos;
using LearnTeach.Application.IServices;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PackageController : ControllerBase
    {
        private readonly IPackageService _packageService;

        public PackageController(IPackageService packageService)
        {
            _packageService = packageService;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<PackageDto>>> GetAllPackages()
        {
            var packages = await _packageService.GetAllPackagesAsync();
            return Ok(packages);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PackageDto>> GetPackageById(int id)
        {
            var package = await _packageService.GetPackageByIdAsync(id);
            if (package == null) return NotFound();
            return Ok(package);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<PackageDto>>> GetUserPackages(int userId)
        {
            var packages = await _packageService.GetUserPackagesAsync(userId);
            return Ok(packages);
        }

        [HttpPost("purchase")]
        public async Task<IActionResult> PurchasePackage([FromBody] PurchasePackageDto dto)
        {
            await _packageService.PurchasePackageAsync(dto);
            return Ok(new { message = "Package purchased successfully" });
        }

        [HttpPost("admin")]
        public async Task<ActionResult<PackageDto>> CreatePackage([FromBody] CreatePackageDto dto)
        {
            var package = await _packageService.CreatePackageAsync(dto);
            return CreatedAtAction(nameof(GetPackageById), new { id = package.PackageId }, package);
        }

        [HttpPut("admin/{id}")]
        public async Task<ActionResult<PackageDto>> UpdatePackage(int id, [FromBody] UpdatePackageDto dto)
        {
            var package = await _packageService.UpdatePackageAsync(id, dto);
            return Ok(package);
        }

        [HttpDelete("admin/{id}")]
        public async Task<IActionResult> DeletePackage(int id)
        {
            await _packageService.DeletePackageAsync(id);
            return NoContent();
        }
    }
}
