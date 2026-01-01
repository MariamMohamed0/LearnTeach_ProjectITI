using AutoMapper;
using LearnTeach.Application.Dtos.FeedbackDtos;
using LearnTeach.Application.Dtos.MaterialDtos;
using LearnTeach.Domain.Models;
 

namespace LearnTeach.Application.Mappings
{
    public class FeedbackProfile:Profile
    {
            public FeedbackProfile()
            {

             CreateMap<Feedback, FeedbackDto>()
                .ForMember(dest => dest.Feedbackrange, opt => opt.MapFrom(src => src.Feedbackrange))
                .ForMember(dest => dest.Feedbackdetails, opt => opt.MapFrom(src => src.Feedbackdetails))
                .ReverseMap();

            CreateMap<Feedback, UserFeedbackDto>()
                    .ForMember(dest => dest.Feedbackid, opt => opt.MapFrom(src => src.Feedbackid))
                    .ForMember(dest => dest.Feedbackrange, opt => opt.MapFrom(src => src.Feedbackrange))
                    .ForMember(dest => dest.Feedbackdetails, opt => opt.MapFrom(src => src.Feedbackdetails))
                    .ReverseMap();
            }

    }
}
