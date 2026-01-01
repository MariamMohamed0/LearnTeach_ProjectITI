using AutoMapper;
using LearnTeach.Application.Dtos.CommentDtos;
using LearnTeach.Domain.Models;
using LearnTeach.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly LEANRANDTEACHContext _context;
        private readonly IMapper _mapper;

        public CommentsController(LEANRANDTEACHContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetComments()
        {
            var comments = await _context.Comments
                .Include(c => c.User)
                .ToListAsync();

            return _mapper.Map<List<CommentDto>>(comments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CommentDto>> GetComment(int id)
        {
            var comment = await _context.Comments
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.CommentId == id);

            if (comment == null) return NotFound();

            return _mapper.Map<CommentDto>(comment);
        }
        [HttpGet("/api/posts/{postId}/comments")]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetCommentsByPost(int postId)
        {
            var postExists = await _context.Posts.AnyAsync(p => p.PostId == postId);
            if (!postExists)
                return NotFound($"Post with ID {postId} not found.");

            var comments = await _context.Comments
                .Include(c => c.User)
                .Where(c => c.PostId == postId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            var commentDtos = _mapper.Map<List<CommentDto>>(comments);
            return Ok(commentDtos);
        }

        [HttpPost("/api/posts/{postId}/comments")]
        public async Task<ActionResult<CommentDto>> CreateComment(int postId, CreateCommentDto dto)
        {
            var post = await _context.Posts.FindAsync(postId);
            if (post == null) return NotFound($"Post with ID {postId} not found.");

            var comment = _mapper.Map<Comment>(dto);
            comment.PostId = postId;
            comment.CreatedAt = DateTime.UtcNow;

            _context.Comments.Add(comment);
            post.TotalComments = await _context.Comments.CountAsync(c => c.PostId == postId);

            await _context.SaveChangesAsync();

            var resultDto = _mapper.Map<CommentDto>(comment);
            return CreatedAtAction(nameof(GetComment), new { id = comment.CommentId }, resultDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, UpdateCommentDto dto)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound();

            _mapper.Map(dto, comment);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound();

            _context.Comments.Remove(comment);

            var post = await _context.Posts.FindAsync(comment.PostId);
            if (post != null)
            {
                post.TotalComments = await _context.Comments.CountAsync(c => c.PostId == comment.PostId) - 1;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

