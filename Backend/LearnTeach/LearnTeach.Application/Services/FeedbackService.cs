using AutoMapper;
using LearnTeach.Application.Dtos.FeedbackDtos;
using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Services
{
    public class FeedbackService : IFeedbackService
    {
        private readonly IRepository<Feedback> _repo;
        private readonly IRepository<Userfeedback> _userRepo;
        private readonly IMapper _mapper;
        public FeedbackService(IRepository<Feedback> repo, IRepository<Userfeedback> userRepo, IMapper mapper)
        { 
            _repo = repo;
            _userRepo = userRepo;
            _mapper = mapper;
        }
        public async Task AddFeedbackAsync(FeedbackDto dto)
        {
            var addFeedback = _mapper.Map<Feedback>(dto);
            await _repo.AddAsync(addFeedback); 
            await _repo.SaveChangesAsync();
            var userFeedback = new Userfeedback
            {
                UserId = dto.UserId,   
                Feedback = addFeedback
            };
            await _userRepo.AddAsync(userFeedback);
            await _userRepo.SaveChangesAsync();
        }

        public async Task<IEnumerable<UserFeedbackDto>> GetFeedbackByUserIdAsync(int userId)
        {
            var feedback = await _userRepo.Query()
               .Where(uf => uf.UserId == userId)
               .Include(uf => uf.Feedback)
               .Select(uf => uf.Feedback)
               .ToListAsync();
            return _mapper.Map<IEnumerable<UserFeedbackDto>>(feedback);
        }
        public async Task DeleteFeedbackAsync(int feedbackId,int userId)
        {
            var userFeedback = await _userRepo.Query()
                .FirstOrDefaultAsync(uf => uf.FeedbackId == feedbackId && uf.UserId == userId);
            if (userFeedback == null)
                throw new Exception("Feedback not found for the user");
            _userRepo.Remove(userFeedback);
            await _userRepo.SaveChangesAsync();
            var delete = await _repo.GetByIdAsync(feedbackId);
            if (delete == null)
                throw new Exception("Feedback not found");
            _repo.Remove(delete);
            await _repo.SaveChangesAsync();
        }      

    }
}
