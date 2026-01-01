using LearnTeach.Application.Dtos.FeedbackDtos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.IServices
{
    public interface IFeedbackService
    {
        Task AddFeedbackAsync(FeedbackDto dto);
        Task<IEnumerable<UserFeedbackDto>> GetFeedbackByUserIdAsync(int userId);
        Task DeleteFeedbackAsync(int feedbackId,int userId);

    }
}
