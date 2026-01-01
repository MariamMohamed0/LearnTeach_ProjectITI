using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.UserSessionFeedbackDtos
{
    public class UpdateUserSessionFeedbackDto
    {
        [Range(1, 5, ErrorMessage = "Rating Value must be from 1 to 5")]
        public int? RatingValue { get; set; }

        [StringLength(500)]
        public string? Comment { get; set; }
    }
}
