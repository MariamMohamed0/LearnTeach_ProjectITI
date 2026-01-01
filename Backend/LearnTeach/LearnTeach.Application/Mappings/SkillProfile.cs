using AutoMapper;
using LearnTeach.Application.Dtos.AdminCertRepotDtos;
using LearnTeach.Domain.Models;

namespace LearnTeach.Application.Mappings
{
    public class SkillProfile : Profile
    {
        public SkillProfile()
        {
    
            CreateMap<Skill, SkillReadDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Cate.Name));


        CreateMap<UserSkills, SkillReadUserDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(us => us.Skill.SkillId))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(us => us.Skill.Name))
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(us => us.Skill.Cate.Name))
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(us => us.UserId))
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(us => $"{us.User.Fname} {us.User.Lname}"))
            .ForMember(dest => dest.GoodAtIt, opt => opt.MapFrom(us => us.GoodAtIt));

      
            CreateMap<SkillWriteDto, Skill>();
            CreateMap<SkillWriteUserDto, UserSkills>()
                .ForMember(dest => dest.GoodAtIt, opt => opt.MapFrom(src => src.GoodAtIt));
        }
    }


}
