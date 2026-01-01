using LearnTeach.Application.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AzureController : ControllerBase
    {
        private readonly IAzureService _azureService;

        public AzureController(IAzureService azureService)
        {
            _azureService = azureService;
        }
        [HttpPost("upload-profile")]
        public async Task<IActionResult> UploadUserProfile(IFormFile file, int userId)
        {
            var url = await _azureService.UploadUserProfileAsync(file, userId);
            return Ok(new { Url = url });
        }

        [HttpPost("upload-certificate")]
        public async Task<IActionResult> UploadCertificate(IFormFile file, int userId, int certificateId)
        {
            var url = await _azureService.UploadCertificateAsync(file, userId, certificateId);
            return Ok(new { Url = url });
        }

 
        [HttpPost("upload-project")]
        public async Task<IActionResult> UploadProject(IFormFile file, int projectId)
        {
            var url = await _azureService.UploadProjectFileAsync(file, projectId);
            return Ok(new { Url = url });
        }

        [HttpPost("upload-material")]
        public async Task<IActionResult> UploadMaterial(IFormFile file, int materialId)
        {
            var url = await _azureService.UploadMaterialAsync(file, materialId);
            return Ok(new { Url = url });
        }

        [HttpPost("upload-post")]
        public async Task<IActionResult> UploadPost(IFormFile file, int postId)
        {
            var url = await _azureService.UploadPostMediaAsync(file, postId);
            return Ok(new { Url = url });
        }

  
        [HttpPost("upload-id")]
        public async Task<IActionResult> UploadIdCards(IFormFile frontFile,IFormFile backFile,IFormFile selfieFile,int userId)
        {
            var urls = await _azureService.UploadIdCardAsync(frontFile, backFile, selfieFile, userId);
            return Ok(urls);
        }
        [HttpPost("reupload-material")]
        public async Task<IActionResult> ReuploadMaterial(IFormFile newFile, int materialId, string oldFileUrl)
        {
            if (newFile == null)
                return BadRequest("New file is required.");
            if (!string.IsNullOrEmpty(oldFileUrl))
            {
                bool deleted = await _azureService.DeleteFileAsync(oldFileUrl);
                if (!deleted)
                    return BadRequest("Failed to delete the old file from Azure.");
            }

            string newFileUrl = await _azureService.UploadMaterialAsync(newFile, materialId);
            return Ok(new
            {
                Message = "File replaced successfully",
                NewFileUrl = newFileUrl
            });
        }
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteFile(string url)
        {
            bool result = await _azureService.DeleteFileAsync(url);
            return result ? Ok("File deleted successfully.") : NotFound("File not found.");
        }

        [HttpGet("download")]
        public async Task<IActionResult> DownloadFile(string url)
        {
            var result = await _azureService.DownloadFileAsync(url);

            if (result.Stream == null)
                return BadRequest("Invalid file URL or file not found.");

            return File(result.Stream, result.ContentType, result.FileName);
        }
    }
}
