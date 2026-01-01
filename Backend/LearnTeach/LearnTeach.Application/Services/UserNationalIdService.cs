using LearnTeach.Application.Dtos.NationalIdDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Interfaceses.Authentication;
using LearnTeach.Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LearnTeach.Application.Services
{
    public class UserNationalIdService : IUserNationalIdService
    {
        private readonly IUserManagement _userManagement;
        private readonly IRepository<Usernationalid> _nationalIdRepository;
        private readonly IRepository<Usersprofile> _userRepository;
        private readonly IAzureService _azureService;
        private readonly INotificationService _notificationService;
        private readonly IHttpContextAccessor _http;
        private readonly IRepository<Usersprofile> _userRepo;

        public UserNationalIdService(
            IRepository<Usernationalid> nationalIdRepository,
            IRepository<Usersprofile> userRepository,
            IAzureService azureService,
            INotificationService notificationService,
            IRepository<Usersprofile> userRepo,
             IHttpContextAccessor http,
             IUserManagement userManagement)
        {
            _nationalIdRepository = nationalIdRepository;
            _userRepository = userRepository;
            _azureService = azureService;
            _notificationService = notificationService;
            _userRepo = userRepo;
            _http = http;
            _userManagement = userManagement;
        }

        public async Task<UserNationalIdResponseDto?> GetByUserIdAsync(int userId)
        {
            var nationalId = await _nationalIdRepository.Query()
                .Include(n => n.User)
                .FirstOrDefaultAsync(n => n.UserId == userId);

            return nationalId != null ? MapToDto(nationalId) : null;
        }

        public async Task<UserNationalIdResponseDto?> GetByIdAsync(int id)
        {
            var nationalId = await _nationalIdRepository.Query()
                .Include(n => n.User)
                .FirstOrDefaultAsync(n => n.Id == id);

            return nationalId != null ? MapToDto(nationalId) : null;
        }

        // ========== USER CREATE ==========
        public async Task<UserNationalIdResponseDto> CreateAsync(int userId, CreateUserNationalIdDto createDto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) throw new ArgumentException("User not found");

            var existing = await GetByUserIdAsync(userId);
            if (existing != null)
                throw new InvalidOperationException("User already has national ID record");

            var uploaded = await _azureService.UploadIdCardAsync(
                createDto.FrontPic,
                createDto.BackPic,
                createDto.SelfieWithId,
                userId
            );

            var nationalId = new Usernationalid
            {
                UserId = userId,
                FrontPic = uploaded["front"],
                BackPic = uploaded["back"],
                SelfieWithId = uploaded["selfie"],
                VerificationStatus = "Pending",
                SubmittedAt = DateTime.UtcNow
            };

            await _nationalIdRepository.AddAsync(nationalId);
            await _nationalIdRepository.SaveChangesAsync();

            return MapToDto(nationalId);
        }


        public async Task<UserNationalIdResponseDto?> UpdateByUserAsync(int userId, UpdateUserNationalIdDto updateDto)
        {
            var nationalId = await _nationalIdRepository.Query()
                .FirstOrDefaultAsync(n => n.UserId == userId);

            if (nationalId == null) return null;

            if (updateDto.FrontPic != null)
            {
                if (!string.IsNullOrEmpty(nationalId.FrontPic))
                    await _azureService.DeleteFileAsync(nationalId.FrontPic);

                var file = await _azureService.UploadIdCardAsync(updateDto.FrontPic, null, null, userId);
                nationalId.FrontPic = file["front"];
                ResetVerificationStatus(nationalId);
            }

            if (updateDto.BackPic != null)
            {
                if (!string.IsNullOrEmpty(nationalId.BackPic))
                    await _azureService.DeleteFileAsync(nationalId.BackPic);

                var file = await _azureService.UploadIdCardAsync(null, updateDto.BackPic, null, userId);
                nationalId.BackPic = file["back"];
                ResetVerificationStatus(nationalId);
            }

            if (updateDto.SelfieWithId != null)
            {
                if (!string.IsNullOrEmpty(nationalId.SelfieWithId))
                    await _azureService.DeleteFileAsync(nationalId.SelfieWithId);

                var file = await _azureService.UploadIdCardAsync(null, null, updateDto.SelfieWithId, userId);
                nationalId.SelfieWithId = file["selfie"];
                ResetVerificationStatus(nationalId);
            }

            _nationalIdRepository.Update(nationalId);
            await _nationalIdRepository.SaveChangesAsync();

            return MapToDto(nationalId);
        }


        public async Task<bool> DeleteAsync(int id)
        {
            var nationalId = await _nationalIdRepository.GetByIdAsync(id);
            if (nationalId == null) return false;

            if (!string.IsNullOrEmpty(nationalId.FrontPic))
                await _azureService.DeleteFileAsync(nationalId.FrontPic);

            if (!string.IsNullOrEmpty(nationalId.BackPic))
                await _azureService.DeleteFileAsync(nationalId.BackPic);

            if (!string.IsNullOrEmpty(nationalId.SelfieWithId))
                await _azureService.DeleteFileAsync(nationalId.SelfieWithId);

            _nationalIdRepository.Remove(nationalId);
            await _nationalIdRepository.SaveChangesAsync();

            return true;
        }


        public async Task<bool> VerifyNationalIdAsync(int id)
        {
            var nationalId = await _nationalIdRepository.GetByIdAsync(id);
            if (nationalId == null) return false;

            nationalId.VerificationStatus = "Approved";
            nationalId.ReviewedAt = DateTime.UtcNow;
            nationalId.RejectionReason = null;

            _nationalIdRepository.Update(nationalId);
            await _nationalIdRepository.SaveChangesAsync();

            await _notificationService.NotifyAsync(
                nationalId.UserId,
                "National ID Approved",
                "Your National ID has been approved by the admin.",
                "NationalId",
                nationalId.Id,
                null,
                null
            );

            return true;
        }


        //public async Task<bool> RejectNationalIdAsync(int id, string reason)
        //{
        //    var nationalId = await _nationalIdRepository.GetByIdAsync(id);
        //    if (nationalId == null) return false;

        //    nationalId.VerificationStatus = "Rejected";
        //    nationalId.ReviewedAt = DateTime.UtcNow;
        //    nationalId.RejectionReason = reason;

        //    _nationalIdRepository.Update(nationalId);
        //    await _nationalIdRepository.SaveChangesAsync();


        //    await _notificationService.NotifyAsync(
        //        nationalId.UserId,
        //        "National ID Rejected",
        //        $"Your National ID was rejected: {reason} ! ,So Please Upload it again",
        //        "NationalId",
        //        nationalId.Id,
        //        null,
        //        null
        //    );

        //    return true;
        //}

        public async Task<bool> RejectNationalIdAsync(int id, string reason)
        {
            var nationalId = await _nationalIdRepository.GetByIdAsync(id);
            if (nationalId == null) return false;

            // 🔥 احذف الصور من Azure
            if (!string.IsNullOrEmpty(nationalId.FrontPic))
                await _azureService.DeleteFileAsync(nationalId.FrontPic);

            if (!string.IsNullOrEmpty(nationalId.BackPic))
                await _azureService.DeleteFileAsync(nationalId.BackPic);

            if (!string.IsNullOrEmpty(nationalId.SelfieWithId))
                await _azureService.DeleteFileAsync(nationalId.SelfieWithId);

            // 🔥 احذف الـ Row من DB
            _nationalIdRepository.Remove(nationalId);
            await _nationalIdRepository.SaveChangesAsync();

            // 🔔 بعدها ابعتي Notification أن الرفض حصل ولازم يعيد الرفع
            await _notificationService.NotifyAsync(
                nationalId.UserId,
                "National ID Rejected",
                $"Your National ID was rejected: {reason}! Please upload it again.",
                "NationalId",
                null,
                null,
                null
            );

            return true;
        }


        public async Task<IEnumerable<UserNationalIdResponseDto>> GetPendingVerificationsAsync()
        {
            var nationalIds = await _nationalIdRepository.Query()
                .Include(n => n.User)
                .Where(n => n.VerificationStatus == "Pending")
                .OrderBy(n => n.SubmittedAt)
                .ToListAsync();

            return nationalIds.Select(MapToDto);
        }

        public async Task<UserNationalIdVerificationDto> GetVerificationStatusAsync(int userId)
        {
            var nationalId = await GetByUserIdAsync(userId);

            return new UserNationalIdVerificationDto
            {
                UserId = userId,
                IsVerified = nationalId?.VerificationStatus == "Approved",
                VerificationStatus = nationalId?.VerificationStatus ?? "Not Submitted",
                SubmittedAt = nationalId?.SubmittedAt,
                ReviewedAt = nationalId?.ReviewedAt,
                RejectionReason = nationalId?.RejectionReason
            };
        }

        private static void ResetVerificationStatus(Usernationalid nationalId)
        {
            nationalId.VerificationStatus = "Pending";
            nationalId.SubmittedAt = DateTime.UtcNow;
            nationalId.ReviewedAt = null;
            nationalId.RejectionReason = null;
        }

        private static UserNationalIdResponseDto MapToDto(Usernationalid nationalId)
        {
            return new UserNationalIdResponseDto
            {
                Id = nationalId.Id,
                UserId = nationalId.UserId,
                UserName = $"{nationalId.User?.Fname} {nationalId.User?.Lname}",
                FrontPic = nationalId.FrontPic,
                BackPic = nationalId.BackPic,
                SelfieWithId = nationalId.SelfieWithId,
                IsVerified = nationalId.VerificationStatus == "Approved",
                VerificationStatus = nationalId.VerificationStatus,
                SubmittedAt = nationalId.SubmittedAt,
                ReviewedAt = nationalId.ReviewedAt,
                RejectionReason = nationalId.RejectionReason
            };
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

        private string CurrentAdminId()
        {
            var authId = _http.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(authId))
                throw new UnauthorizedAccessException("User not logged in.");

            var userProfile = _userRepo.Query().FirstOrDefault(u => u.Authuserid == authId);
            if (userProfile != null)
                return userProfile.UserId.ToString(); 
            var adminUser = _userManagement.GEtUserById(authId).Result;
            if (adminUser != null)
                return adminUser.Id; 

            throw new UnauthorizedAccessException("User profile not found.");
        }

    }
}