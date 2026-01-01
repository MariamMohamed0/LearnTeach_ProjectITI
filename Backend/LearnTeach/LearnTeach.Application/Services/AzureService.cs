using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using LearnTeach.Application.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace LearnTeach.Application.Services
{
    public class AzureService : IAzureService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly IConfiguration _configuration;

        private readonly string[] _allowedImageTypes = { ".jpg", ".jpeg", ".png", ".gif" };
        private readonly string[] _allowedDocumentTypes = { ".pdf", ".pptx", ".docx", ".zip", ".mp4" };

        public AzureService(IConfiguration configuration)
        {
            _configuration = configuration;
            string connectionString = _configuration["AzureBlobStorage:ConnectionString"];
            _blobServiceClient = new BlobServiceClient(connectionString);
        }

        #region Generic Upload
        private async Task<string> UploadAsync(IFormFile file, string blobContainer, string folderPath, string fileName, string[] allowedExtensions)
        {
            if (file == null || file.Length == 0)
                throw new Exception("No file provided.");

            string ext = Path.GetExtension(file.FileName).ToLower();
            if (!allowedExtensions.Contains(ext))
                throw new Exception($"Invalid file type. Allowed: {string.Join(", ", allowedExtensions)}");

            var containerClient = _blobServiceClient.GetBlobContainerClient(blobContainer);
            await containerClient.CreateIfNotExistsAsync();
            await containerClient.SetAccessPolicyAsync(PublicAccessType.Blob);

            string blobPath = string.IsNullOrEmpty(folderPath) ? fileName : $"{folderPath}/{fileName}";
            var blobClient = containerClient.GetBlobClient(blobPath);

            using var stream = file.OpenReadStream();
            var headers = new BlobHttpHeaders { ContentType = GetMimeType(file.FileName) };

          
            await blobClient.DeleteIfExistsAsync();
            await blobClient.UploadAsync(stream, new BlobUploadOptions { HttpHeaders = headers });

            return blobClient.Uri.AbsoluteUri;
        }

        #endregion

        #region Upload Methods
        public Task<string> UploadUserProfileAsync(IFormFile file, int userId)
        {
            string fileName = $"user_{userId}_profile{Path.GetExtension(file.FileName)}";
            return UploadAsync(file, "profile-pics", $"Users/{userId}", fileName, _allowedImageTypes);
        }

        public Task<string> UploadCertificateAsync(IFormFile file, int userId, int certificateId)
        {
            string fileName = $"certificate_{certificateId}{Path.GetExtension(file.FileName)}";
            return UploadAsync(file, "certificates", $"Users/{userId}/Certificates", fileName, _allowedDocumentTypes.Concat(_allowedImageTypes).ToArray());
        }

        public Task<string> UploadProjectFileAsync(IFormFile file, int projectId)
        {
            string fileName = $"project_{projectId}{Path.GetExtension(file.FileName)}";
            return UploadAsync(file, "projects", $"Projects/{projectId}", fileName, _allowedDocumentTypes);
        }

        public Task<string> UploadMaterialAsync(IFormFile file, int materialId)
        {
            string fileName = $"material_{materialId}{Path.GetExtension(file.FileName)}";
            return UploadAsync(file, "materials", $"Materials/{materialId}", fileName, _allowedDocumentTypes);
        }

        public Task<string> UploadPostMediaAsync(IFormFile file, int postId)
        {
            string fileName = $"post_{postId}_media{Path.GetExtension(file.FileName)}";
            return UploadAsync(file, "posts-media", $"Posts /{postId}", fileName, _allowedImageTypes.Concat(new[] { ".mp4" }).ToArray());
        }

        public async Task<Dictionary<string, string>> UploadIdCardAsync( IFormFile frontFile,IFormFile backFile,IFormFile selfieFile,int userId)
        {
            var result = new Dictionary<string, string>();

            string containerName = "id-cards";
            string folderPath = $"Users/{userId}/ID";

            if (frontFile != null)
            {
                string fileName = $"id_front{Path.GetExtension(frontFile.FileName)}";
                string url = await UploadAsync(frontFile, containerName, folderPath, fileName, _allowedImageTypes);
                result["front"] = url;
            }

            if (backFile != null)
            {
                string fileName = $"id_back{Path.GetExtension(backFile.FileName)}";
                string url = await UploadAsync(backFile, containerName, folderPath, fileName, _allowedImageTypes);
                result["back"] = url;
            }

            if (selfieFile != null)
            {
                string fileName = $"id_selfie{Path.GetExtension(selfieFile.FileName)}";
                string url = await UploadAsync(selfieFile, containerName, folderPath, fileName, _allowedImageTypes);
                result["selfie"] = url;
            }

            return result;
        }


        public Task<string> UploadReportFileAsync(IFormFile file, int reportId)
        {
            string fileName = $"report_{reportId}{Path.GetExtension(file.FileName)}";
            return UploadAsync(file, "reports", $"Reports/{reportId}", fileName, _allowedDocumentTypes.Concat(_allowedImageTypes).ToArray());
        }
        #endregion

        #region Delete / Get
        public async Task<bool> DeleteFileAsync(string blobUrl)
        {
            if (string.IsNullOrWhiteSpace(blobUrl))
                return false;

            var uri = new Uri(blobUrl);
            string containerName = uri.Segments[1].TrimEnd('/');
            string blobName = string.Join("", uri.Segments.Skip(2));

            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(blobName);

            return await blobClient.DeleteIfExistsAsync();
        }

        public async Task<Stream> GetFileAsync(string blobUrl)
        {
            if (string.IsNullOrWhiteSpace(blobUrl))
                throw new Exception("Invalid blob path.");

            var uri = new Uri(blobUrl);
            string containerName = uri.Segments[1].TrimEnd('/');
            string blobName = string.Join("", uri.Segments.Skip(2));

            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(blobName);

            var response = await blobClient.DownloadAsync();
            return response.Value.Content;
        }
        #endregion

        #region Helper
        private static string GetMimeType(string fileName)
        {
            string ext = Path.GetExtension(fileName).ToLower();
            return ext switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".pdf" => "application/pdf",
                ".mp4" => "video/mp4",
                ".pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".zip" => "application/zip",
                _ => "application/octet-stream"
            };
        }

        public BlobServiceClient GetBlobServiceClient()
        {
            return _blobServiceClient;
        }

        #endregion

        #region download
        public async Task<(Stream? Stream, string ContentType, string FileName)> DownloadFileAsync(string blobUrl)
        {
            if (string.IsNullOrWhiteSpace(blobUrl))
                return (null, string.Empty, string.Empty);

            try
            {
                var uri = new Uri(blobUrl);
                string containerName = uri.Segments[1].TrimEnd('/');
                string blobName = string.Join("", uri.Segments.Skip(2));

                var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
                var blobClient = containerClient.GetBlobClient(blobName);

                var response = await blobClient.DownloadAsync();

                string fileName = Path.GetFileName(blobName);
                string contentType = GetMimeType(fileName);

                return (response.Value.Content, contentType, fileName);
            }
            catch
            {
                return (null, string.Empty, string.Empty);
            }
        }

        #endregion 
    }
}
