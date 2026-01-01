//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;

//namespace LearnTeach.Api.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class PostController : ControllerBase
//    {
//    }
//}


using AutoMapper;
using LearnTeach.Application.Dtos.PostDtos;
using LearnTeach.Domain.Models;
using LearnTeach.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly LEANRANDTEACHContext _context;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _env;  // أضف ده عشان مجلد الرفع


        public PostController(LEANRANDTEACHContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // ✅ 1. Get all posts
        [HttpGet]
        public async Task<IActionResult> GetAllPosts()
        {
            var posts = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Skill)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .Include(p => p.PostMedias)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            var postDtos = _mapper.Map<List<PostDto>>(posts);
            return Ok(postDtos);
        }

        // ✅ 2. Get post by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPostById(int id)
        {
            var post = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Skill)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .Include(p => p.PostMedias)
                .FirstOrDefaultAsync(p => p.PostId == id);

            if (post == null)
                return NotFound(new { message = "Post not found" });

            var postDto = _mapper.Map<PostDto>(post);
            return Ok(postDto);
        }

        // ✅ 3. Get posts by specific user
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserPosts(int userId)
        {
            var posts = await _context.Posts
                .Where(p => p.UserId == userId)
                .Include(p => p.Skill)
                .Include(p => p.PostMedias)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            var postDtos = _mapper.Map<List<PostDto>>(posts);
            return Ok(postDtos);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost()
        {
            // قراءة البيانات من FormData مع فحص null
            var content = Request.Form["Content"].ToString();
            var skillId = int.TryParse(Request.Form["SkillId"], out var sId) ? sId : (int?)null;
            var categoryId = int.TryParse(Request.Form["CategoryId"], out var cId) ? cId : (int?)null;
            var userIdStr = Request.Form["UserId"].ToString();
            if (!int.TryParse(userIdStr, out var userId))
                return BadRequest("Invalid UserId.");

            if (string.IsNullOrWhiteSpace(content))
                return BadRequest("Content is required.");

            // فحص إذا كان CategoryId مطلوب (مش null)
            if (!categoryId.HasValue)
                return BadRequest("CategoryId is required.");

            // فحص إذا كان _env.WebRootPath null (عشان نتأكد من مجلد الرفع)
            //if (string.IsNullOrEmpty(_env.WebRootPath))
            //    return StatusCode(500, "Server configuration error: WebRootPath not set.");
            // التعامل مع الملفات
            var medias = new List<PostMediaDto>();
            var files = Request.Form.Files;
            if (files.Any())
            {
                //var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                //if (!Directory.Exists(uploadsFolder))
                //    Directory.CreateDirectory(uploadsFolder);

                foreach (var file in files)
                {
                    if (file.Length > 10 * 1024 * 1024)  // حد أقصى 10MB
                        return BadRequest("File too large.");

                    var allowedTypes = new[] { "image", "video", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
                    if (!allowedTypes.Any(t => file.ContentType.StartsWith(t)))
                        return BadRequest("Invalid file type.");

                    var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine(fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    medias.Add(new PostMediaDto
                    {
                        MediaUrl = $"/uploads/{fileName}",  // URL نسبي
                        EntityType = file.ContentType
                    });
                }
            }

            var createPostDto = new CreatePostDto
            {
                Content = content,
                SkillId = skillId,
                categoryId = categoryId.Value,
                UserId = userId,
                Medias = medias
            };

            var post = _mapper.Map<Post>(createPostDto);
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            var postDto = _mapper.Map<PostDto>(post);
            return CreatedAtAction(nameof(GetPostById), new { id = post.PostId }, postDto);
        }

        //    [HttpPost]
        //    public async Task<IActionResult> CreatePost([FromBody] CreatePostDto createPostDto)
        //    {
        //        if (!ModelState.IsValid)
        //            return BadRequest(ModelState);
        //    var post = _mapper.Map<Post>(createPostDto);

        //    _context.Posts.Add(post);
        //    await _context.SaveChangesAsync();
        //    var postDto = _mapper.Map<PostDto>(post);
        //    return CreatedAtAction(nameof(GetPostById), new { id = post.PostId
        //}, postDto);
        //}
        // ✅ 5. Update post (مع الإصلاحات)
        //[HttpPut("{id}")]
        //public async Task<IActionResult> UpdatePost(int id, [FromBody] UpdatePostDto updateDto)
        //{
        //    var post = await _context.Posts.FindAsync(id);
        //    if (post == null)
        //        return NotFound(new { message = "Post not found" });
        //    if (!ModelState.IsValid)
        //        return BadRequest(ModelState);
        //    // استخدم الـ mapping للتحديث، مع تجاهل الحقول null
        //    _mapper.Map(updateDto, post);
        //    await _context.SaveChangesAsync();
        //    var postDto = _mapper.Map<PostDto>(post);
        //    return Ok(postDto);
        //}
        // ✅ 5. Update post (مع الإصلاحات والتحقق من FK)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] UpdatePostDto updateDto)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return NotFound(new { message = "Post not found" });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            // تحقق من صحة SkillId إذا تم تمريره (غير null)
            if (updateDto.SkillId.HasValue)
            {
                var skillExists = await _context.Skills.AnyAsync(s => s.SkillId == updateDto.SkillId.Value);
                if (!skillExists)
                    return BadRequest(new { message = $"Skill with ID {updateDto.SkillId.Value} does not exist." });
            }

            // تحقق من صحة categoryId إذا تم تمريره (غير null)
            if (updateDto.categoryId.HasValue)
            {
                var categoryExists = await _context.Categoriesses.AnyAsync(c => c.CateId == updateDto.categoryId.Value);
                if (!categoryExists)
                    return BadRequest(new { message = $"Category with ID {updateDto.categoryId.Value} does not exist." });
            }

            // استخدم الـ mapping للتحديث، مع تجاهل الحقول null
            _mapper.Map(updateDto, post);
            await _context.SaveChangesAsync();

            var postDto = _mapper.Map<PostDto>(post);
            return Ok(postDto);
        }






        // ✅ 6. Delete post
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return NotFound(new { message = "Post not found" });

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Post deleted successfully" });
        }
        [HttpGet("GetPostsByFillter/{categoryId}")]
        public async Task<IActionResult> GetPostsByCategoryAsync(int categoryId)
        {
            var result = await _context.Posts
                .Where(p => p.categoryId == categoryId)
                .Select(p => new PostDto
                {
                    PostId = p.PostId,
                    Content = p.Content,
                    CategoryId = p.categoryId,
                    CreatedAt = p.CreatedAt
                }).ToListAsync();
            if (result == null || result.Count == 0)
            {
                return NotFound("No posts found for the specified category.");
            }
            return Ok(result);
        }
    }
}