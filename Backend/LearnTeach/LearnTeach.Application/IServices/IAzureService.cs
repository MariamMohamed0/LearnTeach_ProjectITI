using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.IServices
{
    public interface IAzureService
    {
        Task<string> UploadUserProfileAsync (IFormFile file , int userId);
        Task<string> UploadCertificateAsync(IFormFile file, int userId,int certificateId);

        Task<string> UploadProjectFileAsync (IFormFile file, int projectId);

        Task<string> UploadMaterialAsync (IFormFile file, int materialId);

        Task<string> UploadPostMediaAsync(IFormFile fil, int postId);

        Task<String> UploadReportFileAsync (IFormFile file, int reportId);

        Task<Dictionary<string, string>> UploadIdCardAsync(IFormFile frontFile, IFormFile backFile, IFormFile selfieFile, int userId);

        Task<bool> DeleteFileAsync (string blobPath);

        Task<Stream> GetFileAsync (string blobPath);

        Task<(Stream? Stream, string ContentType, string FileName)> DownloadFileAsync(string blobUrl);
    }
}
