using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.UserSessionFeedbackDtos
{
    public class CreateUserSessionFeedbackDto
    {
        [Required]
        [Range(1, 5, ErrorMessage = "Rating Value must be From 1 to 5")]
        public int RatingValue { get; set; }

        [Required]
        [StringLength(500, ErrorMessage = "The comment cannot exceed 500 characters")]
        public string Comment { get; set; }

        [Required]
        public int RatedToUserId { get; set; }

        [Required]
        public int SessionId { get; set; }
    }

}
