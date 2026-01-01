using LearnTeach.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserChatController : ControllerBase
    {
        private readonly LEANRANDTEACHContext _context;

        public UserChatController(LEANRANDTEACHContext context)
        {
            _context = context;
        }


        [HttpPost("create")]
        public IActionResult CreateChat([FromQuery] int user2)
        {
            try
            {
                var profileClaim = User.FindFirst("ProfileId")?.Value;
                if (string.IsNullOrEmpty(profileClaim))
                    return BadRequest("ProfileId missing in token");

                if (!int.TryParse(profileClaim, out int user1))
                    return BadRequest("ProfileId invalid");

                var ids = new List<int> { user1, user2 };
                ids.Sort(); 
                var chatId = $"{ids[0]}_{ids[1]}";

                return Ok(new { chatId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }



        [HttpGet("{chatId}")]
        public IActionResult GetChatMessages(string chatId)
        {
            var messages = _context.ChatMessages
                .Where(m => m.ChatId == chatId)
                .OrderBy(m => m.CreatedAt)   
                .Select(m => new
                {
                    senderId = m.SenderId,
                    message = m.Text,
                    createdAt = m.CreatedAt
                })
                .ToList();

            return Ok(messages);
        }

        [HttpGet("contacts")]
        public async Task<IActionResult> GetContacts()
        {
           
            var userId = User.Claims.FirstOrDefault(c => c.Type == "ProfileId")?.Value;
            if (userId == null) return BadRequest("UserId missing");

      
            var messages = await _context.ChatMessages
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .ToListAsync();

   
            var contacts = messages
                .Select(m =>
                {
                    
                    string contactId = m.SenderId == userId ? m.ReceiverId : m.SenderId;

                    var user = _context.Usersprofiles.FirstOrDefault(u => u.UserId.ToString() == contactId);

                    return new
                    {
                        id = contactId,
                        name = user != null ? $"{user.Fname} {user.Lname}" : "Unknown",
                        chatId = m.ChatId
                    };
                })
        
                .GroupBy(c => c.id)
                .Select(g => g.First())
                .ToList();

            return Ok(contacts);
        }



    }


}
