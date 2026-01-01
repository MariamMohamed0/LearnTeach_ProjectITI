using LearnTeach.Application.Dtos.SessionDtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LearnTeach.Application.IServices
{
    public interface ISessionService
    {
        Task<SessionDto> CreateSessionAsync(CreateSessionDto dto);
        Task<(IEnumerable<SessionDto> Sessions, int TotalCount)> GetSessionsForUserAsync(
     string role = null,
     int pageNumber = 1,
     int pageSize = 10,
     string order = "desc");

        Task<bool> UpdateSessionAsync(int sessionId, UpdateSessionDto dto);
        Task<bool> DeleteSessionAsync(int sessionId);

        Task<string> JoinSessionAsync(int sessionId);
    }
}