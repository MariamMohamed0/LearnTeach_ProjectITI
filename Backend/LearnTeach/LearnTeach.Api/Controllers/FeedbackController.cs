using LearnTeach.Application.Dtos.FeedbackDtos;
using LearnTeach.Application.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
     private readonly IFeedbackService _service;
        public FeedbackController(IFeedbackService service)
        {
            _service = service;
        }
        [HttpPost]
        public async Task<IActionResult> AddFeedback([FromBody] FeedbackDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            await _service.AddFeedbackAsync(dto);
            return Ok(new { message ="Feedback submitted successfully" });
        }
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetFeedbackByUserId(int userId)
        {
            var feedback = await _service.GetFeedbackByUserIdAsync(userId);
            return Ok(feedback);
        }
        [HttpDelete("{feedbackId}")]
        public async Task<IActionResult> DeleteFeedback(int feedbackId,int userId)
        {
            await _service.DeleteFeedbackAsync(feedbackId,userId);
            return Ok(new { message = "Feedback deleted successfully" });
        } 
    }
}
