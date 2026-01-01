using LearnTeach.Application.Dtos.SessionDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using static System.Net.WebRequestMethods;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionsController : ControllerBase
    {
        private readonly ISessionService _sessionService;
        private readonly IRepository<Usersprofile> _userRepo;
        private readonly IRepository<Skill> _skillRepo;
        private readonly IHttpContextAccessor _http;

        public SessionsController(ISessionService sessionService, IRepository<Usersprofile> userRepo, IRepository<Skill> skillRepo, IHttpContextAccessor http)
        {
            _sessionService = sessionService;
            _userRepo = userRepo;
            _skillRepo = skillRepo;
            _http = http;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateSessionDto dto)
        {
            var res = await _sessionService.CreateSessionAsync(dto);
            return Ok(res);
        }


        [HttpGet("me")]
        public async Task<IActionResult> GetMySessions([FromQuery] string role = null,[FromQuery] int pageNumber = 1,[FromQuery] int pageSize = 2,[FromQuery] string order = "desc") // "asc" أو "desc"
        {
            var (sessions, totalCount) = await _sessionService.GetSessionsForUserAsync(role, pageNumber, pageSize, order);

            return Ok(new
            {
                Sessions = sessions,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            });
        }


        [HttpPut("edit/{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] UpdateSessionDto dto)
        {
            var ok = await _sessionService.UpdateSessionAsync(id, dto);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _sessionService.DeleteSessionAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }
        [HttpGet("{sessionId}/join")]
        public async Task<IActionResult> JoinSession(int sessionId)
        {
            var zoomUrl = await _sessionService.JoinSessionAsync(sessionId);

            return Ok(new { joinUrl = zoomUrl });
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {



            var users = await _userRepo.Query()
                .Where(u => u.UserId != CurrentUserId()) 
                .Select(u => new
                {
                    u.UserId,
                    FullName = u.Fname + " " + u.Lname
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("skills")]
        public async Task<IActionResult> GetAllSkills()
        {
            var skills = await _skillRepo.Query()
                .Select(s => new { s.SkillId, s.Name })
                .ToListAsync();
            return Ok(skills);
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

    }
}