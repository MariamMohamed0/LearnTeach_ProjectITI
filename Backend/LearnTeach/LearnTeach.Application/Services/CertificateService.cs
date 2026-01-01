using AutoMapper;
using LearnTeach.Application.Dtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


namespace LearnTeach.Application.Services
{
    public class CertificateService : ICertificateService
    {
        private readonly IRepository<Certificate> _repo;
        private readonly IAzureService _azureService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _http;
        private readonly IRepository<Usersprofile> _userRepo;
        public CertificateService(IRepository<Certificate> repo, IAzureService azureService, IMapper mapper, IHttpContextAccessor http, IRepository<Usersprofile> userRepo)
        {
            _repo = repo;
            _azureService = azureService;
            _mapper = mapper;
            _http = http;
            _userRepo = userRepo;
        }

        public async Task<IEnumerable<CertificateDto>> GetAllCertificatesAsync()
        {
            var certs = await _repo.GetAllAsync();
            return _mapper.Map<IEnumerable<CertificateDto>>(certs);
        }

        public async Task DeleteCertificateByAdminAsync(int cerId)
        {
            var cert = await _repo.GetByIdAsync(cerId);
            if (cert == null) return;
            await _azureService.DeleteFileAsync(cert.Cerpic);
            _repo.Remove(cert);
            await _repo.SaveChangesAsync();
        }
        public async Task<IEnumerable<CertificateDto>> GetUserCertificatesAsync()
        {
            int userId = CurrentUserId();
            var certs = await _repo.FindAsync(c => c.UserId == userId);
            return _mapper.Map<IEnumerable<CertificateDto>>(certs);
        }

        public async Task<CertificateDto> CreateCertificateAsync(CertificateUpdateDto dto)
        {
            var cert = _mapper.Map<Certificate>(dto);
            cert.UserId = CurrentUserId();   


            cert.Cerpic = await _azureService.UploadCertificateAsync(dto.Cerpic, cert.UserId, cert.Cerid);

            await _repo.AddAsync(cert);
            await _repo.SaveChangesAsync();

            return _mapper.Map<CertificateDto>(cert);
        }

        public async Task<CertificateDto> UpdateCertificateAsync(int cerId, CertificateUpdateDto dto)
        {
            int userId = CurrentUserId();
            var cert = await _repo.GetByIdAsync(cerId);
            if (cert == null || cert.UserId != userId)
                throw new Exception("Certificate not found or access denied");

            _mapper.Map(dto, cert);


            _repo.Update(cert);
            await _repo.SaveChangesAsync();

            return _mapper.Map<CertificateDto>(cert);
        }
        public async Task DeleteCertificateAsync(int id)
        {
            int userId = CurrentUserId();
            var cert = await _repo.GetByIdAsync(id);
            if (cert == null || cert.UserId != userId)
                throw new UnauthorizedAccessException("You can only delete your own certificate.");

            _azureService.DeleteFileAsync(cert.Cerpic);
            _repo.Remove(cert);
            await _repo.SaveChangesAsync();
        }

        private int CurrentUserId()
        {
            var authId = _http.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(authId))
                throw new UnauthorizedAccessException("User not logged in.");

            var user = _userRepo.Query().FirstOrDefault(u => u.Authuserid == authId);
            if (user == null) throw new UnauthorizedAccessException("User profile not found.");

            return user.UserId;
        }

        public async Task<IEnumerable<CertificateDto>> GetUserCertificatesAsync(int userId)
        {
            var certs = await _repo.FindAsync(c => c.UserId == userId);
            return _mapper.Map<IEnumerable<CertificateDto>>(certs);
        }

        public async Task<CertificateDto> CreateCertificateAsync(int userId, CertificateUpdateDto dto)
        {
            var cert = _mapper.Map<Certificate>(dto);
            cert.UserId = userId;   

            cert.Cerpic = await _azureService.UploadCertificateAsync(dto.Cerpic, userId, cert.Cerid);

            await _repo.AddAsync(cert);
            await _repo.SaveChangesAsync();

            return _mapper.Map<CertificateDto>(cert);
        }

        public async Task<CertificateDto> UpdateCertificateAsync(int cerId, int userId, CertificateUpdateDto dto)
        {
            var cert = await _repo.GetByIdAsync(cerId);
            if (cert == null || cert.UserId != userId)
                throw new Exception("Certificate not found or access denied");

            _mapper.Map(dto, cert);

            _repo.Update(cert);
            await _repo.SaveChangesAsync();

            return _mapper.Map<CertificateDto>(cert);
        }
        public async Task DeleteCertificateAsync(int id, int userId)
        {
            var cert = await _repo.GetByIdAsync(id);
            if (cert == null || cert.UserId != userId)
                throw new UnauthorizedAccessException("You can only delete your own certificate.");

            _azureService.DeleteFileAsync(cert.Cerpic);
            _repo.Remove(cert);
            await _repo.SaveChangesAsync();
        }
    }
}