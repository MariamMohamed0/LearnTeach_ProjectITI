using LearnTeach.Application.Dtos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.IServices
{
    public interface ICertificateService
    {
        Task<IEnumerable<CertificateDto>> GetAllCertificatesAsync();
        Task DeleteCertificateByAdminAsync(int cerId);
        Task<IEnumerable<CertificateDto>> GetUserCertificatesAsync();
        Task<CertificateDto> CreateCertificateAsync(CertificateUpdateDto dto);
        Task<CertificateDto> UpdateCertificateAsync(int cerId, CertificateUpdateDto certdto);
        Task DeleteCertificateAsync(int cerId);

        Task<IEnumerable<CertificateDto>> GetUserCertificatesAsync(int userId);
        Task<CertificateDto> CreateCertificateAsync(int userId, CertificateUpdateDto dto);
        Task<CertificateDto> UpdateCertificateAsync(int cerId, int userId, CertificateUpdateDto certdto);
        Task DeleteCertificateAsync(int cerId, int userId);
    }

}