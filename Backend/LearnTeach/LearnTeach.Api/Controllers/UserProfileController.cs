using LearnTeach.Application.Dtos;
using LearnTeach.Application.Dtos.UserProfileDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Application.Services;
using LearnTeach.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using static System.Net.WebRequestMethods;

namespace LearnTeach.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserProfileService _userProfileService;
        private readonly IBadgeService badgeService;
        private readonly IAzureService _azureService;
        private readonly LEANRANDTEACHContext context;


        public UserProfileController(IUserProfileService userProfileService, IAzureService azureService, LEANRANDTEACHContext _context)
        {
            _userProfileService = userProfileService;
            _azureService = azureService;
            context = _context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProfiles()
        {
            try
            {
                var profiles = await _userProfileService.GetAllProfilesAsync();
                if (profiles == null || !profiles.Any())
                    return NotFound(new { Message = "No profiles found." });

                return Ok(profiles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error fetching profiles.", Error = ex.Message });
            }
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<UserProfileDto>> GetProfile(int id)
        {
            var profile = await _userProfileService.GetProfileAsync(id);
            if (profile == null)
                return NotFound();

            return Ok(profile);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromForm] UpdateUserProfileDto dto, IFormFile? file)
        {

            var profile = await _userProfileService.GetProfileAsync(id);
            if (profile == null)
                return NotFound(new { Message = "Profile not found." });


            profile.Fname = dto.Fname;
            profile.Lname = dto.Lname;
            profile.ExperienceText = dto.ExperienceText;

            try
            {
                if (file != null)
                {

                    if (!string.IsNullOrEmpty(profile.ProfilePic))
                    {
                        await _azureService.DeleteFileAsync(profile.ProfilePic);
                    }


                    profile.ProfilePic = await _azureService.UploadUserProfileAsync(file, id);
                }
                await _userProfileService.UpdateProfileEntityAsync(profile);

                return Ok(new
                {
                    Message = "Profile updated successfully",
                    ProfilePic = profile.ProfilePic
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while updating profile.", Error = ex.Message });
            }
        }

        [HttpPut("{id}/upload-picture")]
        public async Task<IActionResult> UploadProfilePicture(int id, IFormFile file)
        {
            var profile = await _userProfileService.GetProfileAsync(id);
            if (profile == null)
                return NotFound(new { Message = "Profile not found." });

            if (file == null || file.Length == 0)
                return BadRequest(new { Message = "No file uploaded." });

            try
            {
                if (!string.IsNullOrEmpty(profile.ProfilePic))
                {
                    await _azureService.DeleteFileAsync(profile.ProfilePic);
                }

                profile.ProfilePic = await _azureService.UploadUserProfileAsync(file, id);
                await _userProfileService.UpdateProfileEntityAsync(profile);

                return Ok(new
                {
                    Message = "Profile picture updated successfully",
                    ProfilePic = profile.ProfilePic
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred.", Error = ex.Message });
            }
        }
        [HttpPost]
        public async Task<IActionResult> CreateProfile([FromForm] CreateUserProfileDto dto, IFormFile? file)
        {
            try
            {

                var profile = new UserProfileDto
                {
                    Fname = dto.Fname,
                    Lname = dto.Lname,
                    ExperienceText = dto.ExperienceText
                };


                if (file != null && file.Length > 0)
                {
                    profile.ProfilePic = await _azureService.UploadUserProfileAsync(file, profile.UserId);
                }

                await _userProfileService.CreateProfileAsync(profile);

                return Ok(new
                {
                    Message = "Profile created successfully",
                    ProfilePic = profile.ProfilePic
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "An error occurred while creating the profile.",
                    Error = ex.Message
                });
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProfile(int id)
        {
            var profile = await _userProfileService.GetProfileAsync(id);
            if (profile == null)
                return NotFound(new { Message = "Profile not found." });

            try
            {
                if (!string.IsNullOrEmpty(profile.ProfilePic))
                    await _azureService.DeleteFileAsync(profile.ProfilePic);

                await _userProfileService.DeleteProfileAsync(id);

                return Ok(new { Message = "Profile deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error deleting profile.", Error = ex.Message });
            }
        }

        [HttpGet("DiamondCount/{userId}")]
        public async Task<IActionResult> GetUserDiamondCount(int userId)
        {
            // تأكد إن اليوزر موجود
            var user = await context.Usersprofiles
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
                return NotFound("User not found");

            // هات الدايموند لو موجود
            var diamond = await context.Diamonds
                .FirstOrDefaultAsync(d => d.UserId == userId);

            int totalPoints = diamond?.TotalPoints ?? 0;

            return Ok(new
            {
                UserId = userId,
                DiamondPoints = totalPoints
            });
        }

      
    }
}