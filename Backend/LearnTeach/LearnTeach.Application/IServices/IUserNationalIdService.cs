using LearnTeach.Application.Dtos.NationalIdDtos;

namespace LearnTeach.Application.IServices
{
    public interface IUserNationalIdService
    {
        Task<UserNationalIdResponseDto> CreateAsync(int userId, CreateUserNationalIdDto dto);
        Task<UserNationalIdResponseDto?> UpdateByUserAsync(int userId, UpdateUserNationalIdDto dto);
        Task<UserNationalIdResponseDto?> GetByUserIdAsync(int userId);
        Task<UserNationalIdVerificationDto> GetVerificationStatusAsync(int userId);

        Task<IEnumerable<UserNationalIdResponseDto>> GetPendingVerificationsAsync();
        Task<UserNationalIdResponseDto?> GetByIdAsync(int id);
        Task<bool> VerifyNationalIdAsync(int id);
        Task<bool> RejectNationalIdAsync(int id, string reason);
        Task<bool> DeleteAsync(int id);
    }
}