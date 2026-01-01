using AutoMapper;
using LearnTeach.Application.Dtos;
using LearnTeach.Domain.Models;

namespace LearnTeach.Application.Mapping
{
    public class ReportProfile : Profile
    {

        public ReportProfile()
        {
            CreateMap<Report, ReportDto>()
                .ForMember(dest => dest.ReportId, opt => opt.MapFrom(src => src.ReportId))
                .ForMember(dest => dest.ReportDescription, opt => opt.MapFrom(src => src.ReportDescription))
                .ForMember(dest => dest.ReportStatus, opt => opt.MapFrom(src => src.ReportStatus))
                .ForMember(dest => dest.ReportedByName, opt => opt.MapFrom(src =>
                    src.ReportedByNavigation != null ? (src.ReportedByNavigation.Fname + " " + src.ReportedByNavigation.Lname) : null))
                .ForMember(dest => dest.ReportedUserName, opt => opt.MapFrom(src =>
                    src.ReportedUser != null ? (src.ReportedUser.Fname + " " + src.ReportedUser.Lname) : null))
                .ForMember(dest => dest.ReportedBy, opt => opt.MapFrom(src => src.ReportedBy))
                .ForMember(dest => dest.ReportedUserId, opt => opt.MapFrom(src => src.ReportedUserId))
                .ForMember(dest => dest.EntityType, opt => opt.MapFrom(src => src.EntityType))
                .ForMember(dest => dest.EntityId, opt => opt.MapFrom(src => src.EntityId))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt));
            CreateMap<CreateReportDto, Report>();
        }
    }
}
