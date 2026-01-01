using AutoMapper;
using LearnTeach.Domain.Models;
using LearnTeach.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikesController : ControllerBase
    {
        private readonly LEANRANDTEACHContext _context;

        public LikesController(LEANRANDTEACHContext context)
        {
            _context = context;
        }

        public class LikeRequest
        {
            public int UserId { get; set; }
        }
        [HttpPost("/api/posts/{postId}/like")]
        public async Task<IActionResult> AddLike(int postId, [FromBody] LikeRequest request)
        {
            if (request == null || request.UserId <= 0)
                return BadRequest("Invalid request data.");

            var post = await _context.Posts.FindAsync(postId);
            if (post == null)
                return NotFound($"Post with ID {postId} not found.");

            var user = await _context.Usersprofiles.FindAsync(request.UserId);
            if (user == null)
                return NotFound($"User with ID {request.UserId} not found.");

            var existingLike = await _context.Likes
                .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == request.UserId);

            if (existingLike != null)
                return BadRequest("User already liked this post.");

            var like = new Like
            {
                PostId = postId,
                UserId = request.UserId,
            };

            _context.Likes.Add(like);
            await _context.SaveChangesAsync();

            post.TotalLiked = await _context.Likes.CountAsync(l => l.PostId == postId);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Like added successfully." });
        }

        [HttpDelete("/api/posts/{postId}/like")]
        public async Task<IActionResult> RemoveLike(int postId, [FromBody] LikeRequest request)
        {
            if (request == null || request.UserId <= 0)
                return BadRequest("Invalid request data.");

            var like = await _context.Likes
                .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == request.UserId);

            if (like == null)
                return NotFound("Like not found.");

            _context.Likes.Remove(like);
            await _context.SaveChangesAsync();

            var post = await _context.Posts.FindAsync(postId);
            if (post != null)
            {
                post.TotalLiked = await _context.Likes.CountAsync(l => l.PostId == postId);
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Like removed successfully." });
        }

        [HttpGet("/api/posts/{postId}/likes/count")]
        public async Task<ActionResult<int>> GetLikesCount(int postId)
        {
            var count = await _context.Likes.CountAsync(l => l.PostId == postId);
            return Ok(count);
        }
        [HttpGet("/api/posts/{postId}/isLiked/{userId}")]
        public async Task<ActionResult<bool>> IsPostLikedByUser(int postId, int userId)
        {
            var isLiked = await _context.Likes.AnyAsync(l => l.PostId == postId && l.UserId == userId);
            return Ok(isLiked);
        }

        [HttpGet("/api/posts/{postId}/likes")]
        public async Task<ActionResult<IEnumerable<object>>> GetPostLikes(int postId)
        {
            var likes = await _context.Likes
                .Include(l => l.User)
                .Where(l => l.PostId == postId)
                .Select(l => new
                {
                    l.UserId,
                    UserName = l.User != null ? l.User.Fname + " " + l.User.Lname : "Unknown"
                })
                .ToListAsync();

            return Ok(likes);
        }
    }
}
