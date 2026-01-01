using LearnTeach.Application.Dtos.UserSessionFeedbackDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using static System.Net.WebRequestMethods;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserSessionFeedbackController : ControllerBase
    {
        private readonly IUserSessionFeedbackService _feedbackService;
        private readonly IRepository<Usersprofile> _userRepo;
        private readonly IHttpContextAccessor _http;

        public UserSessionFeedbackController(IUserSessionFeedbackService feedbackService, IRepository<Usersprofile> userRepo, IHttpContextAccessor http)
        {
            _feedbackService = feedbackService;
            _userRepo = userRepo;
            _http = http;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllFeedbacks()
        {
            try
            {
                var feedbacks = await _feedbackService.GetAllFeedbacksAsync();
                return Ok(feedbacks);
            }
            catch
            {
                return StatusCode(500, "An error occurred while retrieving the reviews");
            }
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetFeedback(int id)
        {
            try
            {
                var feedback = await _feedbackService.GetFeedbackByIdAsync(id);
                if (feedback == null) return NotFound($"Rating with numbers {id} Not found");
                return Ok(feedback);
            }
            catch
            {
                return StatusCode(500, "An error occurred while retrieving the rating");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateFeedback([FromBody] CreateUserSessionFeedbackDto createDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest("Invalid data");

                var feedback = await _feedbackService.CreateFeedbackAsync(createDto);

                return CreatedAtAction(nameof(GetFeedback), new { id = feedback.FeedbackId }, feedback);
            }
            catch (UnauthorizedAccessException ex) { return Forbid(ex.Message); }
            catch (ArgumentException ex) { return BadRequest(ex.Message); }
            catch (InvalidOperationException ex) { return Conflict(ex.Message); }
            catch { return StatusCode(500, "An error occurred while creating the evaluation"); }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateFeedback(int id, [FromBody] UpdateUserSessionFeedbackDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest("Invalid data");

                var feedback = await _feedbackService.UpdateFeedbackAsync(id, updateDto);

                if (feedback == null) return NotFound($"The rating with ID {id} does not exist");
                return Ok(feedback);
            }
            catch (UnauthorizedAccessException ex) { return Forbid(ex.Message); }
            catch { return StatusCode(500, "An error occurred while updating the rating"); }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteFeedback(int id)
        {
            try
            {
                var result = await _feedbackService.DeleteFeedbackAsync(id);
                if (!result) return NotFound($"The rating with ID {id} does not exist");
                return NoContent();
            }
            catch (UnauthorizedAccessException ex) { return Forbid(ex.Message); }
            catch { return StatusCode(500, "An error occurred while deleting the review"); }
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUserFeedbacks()
        {
            try
            {
                var feedbacks = await _feedbackService.GetUserFeedbacksAsync();
                return Ok(feedbacks);
            }
            catch
            {
                return StatusCode(500, "An error occurred while retrieving user ratings");
            }
        }

        [HttpGet("session/{sessionId:int}")]
        public async Task<IActionResult> GetSessionFeedbacks(int sessionId)
        {
            try
            {
                var feedbacks = await _feedbackService.GetSessionFeedbacksAsync(sessionId);
                return Ok(feedbacks);
            }
            catch
            {
                return StatusCode(500, "An error occurred while retrieving session ratings");
            }
        }

        [HttpGet("can-give-feedback/{sessionId:int}")]
        public async Task<IActionResult> CanGiveFeedback(int sessionId)
        {
            try
            {
                var canGiveFeedback = await _feedbackService.CanUserGiveFeedbackAsync(sessionId);
                return Ok(new { CanGiveFeedback = canGiveFeedback });
            }
            catch
            {
                return StatusCode(500, "An error occurred while validating the evaluation");
            }
        }


        [HttpGet("has-given-feedback/{sessionId:int}")]
        public async Task<IActionResult> HasGivenFeedback(int sessionId)
        {
            try
            {
                var hasGivenFeedback = await _feedbackService.HasUserGivenFeedbackAsync(sessionId);
                return Ok(new { HasGivenFeedback = hasGivenFeedback });
            }
            catch
            {
                return StatusCode(500, "An error occurred while verifying the previous evaluation");
            }
        }

        [HttpGet("stats/user/{userId}")]
        public async Task<IActionResult> GetUserFeedbackStats(int userId)
        {
            var stats = await _feedbackService.GetUserFeedbackStatsAsync(userId);
            return Ok(stats);
        }

        [HttpGet("my-rating")]
        public async Task<IActionResult> GetMyRating()
        {
            var result = await _feedbackService.GetUserAverageRatingAsync(CurrentUserId());

            return Ok(new
            {
                userId = CurrentUserId(),
                rating = result.Rating,
                badge = result.Badge,
                badgeUrl = result.BadgeUrl
            });
        }


        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUserRating(int id)
        {
            var result = await _feedbackService.GetUserAverageRatingAsync(id);

            return Ok(new
            {
                userId = id,
                rating = result.Rating,
                badge = result.Badge,
                badgeUrl = result.BadgeUrl
            });
        }

        [HttpGet("my-feedbacks")]
        public async Task<IActionResult> GetMyReceivedFeedbacks()
        {
            var feedbacks = await _feedbackService.GetFeedbacksRatedToUserAsync();
            return Ok(feedbacks);
        }


        [HttpGet("feedbacksById")]
        public async Task<IActionResult> GetFeedbacksById(int userId)
        {
            var feedbacks = await _feedbackService.GetFeedbacksRatedToUserAsync(userId);
            return Ok(feedbacks);
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